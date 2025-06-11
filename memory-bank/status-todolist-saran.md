# Status Proyek dan To-Do List

## Status Proyek Saat Ini
Saat ini, kita telah menyelesaikan fase perencanaan detail untuk setup environment proyek 'Performance-Triggered Smart Contract with Escrowed Bonus Payouts'. Rencana ini mencakup instalasi tools (Node.js, Hardhat, MetaMask), konfigurasi awal Hardhat untuk Polygon Mumbai Testnet, dan rekomendasi struktur folder kode. Belum ada implementasi kode yang dimulai.

## Daftar Pekerjaan (To-Do List) Prioritas Tinggi untuk Masa Depan

Berdasarkan `rencana-implementasi.markdown`, berikut adalah daftar pekerjaan prioritas tinggi:

1.  **Pengembangan Smart Contract:**
    *   Membangun kontrak Solidity dengan fungsi deposit bonus ke escrow.
    *   Mengimplementasikan fungsi verifikasi performa (jumlah commit GitHub) melalui Chainlink.
    *   Mengembangkan fungsi payout otomatis dan pengembalian dana.
    *   Menulis unit test komprehensif untuk semua fungsi smart contract.

2.  **Integrasi Oracle (Chainlink & GitHub API):**
    *   Membuat dan mengimplementasikan Chainlink External Adapter untuk mengambil data commit dari GitHub API.
    *   Mengatur webhook di GitHub untuk memicu pembaruan data.

3.  **Pengembangan Frontend (React.js):**
    *   Membangun antarmuka pengguna untuk manajer (pembuatan kontrak, deposit bonus).
    *   Membangun antarmuka pengguna untuk pekerja (melihat status performa, klaim bonus).
    *   Mengintegrasikan MetaMask untuk interaksi dompet.

4.  **Deployment:**
    *   Mendeploy smart contract ke Polygon Mumbai Testnet.
    *   Mendeploy aplikasi frontend.
    *   Mendeploy backend/Chainlink node.

## Saran "Baby-Step To-Do List" Berikutnya

**Baby-Step 1: Melakukan Setup Proyek Hardhat dan Instalasi Dependensi Awal**

Ini adalah langkah fundamental untuk menyiapkan lingkungan pengembangan smart contract Anda.
