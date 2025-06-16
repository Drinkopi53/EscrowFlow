# Dokumen Desain Produk: Performance-Triggered Smart Contract with Escrowed Bonus Payouts

## 1. Visi Produk

Membangun platform terdesentralisasi yang meningkatkan kepercayaan dan efisiensi dalam kolaborasi tim remote dengan mengotomatisasi pembayaran bonus berdasarkan performa yang terukur dan transparan melalui smart contract. Proyek ini bertujuan untuk mengatasi masalah umum seperti kurangnya kepercayaan, keterlambatan pembayaran bonus, dan ketidakadilan dalam penilaian kontribusi individu di lingkungan kerja jarak jauh.

## 2. Fitur Inti

*   **Pemantauan Kinerja Otomatis:** Smart contract akan terintegrasi dengan alat manajemen proyek (misalnya, GitHub, Trello, Jira) untuk secara otomatis memantau indikator kinerja utama (KPI) seperti jumlah commit, penyelesaian tugas, atau pencapaian milestone.
*   **Escrow Bonus:** Bonus yang dijanjikan akan dikunci dalam smart contract escrow. Dana ini hanya akan dilepaskan kepada penerima setelah kondisi kinerja yang telah disepakati terpenuhi.
*   **Payout Otomatis:** Setelah kondisi kinerja diverifikasi oleh smart contract, bonus akan secara otomatis dicairkan ke dompet kripto penerima tanpa intervensi manual.
*   **Transparansi dan Immutabilitas:** Semua transaksi dan kondisi kontrak tercatat di blockchain, memastikan transparansi penuh dan ketidak-dapat-diubahnya perjanjian.

## 3. Target Pengguna

*   **Tim Remote:** Tim yang bekerja secara terdistribusi dan membutuhkan mekanisme yang transparan dan otomatis untuk mengelola insentif berbasis kinerja.
*   **Manajer Proyek/Pemilik Bisnis:** Individu atau entitas yang ingin memastikan bahwa bonus dibayarkan secara adil dan efisien berdasarkan kontribusi nyata, serta mengurangi beban administrasi.
*   **Freelancer/Kontraktor:** Individu yang mencari jaminan pembayaran bonus yang adil dan otomatis setelah menyelesaikan tugas atau proyek.

## 4. User Flow (Contoh Skenario: Bonus Berbasis Commit GitHub)

### Skenario: Manajer Menetapkan Bonus untuk Pengembang

1.  **Manajer Menetapkan Kontrak:**
    *   Manajer (pemilik kontrak) mengakses antarmuka dApp (aplikasi terdesentralisasi).
    *   Manajer membuat kontrak baru, menentukan:
        *   Alamat dompet pengembang (penerima bonus).
        *   Jumlah bonus (misalnya, 1 ETH).
        *   Kondisi kinerja: "Pengembang harus mencapai 50 commit ke repositori GitHub 'my-project' dalam 30 hari."
        *   Periode waktu: 30 hari dari tanggal pembuatan kontrak.
        *   Sumber data eksternal (oracle): Menentukan Chainlink untuk mengambil data commit dari GitHub API.
    *   Manajer menyetorkan 1 ETH ke smart contract, yang kemudian dikunci dalam escrow.

2.  **Pemantauan Kinerja:**
    *   Smart contract secara berkala (misalnya, setiap hari atau setiap kali ada pemicu) meminta data commit dari oracle (Chainlink).
    *   Oracle berinteraksi dengan GitHub API untuk mengambil jumlah commit pengembang di repositori 'my-project'.
    *   Data commit dikirim kembali ke smart contract.
    *   Smart contract membandingkan jumlah commit yang diterima dengan target 50 commit.

3.  **Pencairan Bonus Otomatis (Jika Target Tercapai):**
    *   Jika dalam 30 hari, smart contract memverifikasi bahwa pengembang telah mencapai atau melebihi 50 commit:
        *   Smart contract secara otomatis melepaskan 1 ETH dari escrow.
        *   1 ETH dikirim langsung ke alamat dompet pengembang.
        *   Transaksi dicatat di blockchain, memberikan bukti pembayaran yang transparan.

4.  **Penanganan Kegagalan (Jika Target Tidak Tercapai):**
    *   Jika setelah 30 hari, smart contract memverifikasi bahwa pengembang belum mencapai 50 commit:
        *   Smart contract akan mengembalikan 1 ETH dari escrow ke alamat dompet manajer (pemilik kontrak), atau sesuai dengan ketentuan lain yang ditetapkan dalam kontrak (misalnya, disimpan untuk tujuan lain).
        *   Transaksi dicatat di blockchain.

### User Flow Lain yang Mungkin:

*   **Bonus Berbasis Penyelesaian Tugas Trello/Jira:** Mirip dengan di atas, tetapi oracle mengambil status tugas (misalnya, "Done") dari Trello/Jira API.
*   **Bonus Berbasis Milestone:** Bonus dicairkan setelah serangkaian tugas atau milestone tertentu diselesaikan dan diverifikasi.
*   **Bonus Berjenjang:** Bonus yang berbeda dicairkan berdasarkan tingkat pencapaian kinerja (misalnya, 50 commit = X bonus, 100 commit = Y bonus).
