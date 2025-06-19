# Rencana Implementasi Awal untuk MVP: Performance-Triggered Smart Contract

MVP (Minimum Viable Product) akan fokus pada demonstrasi fitur inti: pemantauan sederhana, escrow bonus, dan payout otomatis untuk satu skenario metrik (jumlah commit GitHub), setelah validasi arsitektur melalui simulasi.

## Fase 0: Perencanaan & Penyiapan Lingkungan (Minggu 0.5)

*   **0.1. Inisialisasi Proyek:**
    *   Buat repositori GitHub baru.
    *   Inisialisasi proyek Hardhat: `npx hardhat init`.
    *   Siapkan struktur direktori proyek (misalnya, untuk kontrak, skrip simulasi, tes).
*   **0.2. Definisi Awal Lingkup & Metrik:**
    *   Detailkan KPI yang akan dipantau untuk MVP (fokus: jumlah commit GitHub).
    *   Identifikasi secara umum alur pengguna utama yang akan disimulasikan.
*   **0.3. Riset Awal Teknologi Pendukung:**
    *   Tinjau dokumentasi Hardhat untuk simulasi jaringan lokal dan interaksi kontrak.
    *   Secara umum, pahami konsep dasar Chainlink Oracles dan bagaimana data eksternal (seperti dari GitHub API) dapat diumpankan ke smart contract, untuk mempersiapkan simulasi interaksi ini.

## Fase 1: Desain dan Validasi Arsitektur via Simulasi Lokal (Minggu 1-2)

*   **1.1. Desain Arsitektur Sistem (Tingkat Tinggi):**
    *   Definisikan komponen utama sistem: Kontrak Manajer Bonus, Kontrak Escrow (bisa jadi satu atau terpisah), modul interaksi data eksternal (simulasi Oracle), dan antarmuka pengguna (konseptual).
    *   Rancang alur data antara komponen-komponen ini untuk skenario inti (deposit, cek performa, payout, reclaim).
*   **1.2. Pengembangan Skrip Simulasi, Mock Servers, & Kontrak Abstrak/Mock:**
    *   **Skrip Python untuk Orkestrasi & Interaksi Kontrak:**
        *   Kembangkan skrip Python (menggunakan `web3.py` atau pustaka serupa) untuk berinteraksi dengan versi awal/abstrak dari smart contract yang di-deploy ke Hardhat Network.
        *   Skrip ini akan mengotomatisasi simulasi berbagai peran pengguna (misalnya, manajer melakukan deposit, sistem memicu pengecekan performa).
    *   **Mock Servers (Python - Flask/FastAPI):**
        *   Buat mock server sederhana menggunakan Python (Flask, FastAPI, atau `http.server`) untuk menyimulasikan endpoint API eksternal (GitHub, Trello). Server ini akan mengembalikan respons data tiruan yang telah ditentukan sebelumnya ketika endpoint-nya diakses.
        *   Simulasikan callback dari Oracle Chainlink dengan membuat endpoint di mock server ini yang dapat dipanggil oleh skrip Python (meniru Oracle), yang kemudian memanggil fungsi callback di smart contract dengan data tiruan.
    *   **Kontrak Abstrak/Mock (Solidity):**
        *   Kembangkan versi abstrak atau _mocked_ dari smart contract (Solidity) yang fokus pada logika inti. Fungsi yang bergantung pada data eksternal (misalnya, `checkPerformance`) akan menerima data ini langsung sebagai parameter atau dari sumber yang dikontrol oleh skrip Python, bukan melalui panggilan Oracle langsung di tahap ini.
    *   **Skrip Hardhat (JavaScript/TypeScript):** Dapat digunakan secara komplementer untuk tugas-tugas spesifik dalam ekosistem Hardhat, seperti deployment atau interaksi kontrak yang lebih sederhana jika diperlukan.
*   **1.3. Simulasi dan Validasi Alur Kerja Inti dengan Python & Mock Servers:**
    *   Gunakan skrip Python untuk menjalankan skenario end-to-end:
        *   Simulasi manajer menyetor dana dan menetapkan kondisi melalui panggilan kontrak dari Python.
        *   Skrip Python memicu "pengecekan kinerja", yang melibatkan:
            *   Smart contract (abstrak) meminta data dari "Oracle" (sebenarnya adalah endpoint di mock server Python).
            *   Mock server Python mengembalikan data kinerja tiruan (misalnya, jumlah commit yang memenuhi target).
            *   Smart contract (abstrak) menerima data ini melalui simulasi callback Oracle (dipicu oleh skrip Python).
        *   Verifikasi (menggunakan Python untuk membaca state kontrak atau event) bahwa logika kontrak mengarah pada keputusan payout.
        *   Simulasi payout berhasil ke alamat penerima yang benar.
        *   Ulangi dengan data kinerja yang tidak memenuhi target untuk memvalidasi jalur reclaim.
        *   Verifikasi bahwa logika kontrak mengarah pada keputusan reclaim.
        *   Simulasi reclaim berhasil kembali ke manajer.
*   **1.4. Output & Iterasi Desain:**
    *   Hasil dari fase ini adalah arsitektur sistem yang telah terbukti valid secara fungsional dalam lingkungan terkontrol.
    *   Dokumentasikan interaksi antar komponen, format data untuk API tiruan dan callback Oracle, serta struktur data yang dibutuhkan.
    *   Iterasi pada desain arsitektur, logika kontrak (abstrak), atau skrip simulasi jika simulasi menunjukkan masalah atau inefisiensi.
    *   Pemahaman yang jelas tentang bagaimana kontrak `EscrowBonus.sol` (atau yang serupa) nantinya akan berinteraksi dengan dunia luar, memandu pengembangan di fase berikutnya.

## Fase 2: Pengembangan Smart Contract Awal (MVP) (Minggu 2-3)

*   **2.1. Implementasi Smart Contract `EscrowBonus.sol`:**
    *   Berdasarkan arsitektur dan logika yang divalidasi pada Fase 1, tulis kode Solidity untuk `EscrowBonus.sol` (atau nama yang ditentukan).
    *   Pastikan penggunaan `require` statement untuk validasi input dan `onlyOwner` atau kontrol akses yang sesuai.
    *   Integrasikan dengan Chainlink Oracle (sekarang merujuk pada persiapan untuk interaksi nyata, bukan lagi simulasi penuh):
        *   Gunakan kontrak `ChainlinkClient` (atau mekanisme terbaru dari Chainlink) untuk membuat permintaan data ke oracle.
        *   Definisikan `requestId` dan `callbackFunction` untuk menerima respons dari oracle.
*   **2.2. Pengembangan atau Konfigurasi Komponen Oracle (Dasar):**
    *   Jika menggunakan External Adapter: Mulai pengembangan dasar atau siapkan konfigurasi untuk External Adapter yang akan berinteraksi dengan API GitHub.
    *   Jika menggunakan Chainlink Functions: Tulis skrip dasar untuk Chainlink Function.
    *   Fokus pada satu jalur data (misalnya, jumlah commit) untuk MVP.
*   **2.3. Pengujian Unit Smart Contract:**
    *   Tulis unit test menggunakan Hardhat (Chai, Mocha) untuk setiap fungsi dalam `EscrowBonus.sol`.
    *   Fokus pada pengujian logika internal kontrak, validasi input, dan kontrol akses.
    *   Gunakan mock data untuk input dan (jika perlu) mock kontrak untuk dependensi Oracle jika pengujian unit tidak dapat menjangkau simulasi Fase 1. (Contoh: tes yang ada di `test/EscrowBonus.test.js` akan dijalankan dan disesuaikan di sini).

## Fase 3: Integrasi Dasar & Pengujian Testnet (Minggu 4)

*   **3.1. Deployment Smart Contract ke Testnet:**
    *   Deploy `EscrowBonus.sol` ke Polygon Mumbai Testnet (atau testnet pilihan).
    *   Verifikasi kontrak di Etherscan/Polygonscan.
*   **3.2. Setup & Konfigurasi Oracle di Testnet (Dasar):**
    *   Deploy dan konfigurasikan External Adapter atau Chainlink Function di lingkungan testnet.
    *   Hubungkan ke node Chainlink testnet.
    *   Pastikan Oracle dapat dipanggil oleh smart contract dan mengembalikan data (bisa jadi data sederhana atau terkontrol dari API GitHub).
*   **3.3. Pengembangan Frontend (Sangat Minimalis untuk Interaksi Dasar):**
    *   Buat antarmuka pengguna yang sangat sederhana untuk:
        *   Memanggil fungsi `depositBonus` pada smart contract.
        *   Menampilkan beberapa status dasar dari kontrak (misalnya, saldo escrow, status bonus untuk sebuah ID permintaan).
    *   Gunakan Ethers.js untuk interaksi.
*   **3.4. Pengujian End-to-End Awal di Testnet:**
    *   Lakukan pengujian alur kerja dasar di testnet: setor bonus, picu Oracle untuk mengambil data GitHub (sebenarnya), amati perubahan status, dan coba payout/reclaim.

## Fase 4: Iterasi dan Penambahan Fitur (Berkelanjutan setelah MVP)

*   Pengembangan fitur tambahan berdasarkan feedback dan roadmap.
*   Peningkatan UI/UX.
*   Dukungan untuk metrik kinerja lainnya.
*   Audit keamanan (jika proyek berkembang menjadi produksi).

## Metrik Keberhasilan MVP

*   **Validasi Arsitektur Lokal:**
    *   Arsitektur sistem berhasil divalidasi melalui simulasi lokal (menggunakan skrip Python, mock servers, dan kontrak abstrak), menunjukkan alur kerja inti (deposit, cek performa simulasi, payout/reclaim simulasi) berfungsi sesuai rancangan.
    *   Logika inti smart contract (versi abstrak/mock) terbukti benar dan interaksinya dengan komponen simulasi (mock server API/Oracle) berjalan sesuai harapan.
*   **Fungsionalitas Smart Contract Awal:**
    *   Smart contract `EscrowBonus.sol` (MVP) berhasil di-deploy dan berfungsi di testnet.
    *   Fungsi `depositBonus` dapat dipanggil dan mengunci dana di escrow.
    *   Interaksi dasar dengan Oracle (meskipun disimulasikan atau dengan pemicu manual di testnet) dapat ditunjukkan.
    *   Logika payout/reclaim dapat didemonstrasikan di testnet (bisa dengan memanipulasi kondisi secara manual atau melalui callback Oracle yang disimulasikan jika interaksi penuh belum siap).
*   **Interaksi Dasar:**
    *   Antarmuka pengguna minimalis dapat melakukan deposit ke smart contract.

## Lingkup MVP (Batasan)

*   **Fokus Utama:** Validasi arsitektur melalui simulasi lokal adalah prioritas utama. Implementasi smart contract `EscrowBonus.sol` yang terhubung dengan Chainlink di testnet adalah tujuan sekunder untuk MVP awal ini, dan mungkin hanya mencakup interaksi dasar atau yang sebagian disimulasikan.
*   **Metrik Kinerja:** Awalnya hanya jumlah commit GitHub yang akan disimulasikan dan kemudian diimplementasikan secara dasar.
*   **Integrasi Oracle:** Integrasi Oracle mungkin disederhanakan atau disimulasikan sebagian besar untuk MVP awal di testnet, tergantung kompleksitas setup EA/Functions dalam waktu yang terbatas. Poin utamanya adalah arsitektur yang memungkinkan integrasi ini.
*   **Antarmuka Pengguna:** Sangat minimalis, cukup untuk demonstrasi fungsi dasar kontrak.
*   **Keamanan:** Audit keamanan formal tidak termasuk dalam lingkup MVP ini.
*   **Manajemen Pengguna:** Tidak ada fitur manajemen pengguna atau otentikasi yang kompleks.
