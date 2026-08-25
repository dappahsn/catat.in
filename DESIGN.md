# DESIGN.md

## 1. Project Overview

### Project Name
**Finance Web App**

### Product Type
Responsive Personal Finance Web Application / Progressive Web App.

### Primary Goal
Membuat aplikasi pencatatan keuangan yang:

- Ringan dan cepat.
- Mudah digunakan.
- Nyaman digunakan melalui smartphone maupun desktop.
- Memiliki tampilan seperti aplikasi native ketika dibuka melalui smartphone.
- Memiliki autentikasi Google.
- Menyimpan data pengguna secara aman di cloud.
- Memungkinkan pengguna mencatat pemasukan, pengeluaran, dan perpindahan saldo.
- Menyediakan rekap keuangan yang mudah dipahami.

---

# 2. Design Principles

Desain aplikasi harus mengikuti prinsip berikut.

### 2.1 Simple
Interface tidak boleh terlalu ramai.

Prioritaskan:

- Informasi penting.
- Angka keuangan.
- Transaksi.
- Aksi yang sering digunakan.

Hindari dekorasi yang tidak memiliki fungsi.

### 2.2 Lightweight
Hindari:

- Animasi berat.
- Background video.
- 3D.
- Efek blur berlebihan.
- Elemen visual yang menyebabkan loading lama.

Gunakan animasi sederhana melalui CSS.

### 2.3 Mobile First
Desain pertama dibuat untuk smartphone kemudian dikembangkan untuk desktop.

### 2.4 Fast Interaction
Aksi utama seperti:

- Tambah pemasukan.
- Tambah pengeluaran.
- Pindah saldo.

harus dapat dilakukan dengan sesedikit mungkin langkah.

### 2.5 Clear Financial Information
Informasi uang harus menjadi elemen yang paling mudah dibaca.

Contoh:

**Rp 4.250.000**

lebih menonjol daripada teks pendukungnya.

---

# 3. Target Devices

## Mobile

Ukuran utama:

- 360px
- 375px
- 390px
- 430px

Mobile menggunakan:

**Bottom Navigation**

---

## Tablet

Breakpoint:

768px – 1023px

Layout dapat menyesuaikan berdasarkan ruang yang tersedia.

---

## Desktop

Ukuran utama:

- 1024px
- 1280px
- 1440px
- 1920px

Desktop menggunakan:

**Top Navigation Bar**

---

# 4. Responsive Breakpoint

Gunakan breakpoint utama:

```css
Mobile:
< 768px

Desktop:
>= 768px
```

Navigasi:

```text
Mobile
Bottom Navigation

Desktop
Top Navigation
```

---

# 5. Application Structure

Aplikasi memiliki empat halaman utama.

```text
Finance App

├── Transaksi
│
├── Rekening
│
├── Rekap
│
└── Setting
```

Tidak diperlukan dashboard terpisah.

Halaman **Transaksi** menjadi halaman pertama setelah pengguna login.

---

# 6. Authentication

Authentication hanya menggunakan:

**Google Sign-In**

Tidak diperlukan:

- Username/password.
- Register form.
- Confirm password.
- Login email manual.

---

## 6.1 Login Page

### Layout

Desain minimal dan bersih.

Desktop:

```text
┌─────────────────────────────────────┐
│                                     │
│             Finance                 │
│                                     │
│       Kelola keuangan dengan        │
│             lebih mudah.            │
│                                     │
│      [ G Continue with Google ]     │
│                                     │
│       Privacy Policy • Terms        │
│                                     │
└─────────────────────────────────────┘
```

Mobile:

```text
┌──────────────────────┐
│                      │
│       Finance        │
│                      │
│   Catat dan kelola   │
│   keuanganmu dengan  │
│        mudah.        │
│                      │
│ [ G Login Google ]   │
│                      │
│                      │
└──────────────────────┘
```

---

## 6.2 User Data

Setelah login Google, ambil:

- Google User ID.
- Nama.
- Email.
- Profile picture.

Informasi akun ditampilkan pada halaman:

**Setting → Akun**

---

# 7. Navigation

# Mobile Navigation

Gunakan fixed bottom navigation.

```text
┌─────────────────────────────┐
│                             │
│          CONTENT            │
│                             │
├─────────────────────────────┤
│   ⇄       💳       ◉      ⚙ │
│Transaksi Rekening Rekap Setting
└─────────────────────────────┘
```

Menu:

1. Transaksi
2. Rekening
3. Rekap
4. Setting

Bottom navigation harus tetap terlihat ketika pengguna melakukan scroll.

---

## Active State

Menu aktif memiliki:

- Warna primary.
- Icon lebih tegas.
- Label menu terlihat jelas.

Menu tidak aktif:

- Neutral / muted color.

---

# Desktop Navigation

Gunakan navbar di bagian atas.

```text
┌───────────────────────────────────────────────────────────────┐
│ Finance     Transaksi   Rekening   Rekap   Setting       👤  │
└───────────────────────────────────────────────────────────────┘
```

Logo / nama aplikasi berada di kiri.

Menu berada di tengah/kiri.

User avatar berada di kanan.

Navbar:

```css
position: sticky;
top: 0;
```

---

# 8. Page Layout

Desktop menggunakan maximum content width:

```text
1200px – 1400px
```

Content berada di tengah.

Mobile:

```text
padding-left: 16px
padding-right: 16px
```

Desktop:

```text
padding-left/right: 24px – 32px
```

---

# 9. Transaksi Page

Transaksi merupakan halaman utama aplikasi.

## Header

Mobile:

```text
Transaksi                 🔔

Saldo
Rp 12.450.000

[ Hari ini ▼ ]

Riwayat
```

Desktop:

```text
Transaksi

Kelola semua aktivitas keuangan.

[ Filter tanggal ] [ Export ]

                                      + Tambah Transaksi
```

---

# 10. Transaction Date Filter

Pengguna dapat memilih:

```text
Hari Ini

Kemarin

7 Hari Terakhir

Bulan Ini

Pilih Tanggal

Custom Range
```

Contoh:

```text
01 Agustus 2026
        -
25 Agustus 2026
```

Gunakan date picker.

---

# 11. Transaction History

Transaksi dikelompokkan berdasarkan tanggal.

Contoh:

```text
Hari Ini
25 Agustus 2026

🍔 Makan Siang
Makanan • BCA
- Rp 45.000

💰 Freelance
Pendapatan • BCA
+ Rp 2.500.000

⇄ BCA → GoPay
Pindah Saldo
Rp 300.000
```

---

# 12. Transaction Color

Income:

```text
+ Rp 1.500.000
```

Gunakan semantic success color.

Expense:

```text
- Rp 50.000
```

Gunakan semantic danger color.

Transfer:

```text
Rp 500.000
```

Gunakan neutral / primary color.

Jangan mengandalkan warna sebagai satu-satunya indikator.

Gunakan juga:

```text
+
-
⇄
```

---

# 13. Add Transaction Button

Mobile menggunakan Floating Action Button.

```text
            ＋
```

Posisi:

```css
position: fixed;
bottom: 88px;
right: 20px;
```

Tidak boleh menutupi bottom navigation.

---

## Desktop

Gunakan:

```text
+ Tambah Transaksi
```

di bagian kanan atas halaman.

---

# 14. Add Transaction Action Sheet

Ketika tombol `+` ditekan:

Mobile menggunakan bottom sheet.

```text
Tambah Transaksi

↓ Pengeluaran

↑ Pemasukan

⇄ Pindah Saldo

────────────────

Batal
```

Desktop dapat menggunakan dropdown atau modal kecil.

---

# 15. Expense Form

Fields:

```text
Pengeluaran

Jumlah
Rp [_______________]

Rekening
[ BCA             ▼ ]

Kategori
[ Makanan         ▼ ]

Tanggal
[ 25 Agustus 2026 ]

Catatan
[_________________]

[ Simpan Pengeluaran ]
```

Required:

- Amount.
- Account.
- Category.
- Date.

Optional:

- Notes.

---

# 16. Income Form

```text
Pemasukan

Jumlah
Rp [_______________]

Rekening
[ BCA             ▼ ]

Kategori
[ Gaji            ▼ ]

Tanggal
[ 25 Agustus 2026 ]

Catatan
[_________________]

[ Simpan Pemasukan ]
```

---

# 17. Transfer Balance Form

Pindah saldo digunakan untuk memindahkan uang antar rekening.

```text
Pindah Saldo

Dari Rekening
[ BCA             ▼ ]

Ke Rekening
[ GoPay           ▼ ]

Jumlah
Rp [_______________]

Tanggal
[ 25 Agustus 2026 ]

Catatan
[_________________]

[ Pindahkan Saldo ]
```

Transfer tidak dihitung sebagai:

- Income.
- Expense.

Karena uang hanya berpindah antar rekening pengguna.

---

# 18. Transaction Detail

Ketika transaksi diklik:

```text
Detail Transaksi

Pengeluaran

Rp 45.000

Makan Siang

Kategori
Makanan

Rekening
BCA

Tanggal
25 Agustus 2026

Catatan
Makan siang bersama teman

[ Edit ]

[ Hapus Transaksi ]
```

---

# 19. Delete Transaction

Gunakan confirmation dialog.

```text
Hapus transaksi?

Transaksi ini akan dihapus secara permanen.

[ Batal ]

[ Hapus ]
```

---

# 20. Export Transaction

Pada halaman transaksi tersedia:

```text
Export
```

Format versi awal:

- CSV.

Versi berikutnya dapat menambahkan:

- XLSX.
- PDF.

Pengguna dapat memilih tanggal sebelum export.

Contoh:

```text
Export Data

Rentang:
01 Aug 2026 - 25 Aug 2026

Format:
CSV

[ Export ]
```

---

# 21. Rekening Page

Digunakan untuk mengelola sumber uang.

Contoh:

```text
Rekening

Total Saldo

Rp 12.450.000


BCA
Bank
Rp 7.500.000


Cash
Tunai
Rp 1.250.000


GoPay
E-Wallet
Rp 700.000


SeaBank
Bank
Rp 3.000.000
```

---

# 22. Add Account Button

Mobile:

```text
+
```

Floating button.

Ketika ditekan:

```text
Tambah Rekening
```

Desktop:

```text
+ Tambah Rekening
```

---

# 23. Add Account Form

```text
Tambah Rekening

Nama Rekening
[ BCA                 ]

Jenis Rekening
[ Bank              ▼ ]

Saldo Awal
Rp [_________________]

Icon
[ Pilih Icon ]

[ Simpan Rekening ]
```

---

# 24. Account Types

Jenis rekening:

```text
Bank

Cash / Tunai

E-Wallet

Lainnya
```

Contoh:

```text
BCA
Mandiri
BSI
SeaBank
Cash
GoPay
DANA
OVO
ShopeePay
```

Namun pengguna tetap dapat membuat nama sendiri.

---

# 25. Account Detail

Ketika rekening dipilih:

```text
BCA

Saldo
Rp 7.500.000

Pemasukan Bulan Ini
Rp 5.000.000

Pengeluaran Bulan Ini
Rp 2.000.000


Riwayat Transaksi

Makan
-50k

Gaji
+5jt
```

Action:

```text
Edit Rekening

Hapus Rekening
```

---

# 26. Rekap Page

Halaman Rekap memiliki tiga mode:

```text
Realtime

Bulanan

Custom
```

Gunakan segmented control.

Mobile:

```text
┌─────────┬─────────┬─────────┐
│Realtime │ Bulanan │ Custom  │
└─────────┴─────────┴─────────┘
```

---

# 27. Realtime Recap

Menampilkan kondisi keuangan berdasarkan data terbaru.

```text
Rekap

Realtime

Pemasukan
Rp 7.500.000

Pengeluaran
Rp 3.250.000

Selisih
Rp 4.250.000
```

---

# 28. Monthly Recap

Gunakan month selector.

```text
‹

Agustus 2026

›
```

Data:

```text
Pemasukan

Pengeluaran

Selisih
```

---

# 29. Custom Recap

Pengguna menentukan tanggal.

```text
Dari

01 Agustus 2026

Sampai

25 Agustus 2026

[ Terapkan ]
```

---

# 30. Donut Chart

Chart utama Rekap menggunakan:

**Donut Chart**

Default:

```text
Pengeluaran
```

Segment:

```text
Makanan

Transportasi

Belanja

Tagihan

Hiburan

Lainnya
```

Contoh visual:

```text
        ███████
     ███       ███
   ██             ██
  ██     3.2jt     ██
  ██               ██
   ██             ██
     ███       ███
        ███████
```

Tengah donut menampilkan total.

```text
Rp 3.250.000
Pengeluaran
```

---

# 31. Chart Filter

Sediakan toggle:

```text
Pengeluaran | Pemasukan
```

Ketika pengguna memilih pemasukan, donut chart berubah berdasarkan kategori pemasukan.

---

# 32. Category Breakdown

Di bawah chart:

```text
Makanan
35%
Rp 1.137.500

Transportasi
20%
Rp 650.000

Belanja
18%
Rp 585.000
```

Gunakan list sederhana.

---

# 33. Setting Page

Struktur halaman:

```text
Setting

├── Akun
├── Pengingat
├── Tampilan
├── Bahasa
├── Data
└── Keamanan
```

---

# 34. Account Settings

Tampilkan informasi Google Account:

```text
[ Avatar ]

Muhammad Daffa
example@gmail.com

Login dengan Google
```

Menu:

```text
Kelola Akun

Logout
```

---

# 35. Reminder Settings

Section:

```text
Pengingat

[ Toggle ] Pengingat harian
```

Jika aktif:

```text
Waktu Pengingat

20:00
```

Contoh notification:

```text
Jangan lupa mencatat transaksi hari ini.
```

Pengguna harus memberikan permission notification terlebih dahulu.

Jangan meminta notification permission ketika pertama kali membuka website.

Permission diminta ketika user mengaktifkan fitur Pengingat.

---

# 36. Theme Settings

Section:

```text
Tampilan
```

Pilihan mode:

```text
System

Light

Dark
```

---

# 37. Accent Color

Pengguna dapat memilih warna utama.

Contoh preset:

```text
Blue

Green

Purple

Orange

Red
```

Accent color digunakan untuk:

- Active navigation.
- Primary button.
- Chart highlight.
- Links.
- Selected controls.

Jangan mengubah warna semantic.

Success tetap success.

Danger tetap danger.

---

# 38. Language

Pilihan:

```text
Bahasa Indonesia

English
```

Default:

```text
Bahasa Indonesia
```

Bahasa hanya mengubah UI.

Data yang dimasukkan pengguna tidak diterjemahkan.

---

# 39. Backup Data

Setting:

```text
Data

Backup Data
```

Saat dipilih:

```text
Backup semua data?

Backup akan mencakup:

• Rekening
• Transaksi
• Kategori
• Pengaturan

[ Buat Backup ]
```

Format:

```text
JSON
```

Nama file:

```text
finance-backup-YYYY-MM-DD.json
```

---

# 40. Restore Data

```text
Restore Data

Pilih file backup

[ Select File ]
```

Sebelum restore:

```text
Restore data?

Data dari backup akan ditambahkan atau
menggantikan data berdasarkan pilihan Anda.

[ Batal ]

[ Restore ]
```

Validasi file sebelum import.

---

# 41. Delete All Data

Danger Zone:

```text
Hapus Semua Data
```

Gunakan danger style.

Confirmation:

```text
Hapus semua data?

Semua transaksi, rekening, dan data keuangan
akan dihapus secara permanen.

Tindakan ini tidak dapat dibatalkan.

Ketik:

HAPUS

[____________]

[ Batal ]

[ Hapus Semua Data ]
```

Google Account tidak ikut dihapus.

Yang dihapus hanya data aplikasi.

---

# 42. Logout

Logout berada di:

```text
Setting
→ Account
→ Logout
```

Confirmation sederhana:

```text
Keluar dari akun?

[ Batal ]

[ Logout ]
```

---

# 43. Color System

Gunakan CSS variables agar theme mudah diubah.

```css
--background
--foreground

--card
--card-foreground

--primary
--primary-foreground

--secondary
--secondary-foreground

--muted
--muted-foreground

--border

--success
--danger
--warning
```

---

# 44. Light Theme

Karakter:

- Background putih/off-white.
- Card putih.
- Border abu sangat muda.
- Teks hampir hitam.

Contoh:

```text
Background:
#F8F9FA

Surface:
#FFFFFF

Text Primary:
#171717

Text Secondary:
#737373
```

Exact implementation dapat menggunakan CSS variables.

---

# 45. Dark Theme

Karakter:

```text
Background:
near black

Surface:
dark gray

Text:
off white
```

Hindari pure black untuk seluruh interface.

Dark theme tetap memiliki hierarchy melalui surface dan border.

---

# 46. Default Accent

Default accent:

**Blue**

Digunakan untuk:

- CTA.
- Active navigation.
- Date selection.
- Selected tabs.
- Interactive controls.

---

# 47. Typography

Gunakan system-friendly font.

Rekomendasi:

```text
Inter
```

Fallback:

```css
font-family:
Inter,
system-ui,
-apple-system,
BlinkMacSystemFont,
"Segoe UI",
sans-serif;
```

---

# 48. Typography Scale

Mobile:

```text
Page Title:
24px / 700

Section Title:
18px / 600

Body:
14px - 16px

Caption:
12px - 13px

Financial Amount Large:
28px - 32px / 700
```

Desktop:

```text
Page Title:
28px - 32px

Financial Amount:
32px - 40px
```

---

# 49. Number Formatting

Currency default:

```text
IDR
```

Format:

```text
Rp 1.500.000
```

Bukan:

```text
Rp1,500,000.00
```

Untuk angka kecil:

```text
Rp 50.000
```

Summary cards dapat menggunakan:

```text
Rp 12,5 jt
```

jika ruang sangat terbatas.

Detail transaksi tetap menggunakan angka lengkap.

---

# 50. Spacing System

Gunakan basis 4px.

```text
4
8
12
16
20
24
32
40
48
```

Default card padding:

```text
16px mobile

20px - 24px desktop
```

---

# 51. Border Radius

Gunakan radius moderat.

```text
Input:
10px

Button:
10px

Card:
12px - 16px

Bottom Sheet:
20px top corners
```

Jangan terlalu rounded hingga terlihat seperti desain AI-generated.

---

# 52. Buttons

Primary:

```text
[ Simpan ]
```

Secondary:

```text
[ Batal ]
```

Danger:

```text
[ Hapus ]
```

Minimum touch target:

```text
44px
```

---

# 53. Inputs

Input harus memiliki:

- Label.
- Input field.
- Error state.
- Helper text jika diperlukan.

Jangan hanya menggunakan placeholder sebagai label.

Contoh:

```text
Jumlah

Rp [____________]
```

---

# 54. Empty States

Transaction empty state:

```text
Belum ada transaksi

Mulai catat pemasukan dan pengeluaranmu.

[ + Tambah Transaksi ]
```

Account empty state:

```text
Belum ada rekening

Tambahkan rekening untuk mulai mencatat keuangan.

[ + Tambah Rekening ]
```

---

# 55. Loading State

Gunakan skeleton sederhana.

Contoh:

```text
████████████

████████
██████████████

██████████
████████████
```

Hindari fullscreen spinner apabila tidak diperlukan.

---

# 56. Error State

Contoh:

```text
Gagal memuat transaksi.

Periksa koneksi internet dan coba kembali.

[ Coba Lagi ]
```

---

# 57. Success Feedback

Gunakan toast.

Contoh:

```text
Transaksi berhasil ditambahkan.
```

```text
Rekening berhasil dibuat.
```

```text
Data berhasil dipulihkan.
```

Toast tidak boleh menghalangi navigation.

---

# 58. Confirmation Rules

Confirmation wajib untuk:

- Delete transaction.
- Delete account.
- Delete all data.
- Restore backup jika mengganti data.
- Logout opsional.

Tidak perlu confirmation untuk:

- Add transaction.
- Filter date.
- Change theme.
- Change language.

---

# 59. Icons

Gunakan:

**Lucide React**

Icon harus konsisten.

Contoh:

```text
ArrowDown
Income

ArrowUp
Expense

ArrowLeftRight
Transfer

WalletCards
Account

ChartPie
Recap

Settings
Setting

Plus
Add

Download
Export

Bell
Reminder

User
Account
```

Jangan mencampur banyak icon library.

---

# 60. Animation

Gunakan animation seminimal mungkin.

Allowed:

```text
150ms – 250ms
```

Untuk:

- Button hover.
- Bottom sheet.
- Modal.
- Tab change.
- Dropdown.
- Navigation active state.

Tidak menggunakan:

- Parallax.
- 3D animation.
- Complex entrance animation.
- Large page transition.

---

# 61. Mobile Bottom Sheet

Gunakan bottom sheet untuk:

- Add transaction.
- Transaction type.
- Date filter.
- Account selector.
- Category selector.

Bottom sheet memiliki:

```text
Drag indicator

Title

Content

Action
```

Contoh:

```text
        ─────

Tambah Transaksi

↓ Pengeluaran

↑ Pemasukan

⇄ Pindah Saldo
```

---

# 62. Desktop Modal

Pada desktop, form dapat tampil sebagai modal.

Ukuran:

```text
max-width: 480px – 560px
```

Jangan membuat form memenuhi seluruh layar jika tidak diperlukan.

---

# 63. PWA Experience

Website dirancang agar dapat dipasang melalui:

```text
Add to Home Screen
```

Ketika dibuka dari homescreen:

- Berjalan standalone.
- Tidak terlihat address bar.
- Bottom navigation terasa seperti aplikasi native.
- Splash screen sederhana.
- Icon aplikasi tersedia.

---

# 64. PWA Mobile Layout

Pastikan mendukung:

```css
env(safe-area-inset-bottom)
```

agar bottom navigation aman pada perangkat seperti iPhone.

Bottom navigation height:

```text
64px + safe area
```

---

# 65. Performance Guidelines

Target aplikasi:

```text
Fast initial load

Low JavaScript bundle

Lazy loaded pages

Optimized queries

Minimal dependencies
```

---

## Avoid

Jangan gunakan jika tidak diperlukan:

```text
Three.js

GSAP

Heavy UI frameworks

Large animation packages

Huge icon packs

Background videos
```

---

# 66. Chart Performance

Library:

```text
Recharts
```

Hanya load chart pada halaman:

```text
Rekap
```

Gunakan lazy loading.

Tidak perlu load Recharts pada login page.

---

# 67. Transaction Performance

Jangan mengambil seluruh transaksi pengguna sekaligus.

Gunakan pagination.

Contoh:

```text
20 transaksi
```

per load.

Kemudian:

```text
Load More
```

atau infinite scroll.

---

# 68. Search and Filters

Versi awal fokus pada:

- Date filter.
- Transaction type.

Search text dapat ditambahkan jika diperlukan setelah MVP.

---

# 69. Database Visual Relationship

```text
USER
 │
 ├── PROFILE
 │
 ├── ACCOUNTS
 │      │
 │      └── TRANSACTIONS
 │
 ├── CATEGORIES
 │
 ├── REMINDERS
 │
 └── SETTINGS
```

Semua data harus memiliki hubungan dengan user.

---

# 70. Main Database Tables

```text
profiles

accounts

transactions

categories

user_settings

reminders
```

---

# 71. Transaction Types

```text
income

expense

transfer
```

---

# 72. Transfer Logic

Transfer harus:

```text
Source account
-
Amount

Destination account
+
Amount
```

Tetapi tidak masuk:

```text
Total Income

Total Expense
```

Transfer tetap muncul dalam transaction history.

---

# 73. Default Categories

Expense:

```text
Makanan

Transportasi

Belanja

Tagihan

Hiburan

Kesehatan

Pendidikan

Lainnya
```

Income:

```text
Gaji

Bonus

Freelance

Hadiah

Investasi

Lainnya
```

Kategori nantinya dapat dikembangkan menjadi customizable.

---

# 74. Application Routes

```text
/

/login

/transactions

/accounts

/recap

/settings
```

Optional detail routes:

```text
/transactions/:id

/accounts/:id
```

Protected route:

```text
/transactions

/accounts

/recap

/settings
```

Pengguna yang belum login diarahkan ke:

```text
/login
```

---

# 75. First Login Experience

Setelah pertama kali login:

```text
Login Google
    ↓
Welcome
    ↓
Tambahkan rekening pertama
    ↓
Masukkan saldo awal
    ↓
Masuk ke transaksi
```

Onboarding maksimal 2–3 langkah.

Jangan membuat onboarding panjang.

---

# 76. Mobile Primary Experience

User membuka aplikasi:

```text
Transaksi
```

Melihat:

```text
Saldo

Riwayat

Filter tanggal

+
```

Tekan:

```text
+
```

Kemudian:

```text
Pengeluaran
Pemasukan
Pindah Saldo
```

Ini merupakan flow utama aplikasi.

---

# 77. Desktop Primary Experience

```text
Top Navbar

Transaksi

Rekening

Rekap

Setting
```

CTA:

```text
+ Tambah Transaksi
```

selalu mudah ditemukan.

---

# 78. Accessibility

Minimum requirements:

- Touch target minimal 44px.
- Contrast cukup.
- Form memiliki labels.
- Button memiliki accessible name.
- Tidak bergantung hanya pada warna.
- Support keyboard navigation desktop.
- Focus state terlihat.
- Chart memiliki textual breakdown.

---

# 79. Security UX

Aplikasi menyimpan informasi keuangan pribadi.

Karena itu:

- Jangan menampilkan informasi sensitif sebelum user login.
- Session harus diverifikasi.
- Data harus dipisahkan berdasarkan user.
- Logout harus menghapus session lokal.
- Backup tidak boleh berisi token authentication.
- Tidak menyimpan OAuth secret pada frontend.

---

# 80. Row Level Security Requirement

Setiap tabel user-owned harus memiliki:

```text
user_id
```

User hanya boleh:

```text
SELECT
INSERT
UPDATE
DELETE
```

data dengan:

```text
user_id = authenticated user ID
```

---

# 81. Design Tone

Desain harus terasa:

```text
Clean

Professional

Modern

Trustworthy

Simple

Calm
```

Bukan:

```text
Futuristic AI

Gaming

Overdecorated

3D

Glassmorphism berlebihan
```

---

# 82. Visual Inspiration Direction

Gaya aplikasi dapat mengambil karakter dari aplikasi:

- Digital banking.
- Expense tracker.
- Modern fintech dashboard.

Namun desain harus tetap memiliki identitas sendiri.

Karakter utamanya:

```text
White space cukup

Strong typography

Simple cards

Clear financial numbers

Minimal iconography

Fast interaction
```

---

# 83. Mobile Example

```text
┌──────────────────────────────┐
│ Transaksi               🔔   │
│                              │
│ Total Saldo                  │
│ Rp 12.450.000                │
│                              │
│ [ Agustus 2026 ▼ ]           │
│                              │
│ Riwayat                      │
│                              │
│ Hari ini                     │
│                              │
│ 🍔 Makan Siang               │
│ BCA • Makanan      - Rp45.000│
│                              │
│ 💰 Freelance                 │
│ BCA              + Rp2.500k  │
│                              │
│                         (+)  │
│                              │
├──────────────────────────────┤
│ ⇄        💳        ◉      ⚙  │
│Transaksi Rekening Rekap Setting
└──────────────────────────────┘
```

---

# 84. Desktop Example

```text
┌─────────────────────────────────────────────────────────────┐
│ Finance   Transaksi   Rekening   Rekap   Setting      👤   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Transaksi                                  + Tambah Transaksi│
│                                                             │
│ Total Saldo                                                 │
│ Rp 12.450.000                                               │
│                                                             │
│ [ Agustus 2026 ▼ ]                     [ Export ]            │
│                                                             │
│ Riwayat                                                     │
│                                                             │
│ Hari ini                                                    │
│ ─────────────────────────────────────────────────────────── │
│ Makan Siang          BCA • Makanan            - Rp 45.000  │
│ Freelance            BCA                    + Rp 2.500.000  │
│ BCA → GoPay          Pindah Saldo               Rp 300.000  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 85. MVP Scope

## Authentication

- Google Login.
- Logout.
- Persistent session.

## Transactions

- Add income.
- Add expense.
- Transfer balance.
- Transaction history.
- Filter by date.
- Edit transaction.
- Delete transaction.
- Export transaction data.

## Accounts

- Create account.
- Edit account.
- Delete account.
- Initial balance.
- Current balance.
- Account transaction history.

## Recap

- Realtime.
- Monthly.
- Custom date.
- Income.
- Expense.
- Balance difference.
- Donut chart.
- Category breakdown.

## Settings

- Google account.
- Reminder.
- Notification.
- Light mode.
- Dark mode.
- System theme.
- Accent color.
- Indonesian language.
- English language.
- Backup.
- Restore.
- Delete all data.
- Logout.

---

# 86. Features Not Required for MVP

Jangan dibuat terlebih dahulu:

```text
AI financial assistant

Investment tracker

Cryptocurrency

Bank API integration

Automatic bank synchronization

OCR receipt scanner

Shared account

Family account

Multi currency conversion

Advanced analytics

Complex budgeting

Subscription management
```

Fitur tersebut dapat dipertimbangkan setelah MVP stabil.

---

# 87. Recommended Frontend Structure

```text
src/

├── assets/
│
├── components/
│   ├── navigation/
│   ├── transaction/
│   ├── account/
│   ├── recap/
│   ├── settings/
│   └── ui/
│
├── pages/
│   ├── Login/
│   ├── Transactions/
│   ├── Accounts/
│   ├── Recap/
│   └── Settings/
│
├── layouts/
│   └── AppLayout/
│
├── hooks/
│
├── services/
│
├── lib/
│   └── supabase/
│
├── store/
│
├── types/
│
├── utils/
│
├── App.tsx
│
└── main.tsx
```

---

# 88. Technology Direction

Frontend:

```text
React
Vite
TypeScript
Tailwind CSS
React Router
Lucide React
Recharts
```

Backend:

```text
Supabase

Authentication
PostgreSQL
Row Level Security
```

Authentication:

```text
Google OAuth
```

Deployment:

```text
Vercel
```

App Experience:

```text
PWA
```

---

# 89. Final Design Objective

Produk akhir harus terasa seperti:

> Aplikasi pencatatan keuangan mobile ketika dibuka dari smartphone dan dashboard keuangan modern ketika dibuka melalui desktop.

Mobile harus mengutamakan:

```text
Fast actions
Bottom navigation
Bottom sheets
One-hand usage
```

Desktop harus mengutamakan:

```text
Top navigation
Wider content
Efficient data scanning
Desktop-friendly dialogs
```

Semua versi harus menggunakan sistem desain, data, dan fitur yang sama.

---

# 90. Product Priority

Urutan prioritas desain:

```text
1. Usability
2. Speed
3. Clarity
4. Data Safety
5. Responsiveness
6. Visual polish
7. Animation
```

Aplikasi tidak boleh mengorbankan performa hanya demi efek visual.

---

**End of DESIGN.md**