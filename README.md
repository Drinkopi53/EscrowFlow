# Performance-Triggered Smart Contract with Escrowed Bonus Payouts

## Deskripsi Proyek

Proyek ini bertujuan untuk membangun sistem terdesentralisasi yang meningkatkan kepercayaan dan efisiensi dalam kolaborasi tim remote. Dengan memanfaatkan smart contract di blockchain, proyek ini akan secara otomatis memverifikasi kontribusi individu berdasarkan metrik kinerja yang terukur (misalnya, jumlah commit GitHub) dan mencairkan bonus yang telah dikunci dalam escrow jika target tercapai. Ini mengatasi masalah umum seperti kurangnya transparansi, keterlambatan pembayaran bonus, dan ketidakadilan dalam penilaian performa di lingkungan kerja jarak jauh.

## Fitur Utama (MVP)

*   **Escrow Bonus:** Bonus yang dijanjikan dikunci dalam smart contract hingga kondisi kinerja terpenuhi.
*   **Pemantauan Kinerja (via Oracle):** Integrasi dengan Chainlink Oracle untuk mengambil data kinerja off-chain (misalnya, jumlah commit dari GitHub API).
*   **Payout Otomatis:** Bonus dicairkan secara otomatis ke dompet kripto penerima setelah kondisi kinerja diverifikasi.
*   **Pengembalian Bonus:** Jika target kinerja tidak tercapai, bonus dapat dikembalikan kepada manajer/pemilik kontrak.

## Tumpukan Teknologi (Rekomendasi Awal)

*   **Blockchain:** Polygon (Mumbai Testnet untuk pengembangan)
*   **Smart Contract Language:** Solidity
*   **Smart Contract Development Framework:** Hardhat
*   **Oracle Service:** Chainlink
*   **API Integrations:** GitHub API (untuk MVP)
*   **Frontend (Minimal):** React.js dengan Ethers.js

## Cara Menjalankan Proyek (Estimasi Awal)

Meskipun proyek ini masih dalam tahap persiapan dokumen, berikut adalah langkah-langkah umum yang akan diperlukan untuk menjalankan proyek ini setelah smart contract dan frontend dikembangkan:

### Prasyarat

*   Node.js (v16 atau lebih tinggi)
*   npm atau yarn
*   Git
*   Metamask atau dompet kripto yang kompatibel dengan EVM
*   Akses ke Polygon Mumbai Testnet (untuk pengujian)
*   Kunci API GitHub (jika diperlukan untuk Chainlink External Adapter)

### Langkah-langkah (Estimasi)

1.  **Kloning Repositori:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Instal Dependensi:**
    ```bash
    npm install
    # atau
    yarn install
    ```

3.  **Konfigurasi Lingkungan:**
    *   Buat file `.env` di root proyek.
    *   Tambahkan variabel lingkungan yang diperlukan, seperti `POLYGON_MUMBAI_RPC_URL`, `PRIVATE_KEY` (untuk akun deployment), dan `CHAINLINK_API_KEY` (jika ada).

4.  **Kompilasi Smart Contract:**
    ```bash
    npx hardhat compile
    ```

5.  **Deploy Smart Contract (ke Testnet):**
    ```bash
    npx hardhat run scripts/deploy.js --network mumbai
    ```
    *   Catat alamat kontrak yang di-deploy.

6.  **Siapkan Chainlink Oracle:**
    *   Konfigurasi Chainlink node atau Chainlink Functions untuk berinteraksi dengan GitHub API dan mengirim data ke smart contract yang di-deploy. (Langkah ini akan lebih detail setelah pengembangan oracle).

7.  **Jalankan Frontend (dApp):**
    ```bash
    cd frontend # (asumsi ada folder frontend)
    npm install
    npm start
    ```
    *   Aplikasi frontend akan berjalan di `http://localhost:3000` (atau port lain yang ditentukan).

8.  **Interaksi:**
    *   Gunakan antarmuka dApp untuk menyetor bonus, memantau kinerja, dan memicu pencairan.

## Kontribusi

Kami menyambut kontribusi! Silakan lihat `CONTRIBUTING.md` (akan dibuat) untuk panduan lebih lanjut.

## Lisensi

Proyek ini dilisensikan di bawah [Nama Lisensi, misal: MIT License].
