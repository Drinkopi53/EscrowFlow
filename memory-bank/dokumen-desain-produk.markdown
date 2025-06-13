# Dokumen Desain Produk (PDD): Performance-Triggered Smart Contract with Escrowed Bonus Payouts

## 1. Visi Produk
Membangun sistem berbasis blockchain yang transparan dan otomatis untuk mengelola bonus berbasis performa dalam kolaborasi kerja jarak jauh. Sistem ini memastikan kepercayaan antar anggota tim dengan memverifikasi kontribusi secara real-time, mengunci bonus dalam escrow, dan mencairkan pembayaran hanya ketika target kinerja tercapai, sehingga meningkatkan efisiensi dan akuntabilitas.

## 2. Target Pengguna
- **Tim Remote (Pekerja):** Anggota tim yang bekerja jarak jauh, seperti developer, desainer, atau manajer proyek, yang ingin mendapatkan bonus berdasarkan kontribusi terukur.
- **Manajer/ Pemilik Proyek:** Individu atau organisasi yang mengelola tim remote dan ingin memastikan alokasi bonus yang adil, transparan, dan otomatis.
- **Startup/Freelance Platforms:** Platform yang ingin mengintegrasikan sistem bonus berbasis performa untuk meningkatkan kepercayaan pengguna.

## 3. Fitur Inti
### 3.1 Pemantauan Performa Otomatis
- **Deskripsi:** Smart contract memantau indikator kinerja (KPI) seperti jumlah commit di GitHub. Untuk status task dan penyelesaian milestone, sistem menggunakan API Trello dan API Jira secara terpisah melalui integrasi API/Webhook.
- **Contoh:** Memverifikasi apakah seorang developer telah melakukan minimal 10 commit ke repositori tertentu dalam 7 hari.
- **Manfaat:** Mengurangi ketergantungan pada pelaporan manual dan meningkatkan objektivitas.

### 3.2 Escrow Bonus
- **Deskripsi:** Bonus dalam bentuk kripto (misal, ETH, MATIC) dikunci dalam smart contract sebagai escrow saat kontrak dibuat, memastikan dana aman dan tersedia untuk pembayaran.
- **Contoh:** Manajer mengunci 0.1 ETH sebagai bonus untuk penyelesaian modul API.
- **Manfaat:** Membangun kepercayaan bahwa bonus tersedia dan tidak dapat dimanipulasi.

### 3.3 Payout Otomatis
- **Deskripsi:** Smart contract secara otomatis mencairkan bonus ke dompet pekerja jika KPI tercapai dalam batas waktu, atau menyimpan/mengembalikan dana jika tidak tercapai.
- **Contoh:** Jika modul API selesai dalam 7 hari (diverifikasi via GitHub), 0.1 ETH dikirim ke pekerja; jika tidak, dana dikembalikan ke manajer.
- **Manfaat:** Menghilangkan penundaan pembayaran dan intervensi manual.

## 4. User Flow
1. **Pengaturan Kontrak:**
   - Manajer membuat smart contract melalui antarmuka web, menentukan KPI (misal, 10 commit dalam 7 hari), jumlah bonus (misal, 0.1 ETH), dan batas waktu.
   - Manajer mengirim bonus ke alamat smart contract untuk dikunci sebagai escrow.
2. **Pemantauan Performa:**
   - Smart contract terhubung ke GitHub/Trello via API/Webhook untuk melacak KPI secara real-time.
   - Data performa (misal, jumlah commit) dicatat dan diverifikasi oleh smart contract.
3. **Evaluasi dan Payout:**
   - Pada akhir periode (misal, 7 hari), smart contract memeriksa apakah KPI tercapai.
   - Jika tercapai, bonus otomatis dikirim ke dompet pekerja.
   - Jika tidak tercapai, bonus dikembalikan ke manajer atau disimpan sesuai aturan kontrak.
4. **Notifikasi:**
   - Pekerja dan manajer menerima notifikasi (via email atau UI) tentang status kontrak, performa, dan hasil payout.

## 5. Asumsi dan Batasan
- **Asumsi:** Platform seperti GitHub/Trello menyediakan API yang andal untuk pelacakan real-time.
- **Batasan:** Biaya gas blockchain dapat memengaruhi efisiensi untuk bonus bernilai kecil; solusi layer-2 seperti Polygon dapat digunakan untuk mengurangi biaya.