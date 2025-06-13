# Baby-Step: Inisialisasi Proyek Hardhat untuk Pengembangan Smart Contract

## Deskripsi Tugas
Tugas ini bertujuan untuk menyiapkan lingkungan pengembangan dasar untuk smart contract menggunakan Hardhat. Ini melibatkan inisialisasi proyek Node.js, instalasi Hardhat dan dependensi yang diperlukan, serta konfigurasi Hardhat untuk berinteraksi dengan jaringan Polygon Mumbai Testnet. Langkah ini sangat penting sebagai fondasi sebelum kita mulai menulis kode Solidity untuk smart contract.

## Tujuan dalam Konteks Smart Contract
Dengan menyelesaikan langkah ini, kita akan memiliki struktur proyek yang siap untuk pengembangan, kompilasi, pengujian, dan deployment smart contract. Ini memastikan bahwa semua alat yang diperlukan tersedia dan dikonfigurasi dengan benar, meminimalkan hambatan di kemudian hari.

## File yang Akan Dibuat/Dimodifikasi

*   **Direktori Proyek Baru:** Disarankan untuk membuat direktori baru untuk proyek Hardhat, misalnya `contracts/hardhat-project`. Semua file dan folder Hardhat akan berada di dalam direktori ini.
*   `contracts/hardhat-project/package.json`: File konfigurasi Node.js yang akan mencatat dependensi proyek.
*   `contracts/hardhat-project/hardhat.config.js` dan `contracts/hardhat-project/hardhat.config.ts`: File konfigurasi utama Hardhat, di mana kita akan menentukan jaringan, compiler Solidity, dan pengaturan lainnya.
*   `contracts/hardhat-project/contracts/`: Direktori untuk menyimpan file Solidity (`.sol`).
*   `contracts/hardhat-project/scripts/`: Direktori untuk menyimpan skrip deployment atau interaksi kontrak.
*   `contracts/hardhat-project/test/`: Direktori untuk menyimpan unit test smart contract.

## Instruksi Langkah demi Langkah (untuk Junior Developer)

1.  **Buat Direktori Proyek Hardhat:**
    *   Buka terminal di root proyek Anda (`d:/Games/MyProject/EscrowFlow/EscrowFlow`).
    *   Buat direktori baru untuk proyek Hardhat Anda.
        ```bash
        mkdir contracts
        mkdir contracts/hardhat-project
        ```
    *   Masuk ke direktori proyek Hardhat yang baru dibuat.
        ```bash
        cd contracts/hardhat-project
        ```

2.  **Inisialisasi Proyek Node.js:**
    *   Di dalam direktori `contracts/hardhat-project`, inisialisasi proyek Node.js.
        ```bash
        npm init -y
        ```
        Ini akan membuat file `package.json` dengan pengaturan default.

3.  **Instal Hardhat dan Dependensi Penting:**
    *   Instal Hardhat sebagai dependensi pengembangan.
        ```bash
        npm install --save-dev hardhat
        ```
    *   Instal dependensi tambahan yang diperlukan untuk Hardhat dan interaksi blockchain.
        ```bash
        npm install --save-dev @nomicfoundation/hardhat-toolbox @nomiclabs/hardhat-ethers ethers dotenv
        ```
        *   `@nomicfoundation/hardhat-toolbox`: Kumpulan plugin Hardhat yang direkomendasikan (termasuk testing, deployment, dll.).
        *   `@nomiclabs/hardhat-ethers`: Integrasi Ethers.js dengan Hardhat.
        *   `ethers`: Library untuk berinteraksi dengan Ethereum blockchain.
        *   `dotenv`: Untuk mengelola variabel lingkungan (misalnya, kunci API, private key).

4.  **Inisialisasi Proyek Hardhat:**
    *   Jalankan perintah inisialisasi Hardhat.
        ```bash
        npx hardhat
        ```
    *   Pilih opsi `Create a JavaScript project` (atau TypeScript jika Anda lebih suka, tetapi instruksi ini akan menggunakan JavaScript).
    *   Tekan `Enter` untuk menerima lokasi default untuk `hardhat.config.js`.
    *   Tekan `Enter` untuk menerima lokasi default untuk `contracts/` dan `test/`.
    *   Tekan `Enter` untuk menambahkan `.gitignore` secara otomatis.

5.  **Konfigurasi Hardhat untuk Polygon Mumbai Testnet:**
    *   Buka file `contracts/hardhat-project/hardhat.config.js` (atau `.ts`) di editor teks Anda.
    *   Modifikasi file tersebut untuk menyertakan konfigurasi jaringan Polygon Mumbai dan mengelola variabel lingkungan.

    ```javascript
    require("@nomicfoundation/hardhat-toolbox");
    require("dotenv").config();

    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL;

    /** @type import('hardhat/config').HardhatUserConfig */
    module.exports = {
      solidity: "0.8.24", // Pastikan versi Solidity sesuai dengan yang Anda gunakan
      networks: {
        mumbai: {
          url: MUMBAI_RPC_URL,
          accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
          chainId: 80001, // Chain ID untuk Polygon Mumbai Testnet
        },
      },
      paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts"
      },
    };
    ```

6.  **Buat File `.env`:**
    *   Di dalam direktori `contracts/hardhat-project`, buat file baru bernama `.env`.
    *   Tambahkan variabel lingkungan berikut ke file `.env`. Anda perlu mengganti placeholder dengan nilai sebenarnya.
        ```
        PRIVATE_KEY="YOUR_METAMASK_PRIVATE_KEY_HERE"
        MUMBAI_RPC_URL="YOUR_ALCHEMY_OR_INFURA_MUMBAI_RPC_URL_HERE"
        ```
        *   **Penting:** Jangan pernah membagikan `PRIVATE_KEY` Anda. Untuk tujuan pengembangan, gunakan akun testnet dengan dana minimal. Anda bisa mendapatkan RPC URL dari layanan seperti Alchemy atau Infura.

## Kriteria Penerimaan dan Cara Melakukan Tes/Validasi

1.  **Verifikasi Struktur Proyek:**
    *   Pastikan direktori `contracts/hardhat-project` telah dibuat.
    *   Di dalamnya, harus ada `package.json`, `hardhat.config.js`, `node_modules/`, `contracts/`, `scripts/`, dan `test/`.
    *   Pastikan file `.env` juga ada di `contracts/hardhat-project`.

2.  **Kompilasi Hardhat Berhasil:**
    *   Buka terminal di direktori `contracts/hardhat-project`.
    *   Jalankan perintah:
        ```bash
        npx hardhat compile
        ```
    *   Perintah ini harus berjalan tanpa error dan menghasilkan direktori `artifacts/` dan `cache/`. Ini menunjukkan bahwa Hardhat dapat mengkompilasi kontrak contoh default yang dibuat saat inisialisasi.

3.  **Hardhat Test Runner Berhasil:**
    *   Buka terminal di direktori `contracts/hardhat-project`.
    *   Jalankan perintah:
        ```bash
        npx hardhat test
        ```
    *   Perintah ini harus berjalan tanpa error. Meskipun belum ada tes kustom yang ditulis, Hardhat harus dapat menjalankan test runner-nya tanpa masalah framework. Ini memverifikasi bahwa lingkungan pengujian telah diatur dengan benar.

Setelah semua langkah ini berhasil diselesaikan, proyek Hardhat Anda akan siap untuk mulai menulis smart contract pertama Anda.
