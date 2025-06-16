# Rencana Implementasi Awal untuk MVP: Performance-Triggered Smart Contract

MVP (Minimum Viable Product) akan fokus pada demonstrasi fitur inti: pemantauan sederhana, escrow bonus, dan payout otomatis untuk satu skenario metrik (jumlah commit GitHub).

## 1. Fase Perencanaan & Setup (Minggu 1)

*   **1.1. Inisialisasi Proyek:**
    *   Buat repositori GitHub baru.
    *   Inisialisasi proyek Hardhat: `npx hardhat init`.
    *   Konfigurasi Hardhat untuk terhubung ke jaringan Polygon Mumbai Testnet (atau jaringan testnet EVM-compatible lainnya).
*   **1.2. Desain Smart Contract (Awal):**
    *   Definisikan fungsi dasar untuk `EscrowBonus.sol`:
        *   `depositBonus(address recipient, uint256 amount, string memory githubRepo, uint256 targetCommits, uint256 deadline)`: Fungsi untuk manajer menyetor bonus dan menetapkan kondisi.
        *   `checkPerformance()`: Fungsi yang akan dipanggil oleh oracle untuk memverifikasi kinerja.
        *   `payoutBonus()`: Fungsi untuk mencairkan bonus jika kondisi terpenuhi.
        *   `reclaimBonus()`: Fungsi untuk manajer mengambil kembali bonus jika kondisi tidak terpenuhi.
    *   Definisikan event untuk logging transaksi (misalnya, `BonusDeposited`, `BonusPaid`, `BonusReclaimed`).
*   **1.3. Riset Oracle (Chainlink):**
    *   Pahami cara kerja Chainlink External Adapters atau Chainlink Functions untuk mengambil data dari GitHub API.
    *   Identifikasi endpoint GitHub API yang relevan untuk mendapatkan jumlah commit pengguna di repositori tertentu.

## 2. Fase Pengembangan Smart Contract (Minggu 2-3)

*   **2.1. Implementasi Smart Contract `EscrowBonus.sol`:**
    *   Tulis kode Solidity untuk fungsi-fungsi yang didefinisikan di atas.
    *   Pastikan penggunaan `require` statement untuk validasi input dan `onlyOwner` atau kontrol akses yang sesuai.
    *   Integrasikan dengan Chainlink Oracle:
        *   Gunakan kontrak `ChainlinkClient` untuk membuat permintaan data ke oracle.
        *   Definisikan `requestId` dan `callbackFunction` untuk menerima respons dari oracle.
*   **2.2. Pengembangan Chainlink External Adapter (atau Chainlink Functions):**
    *   Buat External Adapter (misalnya, menggunakan Node.js/Python) yang dapat:
        *   Menerima permintaan dari Chainlink node (berisi `githubRepo` dan `username`).
        *   Membuat permintaan ke GitHub API (misalnya, `GET /repos/{owner}/{repo}/contributors` atau `GET /repos/{owner}/{repo}/commits?author={username}`).
        *   Memparsing respons untuk mendapatkan jumlah commit.
        *   Mengirimkan jumlah commit kembali ke Chainlink node.
    *   Atau, gunakan Chainlink Functions untuk logika on-chain yang lebih ringan.
*   **2.3. Pengujian Smart Contract:**
    *   Tulis unit test menggunakan Hardhat (Chai, Waffle) untuk setiap fungsi smart contract.
    *   Uji skenario positif (bonus dicairkan) dan negatif (bonus dikembalikan, kondisi tidak terpenuhi).
    *   Simulasikan respons oracle dalam pengujian.

## 3. Fase Deployment & Integrasi (Minggu 4)

*   **3.1. Deployment Smart Contract:**
    *   Deploy `EscrowBonus.sol` ke Polygon Mumbai Testnet menggunakan Hardhat.
    *   Catat alamat kontrak yang di-deploy.
*   **3.2. Deployment Chainlink External Adapter:**
    *   Deploy External Adapter ke platform cloud (misalnya, AWS Lambda, Google Cloud Functions) dan konfigurasikan Chainlink node untuk menggunakannya.
    *   Atau, siapkan Chainlink Functions environment.
*   **3.3. Pengembangan Frontend (Minimalis):**
    *   Buat antarmuka pengguna sederhana (misalnya, menggunakan React/HTML/CSS/JS) yang memungkinkan:
        *   Manajer untuk menyetor bonus dan menetapkan kondisi (memanggil `depositBonus`).
        *   Menampilkan status kontrak (misalnya, jumlah commit saat ini, status bonus).
    *   Gunakan Ethers.js untuk berinteraksi dengan smart contract.
*   **3.4. Demonstrasi MVP:**
    *   Demonstrasikan alur kerja lengkap: manajer menyetor bonus, oracle memantau commit, dan bonus dicairkan secara otomatis setelah target tercapai.

## 4. Metrik Keberhasilan MVP

*   Smart contract berhasil di-deploy dan berfungsi di testnet.
*   Oracle (Chainlink) berhasil mengambil data commit dari GitHub API dan mengirimkannya ke smart contract.
*   Bonus berhasil dikunci dalam escrow dan dicairkan secara otomatis berdasarkan kondisi commit.
*   Antarmuka pengguna minimal dapat berinteraksi dengan smart contract.

## 5. Lingkup MVP (Batasan)

*   Hanya mendukung satu metrik kinerja: jumlah commit GitHub.
*   Tidak ada antarmuka pengguna yang lengkap untuk semua fitur (fokus pada fungsi inti).
*   Tidak ada fitur manajemen pengguna atau otentikasi yang kompleks.
*   Fokus pada fungsionalitas inti blockchain, bukan pada pengalaman pengguna yang disempurnakan.
