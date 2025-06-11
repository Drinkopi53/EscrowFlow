# Rencana Implementasi Awal untuk MVP

## 1. Tujuan MVP
MVP akan mendemonstrasikan fitur inti: pemantauan jumlah commit di GitHub, penguncian bonus dalam escrow, dan pembayaran otomatis jika target tercapai. Skenario: Seorang pekerja harus mencapai minimal 5 commit dalam 3 hari untuk mendapatkan bonus 0.05 ETH.

## 2. Langkah-Langkah Implementasi

### 2.1 Smart Contract Development
- **Setup Proyek:** Inisialisasi proyek Hardhat untuk Polygon.
- **Konstruksi Smart Contract (Solidity):**
  - Fungsi untuk deposit bonus ke escrow.
  - Fungsi untuk memverifikasi jumlah commit via Chainlink API call ke GitHub.
  - Fungsi untuk payout otomatis ke pekerja jika target tercapai atau pengembalian dana ke manajer jika gagal.
- **Testing:** Unit test untuk fungsi escrow, verifikasi, dan payout menggunakan Mocha/Chai.

### 2.2 Integrasi API GitHub
- **Chainlink External Adapter:** Membuat adapter untuk mengambil jumlah commit dari GitHub API berdasarkan repositori dan pengguna.
- **Webhook Setup:** Mengatur webhook di GitHub untuk mengirim data commit ke Chainlink node.
- **Data Verification:** Smart contract memeriksa apakah jumlah commit ≥ 5 dalam 3 hari.

### 2.3 Frontend dan Wallet Integration
- **React App:** Antarmuka sederhana untuk membuat kontrak, melihat status performa, dan notifikasi payout.
- **MetaMask Integration:** Menghubungkan dompet untuk deposit bonus dan menerima payout.
- **3.4 Deployment**
- **Smart Contract:** Deploy ke Polygon Testnet (Mumbai) menggunakan Hardhat.
- **Frontend:** Deploy ke Vercel.
- **Backend/Chainlink Node:** Host di Heroku untuk menangani API calls.

## 4. Milestone dan Timeline
| Milestone | Deskripsi | Durasi |
|----------------|--------------------|--------------------|
| Setup Proyek | Inisiasi Hardhat, Chainlink | 2 hari |
| Smart Contract | Escrow, verifikasi, payout | 4 hari |
| Integrasi API | Chainlink + GitHub | 3 hari |
| Frontend | UI + MetaMask | 3 hari |
| Testing | Unit test dan bug fixing | 2 hari |
| Deployment | Polygon Mumbai, Vercel | 2 hari |
| **Total:** 16 hari |

## 5. Batasan MVP
- Hanya mendukung satu metrik (jumlah commit).
- UI minimal untuk fokus pada fungsi inti.
- Tidak ada fitur lanjutan seperti multi-role atau multi-metric evaluation.