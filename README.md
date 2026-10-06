# Portofolio Ventyola Rohati Napitupulu

**Nama:** Ventyola Rohati Napitupulu
**NIM:** 12S24042
**Kelas:** 13SI2
**Mata Kuliah:** Pemrograman dan Pengujian Aplikasi Web (12S3101)

## Deskripsi

Website portofolio single page untuk Ventyola Rohati Napitupulu, mahasiswa Sistem Informasi Institut Teknologi Del. Situs ini menampilkan profil personal, pengalaman organisasi dan praktik, studi kasus karya, serta formulir layanan dengan konsep visual yang playful dan personal (tema "paper & sticker").

Pada Minggu 3, proyek ini **direfaktor dari HTML5 + CSS murni (Minggu 2) menjadi berbasis Bootstrap 5.3**, dipadukan dengan Custom CSS Overrides — tanpa menghilangkan identitas visual yang sudah dibangun sebelumnya.

## Daftar Fitur

- Layout single page dengan navigasi anchor ke section utama
- Navbar responsif dengan tombol hamburger (Bootstrap collapse) untuk layar ponsel
- Hero dengan badge, headline khas, dan elemen dekoratif SVG
- Section Tentang Saya: bio, peran, keahlian, alur kerja, dan prestasi
- Section Portofolio Karya: data kartu dan detail dimuat dari JSON, disaring di sisi klien, dan ditampilkan dalam satu modal universal
- Formulir layanan Bootstrap: Floating Labels, validasi visual, simulasi pengiriman pesanan, toast, dan riwayat pesanan di `localStorage`
- Tabel rekap karya dan pengalaman
- Sticky note kontak cepat di samping formulir

## Teknologi

- HTML5 semantik
- CSS3 (24 custom properties di `:root`, dimuat setelah Bootstrap agar override konsisten tanpa `!important`)
- Bootstrap 5.3.8 (CDN) + Bootstrap Icons 1.11.3
- JavaScript bawaan Bootstrap (collapse, modal) + skrip validasi form standar Bootstrap
- JavaScript Data Access Layer (`js/api-service.js`) dan Presentation Layer (`js/app.js`)
- JSON statis (`data/`) sebagai sumber data; tidak ada backend atau database sungguhan
- Google Fonts: Bricolage Grotesque, DM Sans, Caveat

## Arsitektur Minggu 4

### C4 Container Model

```mermaid
C4Container
    title C4 Container Model — Portofolio Minggu 4

    Person(user, "Pengguna", "Mengakses portofolio melalui browser")
    Container(browser, "Browser", "Client / Presentation Tier", "Merender index.html dan js/app.js; js/api-service.js mengambil data dan mengelola simulasi pesanan.")
    System_Ext(pages, "GitHub Pages", "Static CDN Hosting", "Menyajikan file situs sebagai konten statis; tidak menjalankan backend.")
    Container(json, "File JSON di /data", "JSON statis", "projects.json, services.json, profile.json; berperan sebagai simulasi JSON Provider/mock REST API, bukan server API sungguhan.")

    Rel(user, browser, "Membuka halaman dan berinteraksi")
    Rel(browser, pages, "Meminta index.html, CSS, dan JavaScript melalui HTTPS")
    Rel(browser, json, "GET /data/projects.json, /data/services.json, /data/profile.json melalui GitHub Pages")
    Rel(pages, json, "Menyajikan berkas JSON yang di-host secara statis")
    Rel(json, browser, "Mengembalikan data JSON statis")
```

Diagram ini menggambarkan hosting statis, bukan layanan backend: browser mengambil file JSON yang di-host sebagai aset melalui GitHub Pages. Pengiriman formulir layanan juga hanya simulasi di browser; riwayatnya disimpan di `localStorage`, bukan dikirim ke server atau database.

### Separation of Concerns

Pada Minggu 4, data proyek, layanan, dan profil ditempatkan terpisah dalam file JSON di `data/`. File-file ini menjadi sumber data statis yang dapat dibaca browser, bukan database dan bukan API backend sungguhan. Pemisahan ini membuat pembaruan konten lebih terarah: isi data dapat diubah tanpa mencari dan mengedit markup kartu atau modal satu per satu.

Logika akses data dipusatkan di `js/api-service.js`, sedangkan `js/app.js` menangani presentasi dan interaksi seperti loading state, filter, render kartu, modal universal, dan simulasi pengiriman pesanan. `index.html` menyediakan struktur halaman dan elemen dasar UI. Dibanding Minggu 3 yang menanam data proyek dan detailnya langsung di HTML, susunan ini mengurangi duplikasi, memudahkan pemeliharaan, dan memisahkan tanggung jawab tiap lapisan tanpa mengklaim adanya backend.

### Hasil Profiling DevTools

| Metrik | Cold Load | Warm Load |
|---|---|---|
| Time to First Byte (TTFB) | [isi] | [isi] |
| Jumlah Request | [isi] | [isi] |
| Total Transfer Size | [isi] | [isi] |
| Status Cache (ada 304 atau tidak) | [isi] | [isi] |

### Sebelum vs Sesudah Refactoring (Minggu 3 → Minggu 4)

| Aspek | Sebelum | Sesudah |
|---|---|---|
| Sumber data | [isi] | [isi] |
| Cara render kartu | [isi] | [isi] |
| Jumlah elemen modal | [isi] | [isi] |
| Cara submit form | [isi] | [isi] |
| Penyimpanan riwayat pesanan | [isi] | [isi] |

## Sebelum vs Sesudah Integrasi Framework (Minggu 2 → Minggu 3)

| Aspek | Sebelum (Minggu 2) | Sesudah (Minggu 3) |
|---|---|---|
| Navigasi | Daftar link statis di header, tanpa menu mobile | Navbar Bootstrap (`navbar-expand-lg`) dengan tombol hamburger yang collapse rapi di layar ponsel |
| Layout portofolio | 4 studi kasus tersusun manual berselang-seling memakai CSS Grid kustom | Grid kartu Bootstrap 12-kolom (`row-cols-1 row-cols-md-2 row-cols-lg-3 g-4`) yang otomatis menyesuaikan jumlah kolom per breakpoint |
| Detail proyek | Teks studi kasus lengkap langsung tampil di halaman, membuat halaman panjang | Ringkasan singkat di kartu; detail lengkap dipindah ke Bootstrap Modal (4 modal, isi berbeda per proyek) |
| Formulir | Input/select/textarea polos dengan label statis di atas field | Floating Labels (`.form-floating`), Input Group berikon pada email & telepon, serta `invalid-feedback`/`valid-feedback` per field |
| CSS kustom | Variabel `:root` dan gaya ditulis manual penuh untuk semua elemen | Variabel `:root` dipertahankan (24 variabel), ditambah override komponen Bootstrap (navbar, card, modal, form) agar tetap memakai identitas visual sendiri |
| Aturan `!important` | Tidak relevan (belum pakai Bootstrap) | Nol penggunaan `!important` di luar satu pengecualian terdokumentasi: `@media (prefers-reduced-motion: reduce)` untuk aksesibilitas |

### Kenapa perubahan ini dilakukan, bukan cuma "ganti tampilan"

**Navbar & responsivitas.** Di Minggu 2, semua link navigasi ditampilkan sejajar tanpa mempertimbangkan layar kecil — di HP, ini berisiko bertumpuk atau memaksa halaman melebar (overflow horizontal). Navbar Bootstrap menyelesaikan ini dengan pola *mobile-first*: link disembunyikan di balik tombol hamburger pada layar sempit, dan otomatis tampil sejajar di layar besar, tanpa satu baris kode JavaScript pun ditulis manual — semua dikendalikan lewat atribut `data-bs-toggle="collapse"` dan `data-bs-target`.

**Grid & Modal, bukan cuma estetika.** Menyimpan 4 studi kasus panjang langsung di halaman utama membuat pengguna harus scroll jauh sebelum sampai ke formulir kontak. Dengan memindahkan detail ke Modal, halaman utama jadi ringkas (pengguna cukup memindai kartu), sementara informasi lengkap tetap tersedia satu klik, tanpa reload halaman. Grid `row-cols-*` juga menyelesaikan masalah proporsi: pada Minggu 2, tata letak 4 kartu ditentukan manual per breakpoint; di Bootstrap, jumlah kolom otomatis menyesuaikan (1 kolom di HP, 2 di tablet, 3 di layar besar) tanpa perlu menulis ulang CSS Grid setiap kali.

**Formulir & validasi visual.** Form Minggu 2 memvalidasi input hanya lewat atribut HTML bawaan (`required`, `pattern`), tapi tidak memberi umpan balik visual yang jelas saat pengguna salah isi. Floating Labels membuat form terasa lebih modern dan menghemat ruang (label berfungsi ganda sebagai placeholder), sementara `invalid-feedback`/`valid-feedback` memberi konfirmasi visual instan — pengguna tidak perlu menebak apakah input mereka sudah benar.

**Kenapa custom CSS dipertahankan, bukan dihapus.** Alasan utama memakai Bootstrap bukan untuk mengganti identitas visual, tapi untuk mendapatkan *komponen* (navbar collapse, modal, form validation) yang sudah teruji dan accessible tanpa membangun dari nol. Semua warna, bentuk, dan micro-interaction (shadow kotak, border tebal, rotasi kecil pada elemen) yang menjadi identitas personal tetap dipertahankan lewat `custom-style.css` yang dimuat **setelah** Bootstrap CSS — sehingga override menang lewat urutan cascade, tanpa perlu memaksa lewat `!important`.

**Tampilan Sebelum (Minggu 2):**

![Tampilan portofolio Minggu 2 - Bagian Navigasi](assets/img/screenshot-sebelum1.jpeg)
![Tampilan portofolio Minggu 2 - Bagian Grid](assets/img/screenshot-sebelum2.jpeg)

**Tampilan Sesudah (Minggu 3, sudah Bootstrap 5):**

![Tampilan portofolio Minggu 3 - Bagian Navigasi](assets/img/screenshot-sesudah1.jpeg)
![Tampilan portofolio Minggu 3 - Bagian Grid](assets/img/screenshot-sesudah2.jpeg)

## Cara Menjalankan

1. Buka folder proyek ini di VS Code.
2. Jalankan ekstensi **Live Server** pada `index.html`, atau buka file tersebut langsung di browser.
3. Tidak ada instalasi tambahan — Bootstrap dan Bootstrap Icons dimuat lewat CDN, jadi memerlukan koneksi internet saat pertama kali membuka halaman.

## Branch

`week4-architecture` — refactor arsitektural Minggu 4, melanjutkan repositori Minggu 3 (`week3-bootstrap`).

## Live Demo (GitHub Pages)
https://ventyolanapitupulu.github.io/ppw-2026-week2-12S24042

## Struktur Folder

```text
.
├── index.html
├── style.css
├── README.md
├── data/
│   ├── projects.json
│   ├── services.json
│   └── profile.json
├── js/
│   ├── api-service.js
│   └── app.js
└── assets/
    └── img/
        ├── foto-ventyola.jpg
        ├── imuniku.jpg
        ├── triporia.jpg
        ├── tobaverse.jpg
        ├── infografis-kopi.jpg
        ├── screenshot-sebelum1.png
        ├── screenshot-sebelum2.png
        ├── screenshot-sesudah1.png
        └── screenshot-sesudah2.png
        
        
```