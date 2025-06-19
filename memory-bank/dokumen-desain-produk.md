# Dokumen Desain Produk: Performance-Triggered Smart Contract with Escrowed Bonus Payouts

## 1. Visi Produk

Membangun platform terdesentralisasi yang meningkatkan kepercayaan dan efisiensi dalam kolaborasi tim remote dengan mengotomatisasi pembayaran bonus berdasarkan performa yang terukur dan transparan melalui smart contract. Proyek ini bertujuan untuk mengatasi masalah umum seperti kurangnya kepercayaan, keterlambatan pembayaran bonus, dan ketidakadilan dalam penilaian kontribusi individu di lingkungan kerja jarak jauh.

## 2. Fitur Inti

*   **Pemantauan Kinerja Otomatis:** Smart contract akan terintegrasi dengan alat manajemen proyek (misalnya, GitHub, Trello, Jira) untuk secara otomatis memantau indikator kinerja utama (KPI) seperti jumlah commit, penyelesaian tugas, atau pencapaian milestone.
*   **Escrow Bonus:** Bonus yang dijanjikan akan dikunci dalam smart contract escrow. Dana ini hanya akan dilepaskan kepada penerima setelah kondisi kinerja yang telah disepakati terpenuhi.
*   **Payout Otomatis:** Setelah kondisi kinerja diverifikasi oleh smart contract, bonus akan secara otomatis dicairkan ke dompet kripto penerima tanpa intervensi manual.
*   **Transparansi dan Immutabilitas:** Semua transaksi dan kondisi kontrak tercatat di blockchain, memastikan transparansi penuh dan ketidak-dapat-diubahnya perjanjian.

## 3. Simulasi Lokal untuk Validasi Desain

Sebelum implementasi penuh dan integrasi dengan layanan eksternal, desain fitur inti dan alur pengguna akan dimodelkan dan divalidasi secara komprehensif dalam lingkungan simulasi lokal (misalnya, menggunakan Hardhat Network). Pendekatan ini bertujuan untuk memastikan kelayakan desain dan mengidentifikasi potensi masalah pada tahap awal. **Skrip Python** akan memainkan peran kunci dalam mengorkestrasi simulasi ini, berinteraksi dengan kontrak (yang di-deploy di Hardhat Network), dan mengelola server tiruan untuk API/Oracle.

*   **Simulasi Pemantauan Kinerja Otomatis:**
    *   Akan disimulasikan bagaimana smart contract (atau versi abstraknya) menerima data kinerja. Misalnya, data tiruan (mock data) yang merepresentasikan jumlah commit GitHub, pergerakan kartu Trello, atau penyelesaian tugas Jira akan dibuat dan disediakan oleh **mock server Python (misalnya, menggunakan Flask/FastAPI)**.
    *   **Skrip Python** akan memicu logika smart contract untuk meminta data ini (mensimulasikan pemicu internal atau permintaan Oracle), dan kemudian mengumpankan data tiruan dari mock server ke logika smart contract untuk menguji bagaimana kontrak mengevaluasi pencapaian target.
    *   Interaksi dengan Oracle (seperti Chainlink) akan disimulasikan dengan **skrip Python** yang memanggil fungsi callback pada smart contract dengan respons data yang diharapkan, seolah-olah berasal dari Oracle via mock server.

*   **Simulasi Escrow Bonus dan Payout Otomatis:**
    *   Proses penyetoran dana bonus ke dalam escrow oleh manajer akan disimulasikan melalui panggilan ke fungsi kontrak dari **skrip Python**.
    *   Kondisi pemicu untuk payout (atau klaim kembali) akan diaktifkan menggunakan data kinerja simulasi yang disediakan oleh mock server dan diproses melalui alur yang diorkestrasi oleh **skrip Python**.
    *   Akan divalidasi (seringkali menggunakan asersi dalam **skrip Python** yang membaca state kontrak atau memantau event) bahwa logika smart contract secara benar melepaskan dana ke penerima ketika target tercapai, atau mengembalikan dana ke manajer jika target tidak tercapai dalam batas waktu.
    *   Semua skenario alternatif, termasuk penanganan kesalahan atau kondisi batas, akan diuji secara otomatis menggunakan **skrip Python** untuk mengatur kondisi dan memverifikasi hasil.

Validasi melalui simulasi lokal yang diorkestrasi Python ini memungkinkan iterasi desain yang cepat, pengujian logika inti secara terisolasi dan otomatis, serta pengurangan risiko sebelum pengembangan smart contract yang terhubung dengan sistem eksternal dan melibatkan aset nyata (bahkan di testnet).

## 4. Target Pengguna

*   **Tim Remote:** Tim yang bekerja secara terdistribusi dan membutuhkan mekanisme yang transparan dan otomatis untuk mengelola insentif berbasis kinerja.
*   **Manajer Proyek/Pemilik Bisnis:** Individu atau entitas yang ingin memastikan bahwa bonus dibayarkan secara adil dan efisien berdasarkan kontribusi nyata, serta mengurangi beban administrasi.
*   **Freelancer/Kontraktor:** Individu yang mencari jaminan pembayaran bonus yang adil dan otomatis setelah menyelesaikan tugas atau proyek.

## 5. User Flow (Contoh Skenario: Bonus Berbasis Commit GitHub)

_Catatan: Langkah-langkah dalam skenario berikut akan divalidasi terlebih dahulu melalui simulasi lokal untuk memastikan semua logika dan interaksi berjalan sesuai harapan sebelum implementasi dengan layanan eksternal seperti Chainlink dan GitHub API. **Skrip Python dapat digunakan untuk mengotomatisasi simulasi alur kerja ini, menyediakan input yang diperlukan pada setiap langkah, dan memverifikasi output atau perubahan state pada smart contract (yang berjalan di Hardhat Network).**_

### Skenario: Manajer Menetapkan Bonus untuk Pengembang

1.  **Manajer Menetapkan Kontrak:**
    *   Manajer (pemilik kontrak) mengakses antarmuka dApp (aplikasi terdesentralisasi).
    *   Manajer membuat kontrak baru, menentukan:
        *   Alamat dompet pengembang (penerima bonus).
        *   Jumlah bonus (misalnya, 1 ETH).
        *   Kondisi kinerja: "Pengembang harus mencapai 50 commit ke repositori GitHub 'my-project' dalam 30 hari."
        *   Periode waktu: 30 hari dari tanggal pembuatan kontrak.
        *   Sumber data eksternal (oracle): Menentukan Chainlink untuk mengambil data commit dari GitHub API. (Dalam simulasi lokal, ini akan menjadi respons Oracle yang disimulasikan).
    *   Manajer menyetorkan 1 ETH ke smart contract, yang kemudian dikunci dalam escrow. (Dalam simulasi lokal, ini adalah transfer dana di jaringan lokal).

2.  **Pemantauan Kinerja:**
    *   Smart contract secara berkala (misalnya, setiap hari atau setiap kali ada pemicu) meminta data commit dari oracle (Chainlink). (Dalam simulasi lokal, pemicu ini disimulasikan, dan data commit disediakan sebagai mock data).
    *   Oracle berinteraksi dengan GitHub API untuk mengambil jumlah commit pengembang di repositori 'my-project'. (Dalam simulasi lokal, langkah ini digantikan dengan penyediaan data commit yang telah ditentukan sebelumnya).
    *   Data commit dikirim kembali ke smart contract.
    *   Smart contract membandingkan jumlah commit yang diterima dengan target 50 commit.

3.  **Pencairan Bonus Otomatis (Jika Target Tercapai):**
    *   Jika dalam 30 hari, smart contract memverifikasi bahwa pengembang telah mencapai atau melebihi 50 commit:
        *   Smart contract secara otomatis melepaskan 1 ETH dari escrow.
        *   1 ETH dikirim langsung ke alamat dompet pengembang.
        *   Transaksi dicatat di blockchain, memberikan bukti pembayaran yang transparan. (Di jaringan lokal selama simulasi).

4.  **Penanganan Kegagalan (Jika Target Tidak Tercapai):**
    *   Jika setelah 30 hari, smart contract memverifikasi bahwa pengembang belum mencapai 50 commit:
        *   Smart contract akan mengembalikan 1 ETH dari escrow ke alamat dompet manajer (pemilik kontrak), atau sesuai dengan ketentuan lain yang ditetapkan dalam kontrak (misalnya, disimpan untuk tujuan lain).
        *   Transaksi dicatat di blockchain. (Di jaringan lokal selama simulasi).

### User Flow Lain yang Mungkin:

*   **Bonus Berbasis Penyelesaian Tugas Trello/Jira:** Mirip dengan di atas, tetapi oracle mengambil status tugas (misalnya, "Done") dari Trello/Jira API. (Disimulasikan dengan mock status tugas).
*   **Bonus Berbasis Milestone:** Bonus dicairkan setelah serangkaian tugas atau milestone tertentu diselesaikan dan diverifikasi. (Disimulasikan dengan mock penyelesaian milestone).
*   **Bonus Berjenjang:** Bonus yang berbeda dicairkan berdasarkan tingkat pencapaian kinerja (misalnya, 50 commit = X bonus, 100 commit = Y bonus). (Divalidasi dengan berbagai input data simulasi).

[end of memory-bank/dokumen-desain-produk.md]
