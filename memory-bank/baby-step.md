# Baby-Step 1: Melakukan Setup Proyek Hardhat dan Instalasi Dependensi Awal

Ini adalah langkah pertama yang krusial untuk menyiapkan lingkungan pengembangan smart contract Anda. Ikuti instruksi ini dengan cermat.

## Tujuan
Menyiapkan direktori proyek, menginstal Hardhat, dan menginstal dependensi Node.js/npm yang diperlukan untuk pengembangan smart contract di Polygon.

## File yang Akan Dibuat/Dimodifikasi
*   Direktori proyek baru (misal: `EscrowFlow`)
*   `package.json` (dibuat oleh `npm init`)
*   `hardhat.config.js` (dibuat oleh `npx hardhat`, lalu dimodifikasi)
*   `.env` (baru)
*   `.gitignore` (baru)
*   `contracts/` (direktori, dibuat oleh `npx hardhat`)
*   `scripts/` (direktori, dibuat oleh `npx hardhat`)
*   `test/` (direktori, dibuat oleh `npx hardhat`)

## Instruksi Langkah demi Langkah

### Langkah 1: Instalasi Node.js dan Verifikasi npm/Yarn
Jika Anda belum memiliki Node.js, instal terlebih dahulu.

1.  **Unduh Node.js:** Kunjungi situs resmi Node.js: [https://nodejs.org/](https://nodejs.org/). Unduh dan instal versi LTS (Long Term Support) yang direkomendasikan untuk sistem operasi Anda. npm (Node Package Manager) akan terinstal secara otomatis bersama Node.js.
2.  **Verifikasi Instalasi:** Buka terminal atau Command Prompt baru dan jalankan perintah berikut untuk memastikan Node.js dan npm terinstal dengan benar:
    ```bash
    node -v
    npm -v
    ```
    Anda akan melihat nomor versi untuk Node.js dan npm.
3.  **(Opsional) Instal Yarn:** Jika Anda lebih suka menggunakan Yarn sebagai package manager, instal secara global:
    ```bash
    npm install -g yarn
    ```
    Verifikasi instalasi Yarn:
    ```bash
    yarn -v
    ```

### Langkah 2: Membuat Direktori Proyek dan Inisialisasi npm
Kita akan membuat direktori utama untuk proyek Anda dan menginisialisasi proyek Node.js di dalamnya.

1.  **Buat Direktori Proyek:** Di lokasi yang Anda inginkan (misal: `d:/Games/MyProject/EscrowFlow`), buat direktori baru.
    ```bash
    mkdir EscrowFlow
    ```
2.  **Masuk ke Direktori Proyek:**
    ```bash
    cd EscrowFlow
    ```
3.  **Inisialisasi Proyek npm:** Ini akan membuat file `package.json` yang akan melacak semua dependensi proyek Anda.
    ```bash
    npm init -y
    ```
    Opsi `-y` akan menerima semua nilai default, sehingga prosesnya lebih cepat.

### Langkah 3: Instalasi Hardhat
Hardhat adalah framework pengembangan smart contract yang akan kita gunakan.

1.  **Instal Hardhat:** Di dalam direktori `EscrowFlow`, instal Hardhat sebagai dependensi pengembangan:
    ```bash
    npm install --save-dev hardhat
    ```

### Langkah 4: Inisialisasi Proyek Hardhat
Ini akan membuat struktur folder dasar Hardhat dan file konfigurasi.

1.  **Jalankan Inisialisasi Hardhat:** Di dalam direktori `EscrowFlow`, jalankan perintah berikut:
    ```bash
    npx hardhat
    ```
2.  **Pilih Opsi:** Anda akan diberikan beberapa opsi. Pilih `Create a JavaScript project`. Hardhat akan membuat file `hardhat.config.js` dan direktori seperti `contracts/`, `scripts/`, dan `test/`.

### Langkah 5: Instalasi Dependensi Hardhat Tambahan
Kita akan menginstal library dan plugin penting untuk pengembangan dan pengujian.

1.  **Instal Dependensi:** Di dalam direktori `EscrowFlow`, jalankan perintah berikut:
    ```bash
    npm install --save-dev @openzeppelin/contracts @nomiclabs/hardhat-waffle ethereum-waffle chai dotenv
    ```
    *   `@openzeppelin/contracts`: Menyediakan implementasi standar yang aman untuk smart contract (misal: ERC20, Ownable).
    *   `@nomiclabs/hardhat-waffle`: Integrasi Hardhat dengan Waffle untuk pengujian.
    *   `ethereum-waffle`: Library pengujian untuk Ethereum.
    *   `chai`: Library assertion untuk pengujian.
    *   `dotenv`: Untuk memuat variabel lingkungan dari file `.env`.

### Langkah 6: Konfigurasi Variabel Lingkungan (`.env`)
Untuk keamanan, kita akan menyimpan kunci pribadi dan informasi sensitif lainnya di file `.env`.

1.  **Buat File `.env`:** Di root direktori `EscrowFlow`, buat file baru bernama `.env`.
2.  **Tambahkan Kunci Pribadi:** Buka file `.env` dan tambahkan baris berikut. Ganti `your_private_key_here` dengan kunci pribadi akun MetaMask Anda yang akan digunakan untuk deployment (pastikan akun ini memiliki dana MATIC di Polygon Mumbai Testnet).
    ```
    PRIVATE_KEY="your_private_key_here"
    ```
    **PENTING:** Jangan pernah meng-commit file `.env` ke repositori publik Anda!
3.  **Buat File `.gitignore`:** Di root direktori `EscrowFlow`, buat file baru bernama `.gitignore`.
4.  **Tambahkan Entri ke `.gitignore`:** Buka file `.gitignore` dan tambahkan baris berikut untuk mengabaikan file dan folder yang tidak perlu di-commit:
    ```
    node_modules/
    .env
    artifacts/
    cache/
    ```

### Langkah 7: Konfigurasi Jaringan Polygon Mumbai Testnet di Hardhat (`hardhat.config.js`)
Kita akan mengedit file konfigurasi Hardhat untuk menghubungkannya ke jaringan Polygon Mumbai Testnet.

1.  **Buka `hardhat.config.js`:** File ini berada di root direktori `EscrowFlow`.
2.  **Modifikasi Konten:** Ganti konten `hardhat.config.js` dengan yang berikut ini. Pastikan versi `solidity` sesuai dengan yang Anda inginkan (misal: `0.8.20`).
    ```javascript
    require("@nomiclabs/hardhat-waffle");
    require('dotenv').config(); // Memuat variabel lingkungan dari .env

    const PRIVATE_KEY = process.env.PRIVATE_KEY;

    module.exports = {
      solidity: "0.8.20", // Sesuaikan dengan versi Solidity yang akan digunakan
      networks: {
        mumbai: {
          url: "https://rpc-mumbai.maticvigil.com/",
          accounts: [`0x${PRIVATE_KEY}`] // Pastikan private key diawali dengan 0x
        }
      }
    };
    ```

## Kriteria Penerimaan / Validasi Keberhasilan
Setelah menyelesaikan semua langkah di atas, Anda dapat memvalidasi keberhasilan setup dengan:

*   **Verifikasi Instalasi Node.js/npm/Yarn:** Perintah `node -v`, `npm -v`, dan `yarn -v` (jika diinstal) harus menampilkan nomor versi tanpa error.
*   **Verifikasi Instalasi Hardhat:** Perintah `npx hardhat` harus menampilkan daftar perintah Hardhat yang tersedia.
*   **Verifikasi Konfigurasi Hardhat:** Anda dapat mencoba mengkompilasi kontrak contoh yang dibuat oleh Hardhat secara default (biasanya `contracts/Greeter.sol`).
    ```bash
    npx hardhat compile
    ```
    Perintah ini harus berjalan tanpa error dan menghasilkan folder `artifacts/` dan `cache/`. Jika ini berhasil, berarti Hardhat dan dependensinya terinstal dan terkonfigurasi dengan benar untuk kompilasi.
*   **Verifikasi Koneksi Jaringan (Opsional, setelah kontrak pertama dibuat):** Setelah Anda memiliki kontrak sederhana dan skrip deployment, Anda dapat mencoba men-deploy-nya ke Mumbai Testnet untuk memverifikasi bahwa konfigurasi jaringan di `hardhat.config.js` berfungsi. Ini akan menjadi bagian dari baby-step berikutnya.

Setelah semua langkah ini selesai dan kriteria penerimaan terpenuhi, Anda siap untuk baby-step selanjutnya: memulai pengembangan smart contract itu sendiri.
