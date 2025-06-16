# Status Proyek & To-Do List Saran

## Status Proyek Saat Ini

Proyek 'Performance-Triggered Smart Contract with Escrowed Bonus Payouts' telah mencapai fase persiapan lingkungan dan kerangka dasar smart contract. Berikut adalah ringkasan progres terakhir:

*   **Setup Lingkungan:** Node.js, npm, Git, Hardhat, OpenZeppelin, dan dotenv telah terinstal dan dikonfigurasi. File `.env` telah dibuat dan diperbarui dengan GitHub Personal Access Token (PAT). File `hardhat.config.js` telah dikonfigurasi untuk Polygon Mumbai Testnet.
*   **Smart Contract:** Kerangka dasar smart contract `contracts/EscrowBonus.sol` telah dibuat, termasuk struktur data, fungsi `depositBonus`, `fulfill` (callback Chainlink), `reclaimBonus`, dan `updateChainlinkConfig`. Metrik commit telah diklarifikasi untuk memantau branch "Tank".
*   **Skrip Deployment:** Skrip `scripts/deployEscrowBonus.js` telah dibuat untuk deployment kontrak.
*   **Chainlink Function Code:** Kode JavaScript untuk Chainlink Function (`functions/github-commits.js`) telah dibuat untuk mengambil data commit dari GitHub API.
*   **Dokumentasi:** Dokumen `README.md`, `tumpukan-teknologi.md`, dan `rencana-implementasi.md` telah diperbarui untuk merekomendasikan penggunaan Ethers.js.

## Daftar Pekerjaan (To-Do List) Prioritas Tinggi untuk Masa Depan

Berikut adalah daftar pekerjaan prioritas tinggi berdasarkan `rencana-implementasi.md` dan progres saat ini:

1.  **Chainlink Oracle Setup (Krusial untuk Fungsionalitas Penuh):**
    *   Dapatkan Chainlink Function ID yang valid dengan mendeploy `functions/github-commits.js` ke Chainlink Functions.
    *   Perbarui `scripts/deployEscrowBonus.js` dengan Chainlink Function ID yang sebenarnya.
    *   Deploy `EscrowBonus.sol` ke Polygon Mumbai Testnet dengan konfigurasi Chainlink yang benar.
2.  **Pengujian Smart Contract Komprehensif:**
    *   Tulis unit test yang lengkap untuk semua fungsi di `EscrowBonus.sol`.
    *   Tulis integration test yang mensimulasikan interaksi Chainlink Oracle.
3.  **Pengembangan Frontend (dApp Minimalis):**
    *   Buat kerangka dasar frontend menggunakan React dan Ethers.js.
    *   Implementasikan fungsionalitas untuk manajer menyetor bonus dan menetapkan kondisi.
    *   Implementasikan tampilan status kontrak dan hasil payout.
4.  **Optimasi & Keamanan Smart Contract:**
    *   Lakukan audit keamanan dasar pada smart contract.
    *   Optimasi gas.
5.  **Ekspansi Metrik Kinerja:**
    *   Riset dan implementasikan integrasi dengan Trello/Jira API untuk metrik kinerja lainnya.

## Saran "Baby-Step To-Do List" Berikutnya

**Nama Baby-Step:** Implementasi Unit Test Awal untuk `EscrowBonus.sol`

**Tujuan:** Memastikan logika dasar smart contract `EscrowBonus.sol` berfungsi dengan benar secara independen, sebelum mengintegrasikannya sepenuhnya dengan Chainlink Oracle. Ini akan memvalidasi fungsi-fungsi inti seperti deposit, kondisi payout, dan reclaim.
