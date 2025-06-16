**PROPOSAL PROYEK: Performance-Triggered Smart Contract with Escrowed Bonus Payouts for Remote Work Collaboration**

**Bab 1: Pendahuluan**
* **Latar Belakang:** Dalam sistem kerja jarak jauh (remote), seringkali muncul masalah seperti tim sulit percaya apakah rekan kerjanya benar-benar bekerja sesuai target, serta pemberian bonus yang tidak transparan, sering terlambat, atau tidak adil. Tantangan ini menghambat produktivitas dan kepercayaan dalam kolaborasi remote.
* **Rumusan Masalah:** Bagaimana membangun sistem yang dapat secara otomatis memverifikasi kontribusi individu dalam tim remote dan memberikan bonus secara transparan dan otomatis berdasarkan performa yang terukur, sambil mengatasi masalah kepercayaan?
* **Tujuan:** Mengembangkan smart contract yang dapat memantau indikator kinerja kolaborasi remote secara otomatis (e.g., jumlah commit, penyelesaian milestone, aktivitas di tools manajemen proyek), mengunci bonus dalam escrow, dan membayar bonus secara otomatis hanya jika target atau kontribusi yang disepakati tercapai, sehingga meningkatkan kepercayaan dan efisiensi dalam kolaborasi remote.

**Bab 2: Tinjauan Pustaka/Dasar Teori**
* **Smart Contract:** Kontrak yang tersimpan dan dieksekusi secara otomatis di blockchain, tanpa intervensi pihak ketiga. Menjamin transparansi dan ketidak-dapat-diubahnya perjanjian.
* **Escrow:** Sebuah rekening perantara digital di mana dana (bonus) disimpan secara aman oleh smart contract hingga kondisi yang disepakati terpenuhi.
* **Integrasi API/Webhook:** Mekanisme untuk smart contract berinteraksi dengan platform eksternal seperti GitHub (untuk commit), Trello/Jira (untuk status task/milestone), untuk mendapatkan data real-time.
* **Indikator Kinerja (KPI) Kolaborasi:** Metrik yang dapat digunakan untuk mengukur kontribusi, seperti jumlah commit ke repository, penyelesaian milestone, dan aktivitas harian/mingguan di tools manajemen proyek.

**Bab 3: Metodologi/Rancangan Proyek**
* **Pemantauan Metrik Otomatis:** Smart contract akan menggunakan API/Webhook dari platform seperti GitHub dan Trello (atau Jira) untuk memantau indikator kinerja secara real-time. Contoh indikator: jumlah commit, status task (misal, "Done" di Trello), penyelesaian milestone.
* **Penguncian Bonus dalam Escrow:** Bonus yang dijanjikan akan dikirim ke alamat smart contract dan dikunci dalam escrow. Bonus tidak akan langsung diberikan kepada penerima.
* **Pembayaran Bonus Otomatis:**
    * Jika target kinerja (misalnya, modul API selesai dalam 7 hari) tercapai dalam batas waktu yang disepakati dan diverifikasi oleh smart contract melalui data yang dipantau, bonus akan langsung dikirim otomatis ke rekening/dompet kripto pekerja.
    * Jika target tidak tercapai dalam batas waktu, smart contract akan menyimpan bonus tersebut (misalnya, kembali ke pemilik kontrak atau disimpan untuk tujuan lain yang ditentukan dalam kontrak).
* **Contoh Skenario:** Anggota tim sepakat bahwa jika salah satu anggota menyelesaikan modul API dalam 7 hari, ia berhak mendapatkan bonus Rp1.000.000. Smart contract akan memantau commit dan status task via GitHub dan Trello. Jika target tercapai dalam batas waktu, bonus akan langsung dikirim otomatis. Jika tidak tercapai, bonus tetap disimpan atau dikembalikan.