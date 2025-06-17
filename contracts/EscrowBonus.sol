// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24; // Sesuaikan dengan versi di hardhat.config.js

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/Chainlink.sol"; // Explicit import

contract EscrowBonus is Ownable, ChainlinkClient {
    using Chainlink for Chainlink.Request; // Explicit using statement

    // State variables
    struct BonusContract {
        address payable recipient;
        uint256 amount;
        string githubRepoOwner;
        string githubRepoName;
        string githubBranch; // New: specific branch to monitor
        string githubUsername; // The user whose commits are being monitored
        uint256 targetCommits;
        uint256 deadline; // Unix timestamp
        bool isPaid;
        bool isActive; // To manage contract lifecycle
    }

    mapping(bytes32 => BonusContract) public bonusContracts; // requestId to BonusContract

    // Chainlink specific variables
    bytes32 private jobId;
    uint256 private fee;

    // Events
    event BonusDeposited(bytes32 indexed requestId, address indexed manager, address indexed recipient, uint256 amount, string githubRepoOwner, string githubRepoName, string githubBranch, string githubUsername, uint256 targetCommits, uint256 deadline);
    event BonusPaid(bytes32 indexed requestId, address indexed recipient, uint256 amount);
    event BonusReclaimed(bytes32 indexed requestId, address indexed manager, uint256 amount);
    event ChainlinkRequested(bytes32 indexed requestId, string url, string path, int256 times);
    event ChainlinkFulfilled(bytes32 indexed requestId, int256 commits);

    constructor(address _link, bytes32 _jobId, uint256 _fee) Ownable(msg.sender) {
        setChainlinkToken(_link);
        jobId = _jobId;
        fee = _fee;
    }

    /**
     * @dev Manajer menyetor bonus dan menetapkan kondisi.
     * @param _recipient Alamat dompet penerima bonus.
     * @param _amount Jumlah bonus dalam WEI.
     * @param _githubRepoOwner Pemilik repositori GitHub (e.g., "octocat").
     * @param _githubRepoName Nama repositori GitHub (e.g., "hello-world").
     * @param _githubBranch Nama branch GitHub yang akan dipantau (e.g., "Tank").
     * @param _githubUsername Username GitHub pengembang yang commit-nya akan dipantau.
     * @param _targetCommits Jumlah commit yang harus dicapai.
     * @param _deadline Batas waktu dalam Unix timestamp.
     */
    function depositBonus(
        address payable _recipient,
        uint256 _amount,
        string memory _githubRepoOwner,
        string memory _githubRepoName,
        string memory _githubBranch,
        string memory _githubUsername,
        uint256 _targetCommits,
        uint256 _deadline
    ) public payable {
        require(msg.value == _amount, "Jumlah ETH yang dikirim harus sesuai dengan jumlah bonus.");
        require(_recipient != address(0), "Alamat penerima tidak valid.");
        require(_amount > 0, "Jumlah bonus harus lebih dari nol.");
        require(bytes(_githubRepoOwner).length > 0, "Nama pemilik repo GitHub tidak boleh kosong.");
        require(bytes(_githubRepoName).length > 0, "Nama repo GitHub tidak boleh kosong.");
        require(bytes(_githubBranch).length > 0, "Nama branch GitHub tidak boleh kosong.");
        require(bytes(_githubUsername).length > 0, "Username GitHub tidak boleh kosong.");
        require(_targetCommits > 0, "Target commit harus lebih dari nol.");
        require(_deadline > block.timestamp, "Batas waktu harus di masa depan.");

        // Buat permintaan Chainlink untuk mendapatkan jumlah commit saat ini
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        req.add("repoOwner", _githubRepoOwner);
        req.add("repoName", _githubRepoName);
        req.add("branch", _githubBranch);
        req.add("username", _githubUsername);
        // Path untuk parsing respons dari Chainlink External Adapter
        req.add("path", "data.commits"); // Asumsi External Adapter mengembalikan JSON dengan path ini
        req.addInt("times", 1); // Untuk mengonversi hasil menjadi integer jika perlu

        bytes32 requestId = sendChainlinkRequest(req, fee);

        bonusContracts[requestId] = BonusContract({
            recipient: _recipient,
            amount: _amount,
            githubRepoOwner: _githubRepoOwner,
            githubRepoName: _githubRepoName,
            githubBranch: _githubBranch,
            githubUsername: _githubUsername,
            targetCommits: _targetCommits,
            deadline: _deadline,
            isPaid: false,
            isActive: true
        });

        emit BonusDeposited(requestId, msg.sender, _recipient, _amount, _githubRepoOwner, _githubRepoName, _githubBranch, _githubUsername, _targetCommits, _deadline);
    }

    /**
     * @dev Fungsi callback yang dipanggil oleh Chainlink Oracle setelah permintaan dipenuhi.
     * @param _requestId ID permintaan Chainlink.
     * @param _commits Jumlah commit yang diterima dari oracle.
     */
    function fulfill(bytes32 _requestId, int256 _commits) public recordChainlinkFulfillment(_requestId) {
        require(bonusContracts[_requestId].isActive, "Kontrak bonus tidak aktif atau tidak ada.");

        BonusContract storage currentContract = bonusContracts[_requestId];
        emit ChainlinkFulfilled(_requestId, _commits);

        // Cek kondisi payout
        if (uint256(_commits) >= currentContract.targetCommits && block.timestamp <= currentContract.deadline) {
            // Payout otomatis
            currentContract.recipient.transfer(currentContract.amount);
            currentContract.isPaid = true;
            currentContract.isActive = false; // Nonaktifkan kontrak setelah pembayaran
            emit BonusPaid(_requestId, currentContract.recipient, currentContract.amount);
        } else if (block.timestamp > currentContract.deadline) {
            // Batas waktu terlampaui, kontrak tidak lagi aktif untuk payout
            currentContract.isActive = false;
            // Bonus dapat diklaim kembali oleh manajer
        }
    }

    /**
     * @dev Memungkinkan manajer untuk mengklaim kembali bonus jika kondisi tidak terpenuhi setelah deadline.
     * @param _requestId ID permintaan Chainlink yang terkait dengan kontrak bonus.
     */
    function reclaimBonus(bytes32 _requestId) public onlyOwner {
        BonusContract storage currentContract = bonusContracts[_requestId];
        require(currentContract.isActive == false, "Kontrak masih aktif atau sudah dibayar.");
        require(currentContract.isPaid == false, "Bonus sudah dibayar.");
        require(block.timestamp > currentContract.deadline, "Batas waktu belum terlampaui.");
        require(address(this).balance >= currentContract.amount, "Kontrak tidak memiliki cukup dana.");

        // Kembalikan dana ke pemilik kontrak (manajer)
        payable(owner()).transfer(currentContract.amount);
        emit BonusReclaimed(_requestId, owner(), currentContract.amount);
    }

    /**
     * @dev Fungsi untuk memperbarui Chainlink Job ID dan Fee. Hanya pemilik kontrak yang bisa memanggil.
     * @param _newJobId Job ID baru.
     * @param _newFee Fee baru.
     */
    function updateChainlinkConfig(bytes32 _newJobId, uint256 _newFee) public onlyOwner {
        jobId = _newJobId;
        fee = _newFee;
    }

    // Fungsi fallback untuk menerima ETH
    receive() external payable {}
}
