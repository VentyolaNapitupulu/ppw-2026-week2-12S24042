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
- Section Portofolio Karya: grid 4 kartu proyek (Bootstrap `row-cols-1/md-2/lg-3`), masing-masing terhubung ke Modal detail berisi studi kasus lengkap
- Formulir layanan Bootstrap: Floating Labels, Input Group berikon, validasi visual (`invalid-feedback`/`valid-feedback`)
- Tabel rekap karya dan pengalaman
- Sticky note kontak cepat di samping formulir

## Teknologi

- HTML5 semantik
- CSS3 (24 custom properties di `:root`, dimuat setelah Bootstrap agar override konsisten tanpa `!important`)
- Bootstrap 5.3.8 (CDN) + Bootstrap Icons 1.11.3
- JavaScript bawaan Bootstrap (collapse, modal) + skrip validasi form standar Bootstrap
- Google Fonts: Bricolage Grotesque, DM Sans, Caveat

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

`week3-bootstrap` — refactor Minggu 3, melanjutkan repositori Minggu 2 (`main`).

## Live Demo (GitHub Pages)
https://ventyolanapitupulu.github.io/ppw-2026-week2-12S24042

## Struktur Folder

```text
.
├── index.html
├── style.css
├── README.md
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