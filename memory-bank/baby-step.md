# Baby-Step To-Do List: Implementasi Unit Test Awal untuk `EscrowBonus.sol`

**Tujuan:** Memastikan logika dasar smart contract `EscrowBonus.sol` berfungsi dengan benar secara independen dari Chainlink Oracle. Ini akan memvalidasi fungsi-fungsi inti seperti deposit bonus, kondisi payout, dan pengembalian dana.

**Estimasi Waktu:** 1-2 jam

---

## Sub-Tugas 1: Buat File Pengujian Baru

*   **Deskripsi Tugas:** Buat file JavaScript baru untuk unit test kontrak `EscrowBonus.sol`. Hardhat secara otomatis menyiapkan lingkungan pengujian dengan Chai dan Waffle.
*   **File yang Dibuat/Dimodifikasi:** `test/EscrowBonus.test.js`
*   **Langkah-langkah:**
    1.  Buka terminal di root proyek Anda (`d:/Games/MyProject/EscrowFlow/EscrowFlow`).
    2.  Buat file baru:
        ```bash
        touch test/EscrowBonus.test.js
        ```
    3.  Buka `test/EscrowBonus.test.js` dan tambahkan kerangka dasar pengujian:
        ```javascript
        const { expect } = require("chai");
        const { ethers } = require("hardhat");

        describe("EscrowBonus", function () {
            let EscrowBonus;
            let escrowBonus;
            let owner;
            let addr1;
            let addr2;
            let addrs;
            let linkToken; // Placeholder for LINK token contract
            let jobId;
            let fee;

            // Before each test, deploy a new contract
            beforeEach(async function () {
                [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

                // Mock LINK token for testing purposes (replace with actual LINK in deployment)
                const MockLink = await ethers.getContractFactory("LinkToken"); // Assuming LinkToken is available or mocked
                linkToken = await MockLink.deploy();
                await linkToken.deployed();

                jobId = ethers.utils.formatBytes32String("test_job_id");
                fee = ethers.utils.parseUnits("0.1", "ether"); // 0.1 LINK

                EscrowBonus = await ethers.getContractFactory("EscrowBonus");
                escrowBonus = await EscrowBonus.deploy(linkToken.address, jobId, fee);
                await escrowBonus.deployed();
            });

            // Test cases will go here
        });
        ```
*   **Kriteria Penerimaan:** File `test/EscrowBonus.test.js` berhasil dibuat dan tidak ada error sintaks saat dibuka di editor.

---

## Sub-Tugas 2: Uji Fungsi `depositBonus`

*   **Deskripsi Tugas:** Tulis unit test untuk memverifikasi bahwa fungsi `depositBonus` bekerja dengan benar, termasuk validasi input dan penyimpanan data kontrak.
*   **File yang Dimodifikasi:** `test/EscrowBonus.test.js`
*   **Langkah-langkah:**
    1.  Tambahkan blok `describe` baru di dalam `EscrowBonus` `describe` block:
        ```javascript
        // ... (inside describe("EscrowBonus", function () { ... }))

        describe("depositBonus", function () {
            const bonusAmount = ethers.utils.parseEther("1"); // 1 ETH
            const githubRepoOwner = "owner";
            const githubRepoName = "repo";
            const githubBranch = "Tank";
            const githubUsername = "dev_user";
            const targetCommits = 50;
            const deadline = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days from now

            it("Should allow owner to deposit bonus and set contract details", async function () {
                await expect(escrowBonus.connect(owner).depositBonus(
                    addr1.address,
                    bonusAmount,
                    githubRepoOwner,
                    githubRepoName,
                    githubBranch,
                    githubUsername,
                    targetCommits,
                    deadline,
                    { value: bonusAmount }
                )).to.emit(escrowBonus, "BonusDeposited");

                // Verify contract state
                const requestId = (await escrowBonus.queryFilter("BonusDeposited"))[0].args.requestId;
                const contractDetails = await escrowBonus.bonusContracts(requestId);

                expect(contractDetails.recipient).to.equal(addr1.address);
                expect(contractDetails.amount).to.equal(bonusAmount);
                expect(contractDetails.githubRepoOwner).to.equal(githubRepoOwner);
                expect(contractDetails.githubRepoName).to.equal(githubRepoName);
                expect(contractDetails.githubBranch).to.equal(githubBranch);
                expect(contractDetails.githubUsername).to.equal(githubUsername);
                expect(contractDetails.targetCommits).to.equal(targetCommits);
                expect(contractDetails.deadline).to.equal(deadline);
                expect(contractDetails.isPaid).to.be.false;
                expect(contractDetails.isActive).to.be.true;
            });

            it("Should revert if sent ETH does not match bonus amount", async function () {
                await expect(escrowBonus.connect(owner).depositBonus(
                    addr1.address,
                    bonusAmount,
                    githubRepoOwner,
                    githubRepoName,
                    githubBranch,
                    githubUsername,
                    targetCommits,
                    deadline,
                    { value: ethers.utils.parseEther("0.5") } // Sending less ETH
                )).to.be.revertedWith("Jumlah ETH yang dikirim harus sesuai dengan jumlah bonus.");
            });

            it("Should revert if recipient address is zero", async function () {
                await expect(escrowBonus.connect(owner).depositBonus(
                    ethers.constants.AddressZero,
                    bonusAmount,
                    githubRepoOwner,
                    githubRepoName,
                    githubBranch,
                    githubUsername,
                    targetCommits,
                    deadline,
                    { value: bonusAmount }
                )).to.be.revertedWith("Alamat penerima tidak valid.");
            });

            // Tambahkan lebih banyak test case untuk validasi input lainnya (amount, repoOwner, repoName, branch, username, targetCommits, deadline)
        });
        ```
*   **Kriteria Penerimaan:**
    *   Jalankan `npx hardhat test test/EscrowBonus.test.js`.
    *   Semua test case yang ditambahkan untuk `depositBonus` harus lolos.

---

## Sub-Tugas 3: Uji Fungsi `fulfill` (Simulasi Oracle Callback)

*   **Deskripsi Tugas:** Tulis unit test untuk mensimulasikan panggilan `fulfill` dari Chainlink Oracle dan memverifikasi logika payout dan penanganan deadline.
*   **File yang Dimodifikasi:** `test/EscrowBonus.test.js`
*   **Langkah-langkah:**
    1.  Tambahkan blok `describe` baru di dalam `EscrowBonus` `describe` block:
        ```javascript
        // ... (inside describe("EscrowBonus", function () { ... }))

        describe("fulfill", function () {
            const bonusAmount = ethers.utils.parseEther("1");
            const githubRepoOwner = "owner";
            const githubRepoName = "repo";
            const githubBranch = "Tank";
            const githubUsername = "dev_user";
            const targetCommits = 50;
            let requestId;

            beforeEach(async function () {
                const deadline = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days from now
                await escrowBonus.connect(owner).depositBonus(
                    addr1.address,
                    bonusAmount,
                    githubRepoOwner,
                    githubRepoName,
                    githubBranch,
                    githubUsername,
                    targetCommits,
                    deadline,
                    { value: bonusAmount }
                );
                requestId = (await escrowBonus.queryFilter("BonusDeposited"))[0].args.requestId;

                // Fund the LINK token to the contract for Chainlink requests
                await linkToken.transfer(escrowBonus.address, ethers.utils.parseEther("1")); // Transfer 1 LINK
            });

            it("Should pay bonus if target commits met before deadline", async function () {
                const initialRecipientBalance = await ethers.provider.getBalance(addr1.address);

                // Simulate Chainlink callback with enough commits
                await expect(escrowBonus.connect(owner).fulfill(requestId, targetCommits + 10)) // +10 commits to ensure target met
                    .to.emit(escrowBonus, "ChainlinkFulfilled")
                    .withArgs(requestId, targetCommits + 10)
                    .and.to.emit(escrowBonus, "BonusPaid")
                    .withArgs(requestId, addr1.address, bonusAmount);

                const finalRecipientBalance = await ethers.provider.getBalance(addr1.address);
                expect(finalRecipientBalance).to.be.closeTo(initialRecipientBalance.add(bonusAmount), ethers.utils.parseEther("0.001")); // Allow for gas cost

                const contractDetails = await escrowBonus.bonusContracts(requestId);
                expect(contractDetails.isPaid).to.be.true;
                expect(contractDetails.isActive).to.be.false;
            });

            it("Should not pay bonus if target commits not met before deadline", async function () {
                const initialRecipientBalance = await ethers.provider.getBalance(addr1.address);

                // Simulate Chainlink callback with insufficient commits
                await expect(escrowBonus.connect(owner).fulfill(requestId, targetCommits - 10)) // -10 commits
                    .to.emit(escrowBonus, "ChainlinkFulfilled")
                    .withArgs(requestId, targetCommits - 10);

                const finalRecipientBalance = await ethers.provider.getBalance(addr1.address);
                expect(finalRecipientBalance).to.equal(initialRecipientBalance); // Balance should not change

                const contractDetails = await escrowBonus.bonusContracts(requestId);
                expect(contractDetails.isPaid).to.be.false;
                expect(contractDetails.isActive).to.be.true; // Still active until deadline passes or reclaimed
            });

            it("Should not pay bonus if deadline passed, even if commits met", async function () {
                // Advance time past deadline
                await ethers.provider.send("evm_increaseTime", [30 * 24 * 60 * 60 + 1]); // 30 days + 1 second
                await ethers.provider.send("evm_mine"); // Mine a new block

                const initialRecipientBalance = await ethers.provider.getBalance(addr1.address);

                await expect(escrowBonus.connect(owner).fulfill(requestId, targetCommits + 10))
                    .to.emit(escrowBonus, "ChainlinkFulfilled")
                    .withArgs(requestId, targetCommits + 10);

                const finalRecipientBalance = await ethers.provider.getBalance(addr1.address);
                expect(finalRecipientBalance).to.equal(initialRecipientBalance); // Balance should not change

                const contractDetails = await escrowBonus.bonusContracts(requestId);
                expect(contractDetails.isPaid).to.be.false;
                expect(contractDetails.isActive).to.be.false; // Should be inactive after deadline
            });
        });
        ```
*   **Kriteria Penerimaan:**
    *   Jalankan `npx hardhat test test/EscrowBonus.test.js`.
    *   Semua test case yang ditambahkan untuk `fulfill` harus lolos.

---

## Sub-Tugas 4: Uji Fungsi `reclaimBonus`

*   **Deskripsi Tugas:** Tulis unit test untuk memverifikasi bahwa manajer dapat mengklaim kembali bonus jika kondisi tidak terpenuhi dan batas waktu telah terlampaui.
*   **File yang Dimodifikasi:** `test/EscrowBonus.test.js`
*   **Langkah-langkah:**
    1.  Tambahkan blok `describe` baru di dalam `EscrowBonus` `describe` block:
        ```javascript
        // ... (inside describe("EscrowBonus", function () { ... }))

        describe("reclaimBonus", function () {
            const bonusAmount = ethers.utils.parseEther("1");
            const githubRepoOwner = "owner";
            const githubRepoName = "repo";
            const githubBranch = "Tank";
            const githubUsername = "dev_user";
            const targetCommits = 50;
            let requestId;

            beforeEach(async function () {
                const deadline = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days from now
                await escrowBonus.connect(owner).depositBonus(
                    addr1.address,
                    bonusAmount,
                    githubRepoOwner,
                    githubRepoName,
                    githubBranch,
                    githubUsername,
                    targetCommits,
                    deadline,
                    { value: bonusAmount }
                );
                requestId = (await escrowBonus.queryFilter("BonusDeposited"))[0].args.requestId;

                // Simulate Chainlink callback with insufficient commits
                await escrowBonus.connect(owner).fulfill(requestId, targetCommits - 10); // Not enough commits

                // Advance time past deadline
                await ethers.provider.send("evm_increaseTime", [30 * 24 * 60 * 60 + 1]); // 30 days + 1 second
                await ethers.provider.send("evm_mine"); // Mine a new block
            });

            it("Should allow owner to reclaim bonus if not paid and deadline passed", async function () {
                const initialOwnerBalance = await ethers.provider.getBalance(owner.address);

                await expect(escrowBonus.connect(owner).reclaimBonus(requestId))
                    .to.emit(escrowBonus, "BonusReclaimed")
                    .withArgs(requestId, owner.address, bonusAmount);

                const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
                expect(finalOwnerBalance).to.be.closeTo(initialOwnerBalance.add(bonusAmount), ethers.utils.parseEther("0.001")); // Allow for gas cost

                const contractDetails = await escrowBonus.bonusContracts(requestId);
                expect(contractDetails.isActive).to.be.false; // Should be inactive after reclaim
            });

            it("Should revert if bonus already paid", async function () {
                // First, pay the bonus
                await escrowBonus.connect(owner).fulfill(requestId, targetCommits + 10); // Enough commits

                await expect(escrowBonus.connect(owner).reclaimBonus(requestId))
                    .to.be.revertedWith("Bonus sudah dibayar.");
            });

            it("Should revert if deadline not passed", async function () {
                // Reset time for this specific test
                await ethers.provider.send("evm_revert", ["0x1"]); // Revert to snapshot before time increase
                await ethers.provider.send("evm_snapshot"); // Take new snapshot

                // Deposit new contract with future deadline
                const futureDeadline = Math.floor(Date.now() / 1000) + (1 * 24 * 60 * 60); // 1 day from now
                await escrowBonus.connect(owner).depositBonus(
                    addr1.address,
                    bonusAmount,
                    githubRepoOwner,
                    githubRepoName,
                    githubBranch,
                    githubUsername,
                    targetCommits,
                    futureDeadline,
                    { value: bonusAmount }
                );
                const newRequestId = (await escrowBonus.queryFilter("BonusDeposited"))[1].args.requestId;

                await expect(escrowBonus.connect(owner).reclaimBonus(newRequestId))
                    .to.be.revertedWith("Batas waktu belum terlampaui.");
            });
        });
        ```
*   **Kriteria Penerimaan:**
    *   Jalankan `npx hardhat test test/EscrowBonus.test.js`.
    *   Semua test case yang ditambahkan untuk `reclaimBonus` harus lolos.

---

## Sub-Tugas 5: Instalasi `LinkToken` untuk Pengujian

*   **Deskripsi Tugas:** Untuk menjalankan unit test yang melibatkan `LinkToken` (seperti yang digunakan dalam `beforeEach` untuk `linkToken = await MockLink.deploy()`), Anda perlu memastikan kontrak `LinkToken` tersedia di lingkungan Hardhat Anda. Ini biasanya disediakan oleh `@chainlink/contracts`.
*   **File yang Dimodifikasi:** Tidak ada, ini adalah langkah instalasi.
*   **Langkah-langkah:**
    1.  Pastikan Anda telah menginstal `@chainlink/contracts`. Jika belum, jalankan:
        ```bash
        npm install --save-dev @chainlink/contracts
        ```
        *(Catatan: Kita sudah melakukan ini sebelumnya, jadi ini hanya untuk konfirmasi.)*
    2.  Pastikan `hardhat.config.js` Anda mengimpor `@nomicfoundation/hardhat-toolbox` karena ini biasanya mencakup plugin yang diperlukan untuk menemukan kontrak dari `node_modules`.

*   **Kriteria Penerimaan:** `npm install` untuk `@chainlink/contracts` berhasil, dan Hardhat dapat menemukan kontrak `LinkToken` saat menjalankan tes.

---

**Setelah menyelesaikan semua sub-tugas ini, Anda akan memiliki unit test yang solid untuk logika inti smart contract `EscrowBonus.sol`.**
