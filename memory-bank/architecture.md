# Arsitektur Sistem

## Gambaran Umum
Sistem ini merupakan platform berbasis blockchain yang mengelola bonus berbasis performa secara otomatis dan transparan menggunakan smart contract. Arsitektur sistem terdiri dari beberapa komponen utama yang saling berinteraksi untuk memastikan keandalan, keamanan, dan efisiensi.

## Komponen Utama

### 1. Smart Contract
- Berjalan di jaringan Polygon (layer-2 Ethereum).
- Mengelola escrow bonus, verifikasi performa, dan payout otomatis.
- Memastikan keamanan dana dan transparansi proses.

### 2. Chainlink Oracle
- Menghubungkan smart contract dengan data eksternal.
- Menggunakan External Adapters untuk mengambil data dari API GitHub, API Trello, dan API Jira secara terpisah.
- Memverifikasi data performa secara real-time.

### 3. Backend Middleware
- Server Node.js yang mengelola komunikasi antara Chainlink dan API eksternal.
- Menangani webhook dan request API.
- Menyediakan endpoint untuk frontend jika diperlukan.

### 4. Frontend Aplikasi
- Dibangun dengan React.js dan Tailwind CSS.
- Menyediakan antarmuka pengguna untuk membuat kontrak, memantau status, dan menerima notifikasi.
- Integrasi dengan MetaMask untuk interaksi blockchain.

### 5. Infrastruktur Hosting
- Frontend dihosting di Vercel.
- Backend dan Chainlink node dihosting di Heroku atau AWS.

## Alur Data
1. Pengguna membuat kontrak melalui frontend.
2. Smart contract menerima dana escrow dan parameter KPI.
3. Chainlink oracle mengambil data performa dari API eksternal.
4. Backend middleware memfasilitasi komunikasi API dan webhook.
5. Smart contract mengevaluasi performa dan melakukan payout otomatis.
6. Frontend menampilkan status dan notifikasi kepada pengguna.

## Keamanan dan Skalabilitas
- Penggunaan Polygon untuk biaya gas rendah dan skalabilitas.
- Audit smart contract menggunakan Slither dan MythX.
- Desain modular untuk memudahkan pengembangan dan pemeliharaan.
