# Status Proyek, To-Do List, dan Saran

## Status Proyek Saat Ini
Kita akan memulai implementasi fitur utama untuk smart contract: mendefinisikan struktur kontrak dan fungsi escrow awal berdasarkan `rencana-implementasi.markdown`. Dokumen desain produk dan rencana implementasi awal telah selesai, serta tumpukan teknologi telah direkomendasikan. Belum ada codebase yang ada, sehingga langkah selanjutnya adalah menyiapkan lingkungan pengembangan.

## Daftar Pekerjaan (To-Do List) Prioritas Tinggi untuk Masa Depan

1.  **Pengembangan Smart Contract:**
    *   Setup proyek Hardhat untuk Polygon.
    *   Konstruksi Smart Contract (Solidity): fungsi untuk deposit bonus ke escrow, Chainlink API call untuk verifikasi commit, pembayaran otomatis/pengembalian dana.
    *   Unit Testing untuk fungsi smart contract.
2.  **Integrasi API GitHub:**
    *   Membuat Chainlink External Adapter untuk GitHub API.
    *   Mengatur webhook GitHub.
    *   Mengimplementasikan verifikasi data di smart contract.
3.  **Frontend dan Integrasi Wallet:**
    *   Mengembangkan UI aplikasi React.
    *   Mengintegrasikan MetaMask.
4.  **Deployment:**
    *   Deploy Smart Contract ke Polygon Testnet (Mumbai).
    *   Deploy Frontend.
    *   Host Backend/Chainlink Node.

## Saran "Baby-Step To-Do List" untuk Langkah Implementasi Berikutnya

**Baby-Step: Inisialisasi Proyek Hardhat untuk Pengembangan Smart Contract**

Ini adalah unit pekerjaan kecil yang logis dan dapat diuji untuk memulai pengembangan smart contract. Langkah ini akan menyiapkan lingkungan dasar yang diperlukan sebelum menulis kode Solidity.
