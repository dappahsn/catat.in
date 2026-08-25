# PRD.md

## 1. Product Overview

### Product Name
**Finance Web App**

### Product Type
Responsive Personal Finance Web Application / Progressive Web App.

### Platform
- Web Desktop
- Mobile Web
- Progressive Web App (PWA)

### Authentication
- Google Sign-In

### Primary Purpose
Membantu pengguna mencatat, mengelola, memantau, dan merekap keuangan pribadi secara sederhana melalui satu aplikasi yang ringan dan responsif.

Aplikasi harus memberikan pengalaman seperti aplikasi mobile ketika dibuka melalui smartphone, namun tetap terasa seperti dashboard web yang profesional ketika dibuka melalui desktop.

---

# 2. Problem Statement

Banyak pengguna memiliki beberapa sumber dana seperti:

- Rekening bank
- E-wallet
- Uang tunai
- Rekening digital

Namun pencatatan pemasukan, pengeluaran, dan perpindahan saldo sering dilakukan secara terpisah atau bahkan tidak dilakukan sama sekali.

Permasalahan utama yang ingin diselesaikan aplikasi:

1. Pengguna kesulitan mengetahui total saldo seluruh rekening.
2. Pengguna sulit melacak pengeluaran harian.
3. Pengguna tidak memiliki rekap pemasukan dan pengeluaran yang sederhana.
4. Perpindahan uang antar rekening sering salah dianggap sebagai pengeluaran atau pemasukan.
5. Pengguna membutuhkan riwayat transaksi berdasarkan periode tertentu.
6. Pengguna membutuhkan backup data keuangan.
7. Pengguna ingin mengakses pencatatan keuangan dengan cepat dari smartphone.
8. Aplikasi finansial yang terlalu kompleks dapat membuat proses pencatatan terasa merepotkan.

---

# 3. Product Goal

Membangun aplikasi pencatatan keuangan pribadi yang:

- Cepat.
- Ringan.
- Mudah digunakan.
- Mobile-first.
- Aman.
- Responsif.
- Mudah dipahami pengguna baru.

Aplikasi memungkinkan pengguna melakukan aktivitas utama dalam beberapa langkah sederhana.

Aktivitas tersebut meliputi:

- Mencatat pengeluaran.
- Mencatat pemasukan.
- Memindahkan saldo.
- Mengelola rekening.
- Melihat riwayat transaksi.
- Melihat rekap keuangan.
- Melakukan backup dan restore data.

---

# 4. Product Vision

Membuat aplikasi keuangan pribadi yang cukup sederhana untuk digunakan setiap hari, tetapi tetap memiliki informasi yang cukup untuk membantu pengguna memahami kondisi keuangannya.

Aplikasi harus terasa seperti:

> Catatan keuangan pribadi yang cepat, sederhana, aman, dan selalu mudah diakses.

---

# 5. Target Users

## Primary User

Individu yang ingin mengelola keuangan pribadi.

Contoh:

- Mahasiswa.
- Fresh graduate.
- Karyawan.
- Freelancer.
- Pengguna dengan beberapa rekening.
- Pengguna yang menggunakan banyak e-wallet.
- Pengguna yang ingin mulai mencatat pengeluaran.

---

# 6. User Needs

Pengguna membutuhkan kemampuan untuk:

1. Login dengan cepat.
2. Menambahkan rekening.
3. Melihat total saldo.
4. Menambahkan transaksi.
5. Memisahkan pemasukan dan pengeluaran.
6. Memindahkan saldo antar rekening.
7. Melihat riwayat transaksi.
8. Memfilter transaksi berdasarkan tanggal.
9. Mengekspor transaksi.
10. Melihat rekap keuangan.
11. Melihat distribusi pengeluaran melalui chart.
12. Melakukan backup data.
13. Melakukan restore data.
14. Mengatur pengingat.
15. Mengubah bahasa.
16. Mengubah tema aplikasi.
17. Menghapus seluruh data apabila diperlukan.

---

# 7. Core Navigation

Aplikasi memiliki empat menu utama:

```text
Transaksi
Rekening
Rekap
Setting
```

---

# 8. Platform Navigation

## Mobile

Gunakan bottom navigation:

```text
Transaksi | Rekening | Rekap | Setting
```

Navigasi selalu terlihat di bagian bawah layar.

---

## Desktop

Gunakan top navigation:

```text
Finance | Transaksi | Rekening | Rekap | Setting | User
```

---

# 9. User Authentication

## 9.1 Login Method

Versi pertama hanya menyediakan:

**Continue with Google**

Tidak menyediakan:

- Email/password manual.
- Username.
- Apple login.
- Facebook login.
- Register form manual.

---

# 10. Authentication Flow

```text
Open App
    ↓
Check Session
    ↓
No Session
    ↓
Login Page
    ↓
Continue with Google
    ↓
Google OAuth
    ↓
Authentication Success
    ↓
Check User Profile
    ↓
Existing User?
    ├── Yes → Transactions
    │
    └── No → First Setup
```

---

# 11. First User Setup

Jika pengguna baru pertama kali login:

```text
Welcome
   ↓
Tambah Rekening Pertama
   ↓
Masukkan Saldo Awal
   ↓
Simpan
   ↓
Transaksi
```

Onboarding harus singkat.

Target maksimal:

**2–3 langkah.**

---

# 12. User Profile

Data yang diperoleh dari Google:

- User ID.
- Name.
- Email.
- Profile image.

Data tersebut ditampilkan di:

```text
Setting → Akun
```

---

# 13. Feature 1 — Transaksi

## Objective

Memberikan tempat utama bagi pengguna untuk melihat dan mencatat seluruh aktivitas keuangan.

---

# 14. Transaction Types

Aplikasi memiliki tiga jenis transaksi:

```text
Income
Expense
Transfer
```

Dalam UI Bahasa Indonesia:

```text
Pemasukan
Pengeluaran
Pindah Saldo
```

---

# 15. Add Transaction

Di halaman Transaksi terdapat tombol:

```text
+
```

Pada mobile tombol berupa Floating Action Button.

Pada desktop tombol berupa:

```text
+ Tambah Transaksi
```

---

# 16. Add Transaction Menu

Ketika pengguna menekan tombol tambah:

```text
Tambah Transaksi

Pengeluaran
Pemasukan
Pindah Saldo
```

---

# 17. Add Expense

## Required Fields

- Jumlah.
- Rekening.
- Kategori.
- Tanggal.

## Optional Fields

- Catatan.

Contoh:

```text
Jumlah
Rp 50.000

Rekening
BCA

Kategori
Makanan

Tanggal
25 Agustus 2026

Catatan
Makan siang
```

---

# 18. Expense Logic

Ketika pengeluaran dibuat:

```text
Account Balance
-
Expense Amount
```

Transaksi masuk ke:

- Riwayat transaksi.
- Rekap pengeluaran.
- Rekap kategori.
- Chart pengeluaran.

---

# 19. Add Income

## Required Fields

- Jumlah.
- Rekening.
- Kategori.
- Tanggal.

## Optional

- Catatan.

---

# 20. Income Logic

Ketika pemasukan dibuat:

```text
Account Balance
+
Income Amount
```

Transaksi masuk ke:

- Riwayat.
- Rekap pemasukan.
- Chart pemasukan.

---

# 21. Transfer Balance

Pindah Saldo memungkinkan pengguna memindahkan uang antar rekening.

Required:

- Rekening asal.
- Rekening tujuan.
- Jumlah.
- Tanggal.

Optional:

- Catatan.

---

# 22. Transfer Rules

Rekening asal tidak boleh sama dengan rekening tujuan.

Contoh:

```text
BCA
↓
Rp 500.000
↓
GoPay
```

Maka:

```text
BCA:
- Rp500.000

GoPay:
+ Rp500.000
```

---

# 23. Transfer Reporting Rule

Pindah Saldo:

**tidak dihitung sebagai pemasukan.**

**tidak dihitung sebagai pengeluaran.**

Tetap ditampilkan dalam:

- Riwayat transaksi.
- Detail rekening.

---

# 24. Transaction History

Halaman Transaksi menampilkan seluruh transaksi.

Data dikelompokkan berdasarkan tanggal.

Contoh:

```text
Hari Ini

Makan Siang
BCA • Makanan
- Rp 50.000

Freelance
BCA • Pendapatan
+ Rp 2.500.000

BCA → GoPay
Pindah Saldo
Rp 300.000
```

---

# 25. Transaction Sorting

Default sorting:

```text
Newest
↓
Oldest
```

Transaksi terbaru berada paling atas.

---

# 26. Transaction Date Filter

Pengguna dapat memilih:

- Hari ini.
- Kemarin.
- 7 hari terakhir.
- Bulan ini.
- Tanggal tertentu.
- Custom date range.

---

# 27. Custom Date Range

Contoh:

```text
Tanggal Awal
01 Agustus 2026

Tanggal Akhir
25 Agustus 2026
```

Setelah memilih:

```text
Terapkan
```

---

# 28. Transaction Detail

Ketika transaksi dipilih, tampil:

- Tipe.
- Jumlah.
- Rekening.
- Kategori.
- Tanggal.
- Catatan.
- Created timestamp.

Action:

- Edit.
- Delete.

---

# 29. Edit Transaction

Pengguna dapat mengubah:

- Amount.
- Account.
- Category.
- Date.
- Notes.

Sistem harus menghitung ulang saldo rekening jika transaksi yang diedit memengaruhi saldo.

---

# 30. Delete Transaction

Pengguna dapat menghapus transaksi.

Sebelum hapus:

```text
Hapus transaksi?

Transaksi ini akan dihapus secara permanen.

Batal | Hapus
```

Saldo rekening harus dihitung ulang setelah transaksi dihapus.

---

# 31. Export Transaction Data

Halaman Transaksi memiliki fitur:

```text
Export
```

Versi MVP mendukung:

**CSV**

---

# 32. Export Filters

Export mengikuti rentang tanggal yang dipilih.

Contoh:

```text
01/08/2026
-
25/08/2026
```

Data CSV minimal:

```text
Date
Type
Account
Destination Account
Category
Amount
Notes
```

---

# 33. Feature 2 — Rekening

## Objective

Memberikan pengguna kemampuan untuk mengelola seluruh tempat penyimpanan dana.

---

# 34. Account Types

Jenis rekening:

- Bank.
- Cash.
- E-Wallet.
- Lainnya.

---

# 35. Account Examples

Contoh rekening:

- BCA.
- BSI.
- Mandiri.
- SeaBank.
- Cash.
- GoPay.
- DANA.
- OVO.
- ShopeePay.

User tidak dibatasi pada daftar tersebut.

---

# 36. Account List

Halaman Rekening menampilkan:

```text
Total Saldo

Rp 12.450.000

BCA
Rp 7.500.000

Cash
Rp 1.250.000

GoPay
Rp 700.000

SeaBank
Rp 3.000.000
```

---

# 37. Total Balance

Formula:

```text
Total Balance =
sum(current_balance of all active accounts)
```

---

# 38. Add Account

Halaman Rekening memiliki button:

```text
+
```

Pada desktop:

```text
+ Tambah Rekening
```

---

# 39. Add Account Fields

Required:

- Nama rekening.
- Jenis rekening.
- Saldo awal.

Optional:

- Icon.

---

# 40. Initial Balance

Saldo awal digunakan saat pengguna pertama kali memasukkan rekening.

Contoh:

```text
BCA

Saldo Awal:
Rp 3.000.000
```

Saldo awal bukan pemasukan baru apabila uang tersebut sudah dimiliki sebelum menggunakan aplikasi.

---

# 41. Account Detail

Detail rekening menampilkan:

- Nama rekening.
- Jenis.
- Current balance.
- Monthly income.
- Monthly expense.
- Transaction history.

---

# 42. Edit Account

Pengguna dapat mengubah:

- Nama.
- Jenis.
- Icon.

Saldo tidak boleh diedit langsung tanpa alasan transaksi, kecuali melalui mekanisme:

**Adjustment Balance**

Fitur adjustment dapat menjadi enhancement setelah MVP jika diperlukan.

---

# 43. Delete Account

Pengguna dapat menghapus rekening.

Jika rekening masih memiliki transaksi, sistem harus memberikan warning.

Contoh:

```text
Rekening ini memiliki transaksi.

Menghapus rekening dapat memengaruhi riwayat keuangan.
```

Pilihan MVP yang direkomendasikan:

**Rekening tidak boleh dihapus jika masih memiliki transaksi.**

User harus memindahkan atau menghapus transaksi terlebih dahulu.

---

# 44. Feature 3 — Rekap

## Objective

Menampilkan ringkasan kondisi keuangan pengguna berdasarkan periode tertentu.

---

# 45. Recap Modes

Tiga mode:

```text
Realtime
Bulanan
Custom
```

---

# 46. Realtime Recap

Realtime menampilkan kondisi keuangan berdasarkan data terbaru.

Menampilkan:

- Total pemasukan.
- Total pengeluaran.
- Selisih.
- Donut chart.
- Category breakdown.

---

# 47. Monthly Recap

Pengguna dapat memilih bulan.

Contoh:

```text
< Agustus 2026 >
```

Navigation:

```text
Previous Month
Next Month
```

---

# 48. Monthly Metrics

Tampilkan:

```text
Pemasukan

Rp 7.500.000
```

```text
Pengeluaran

Rp 3.250.000
```

```text
Selisih

Rp 4.250.000
```

---

# 49. Difference Formula

```text
Difference =
Income - Expense
```

Jika positif:

```text
+ Rp 4.250.000
```

Jika negatif:

```text
- Rp 1.000.000
```

---

# 50. Custom Recap

Pengguna memilih:

- Start date.
- End date.

Contoh:

```text
01 Januari 2026
-
25 Agustus 2026
```

---

# 51. Recap Chart

Chart utama:

**Donut Chart**

---

# 52. Donut Chart Modes

User dapat memilih:

```text
Pengeluaran | Pemasukan
```

---

# 53. Expense Donut

Donut mengelompokkan transaksi berdasarkan kategori.

Contoh:

```text
Makanan        35%
Transportasi   20%
Belanja        18%
Tagihan        15%
Lainnya        12%
```

---

# 54. Donut Center

Tengah chart menampilkan total.

Contoh:

```text
Rp 3.250.000

Pengeluaran
```

---

# 55. Chart Interaction

Ketika kategori chart ditekan atau dipilih:

Tampilkan:

- Nama kategori.
- Persentase.
- Total.

Contoh:

```text
Makanan

35%

Rp 1.137.500
```

---

# 56. Category Breakdown

Di bawah chart tampil daftar kategori.

Contoh:

```text
Makanan
35%
Rp 1.137.500

Transportasi
20%
Rp 650.000
```

---

# 57. Feature 4 — Setting

Halaman Setting memiliki:

```text
Akun
Pengingat
Tampilan
Bahasa
Data
```

---

# 58. Account Settings

Tampilkan:

- Avatar Google.
- Name.
- Email.
- Authentication provider.

Example:

```text
Muhammad Daffa
example@gmail.com

Google
```

---

# 59. Logout

User dapat melakukan logout.

Logout harus:

- Menghapus local session.
- Kembali ke login page.
- Tidak menghapus data pengguna.

---

# 60. Reminder

Pengguna dapat mengaktifkan reminder.

Contoh:

```text
Pengingat Harian
ON / OFF
```

---

# 61. Reminder Time

Jika aktif:

User dapat menentukan waktu.

Contoh:

```text
20:00
```

---

# 62. Reminder Message

Default:

```text
Jangan lupa mencatat transaksi hari ini.
```

---

# 63. Notification Permission

Aplikasi tidak boleh langsung meminta notification permission ketika user pertama kali masuk.

Permission hanya diminta setelah:

```text
Setting
→ Pengingat
→ Aktifkan
```

---

# 64. Theme Mode

User dapat memilih:

- System.
- Light.
- Dark.

Default:

```text
System
```

---

# 65. Accent Color

Preset:

- Blue.
- Green.
- Purple.
- Orange.
- Red.

Default:

```text
Blue
```

---

# 66. Accent Behavior

Accent digunakan untuk:

- Buttons.
- Navigation active state.
- Tabs.
- Links.
- Chart highlights.

Semantic color tidak berubah.

Expense tetap menggunakan danger indication.

Income tetap menggunakan success indication.

---

# 67. Language

Support MVP:

```text
Bahasa Indonesia
English
```

Default:

```text
Bahasa Indonesia
```

---

# 68. Language Persistence

Bahasa yang dipilih disimpan pada user settings sehingga tetap sama ketika user login dari device lain.

---

# 69. Backup Data

User dapat membuat backup data.

Format:

```text
JSON
```

---

# 70. Backup Content

Backup mencakup:

- Accounts.
- Transactions.
- Categories.
- Settings.
- Reminder settings.

Tidak mencakup:

- Google password.
- OAuth token.
- Authentication secret.

---

# 71. Backup File Name

Format:

```text
finance-backup-YYYY-MM-DD.json
```

Contoh:

```text
finance-backup-2026-08-25.json
```

---

# 72. Restore Data

Pengguna dapat memilih file backup.

System harus:

1. Membaca file.
2. Validasi format.
3. Validasi versi backup.
4. Preview summary.
5. Minta confirmation.
6. Restore.

---

# 73. Restore Summary

Contoh:

```text
Backup ditemukan

4 rekening
320 transaksi
15 kategori

Tanggal backup:
25 Agustus 2026

Restore?
```

---

# 74. Invalid Backup

Jika file tidak valid:

```text
File backup tidak valid atau rusak.
```

Data existing tidak boleh berubah.

---

# 75. Delete All Data

Setting memiliki:

```text
Danger Zone

Hapus Semua Data
```

---

# 76. Delete All Data Scope

Menghapus:

- Accounts.
- Transactions.
- Custom categories.
- Recap-related user data.

Tidak menghapus:

- Google Account.
- Supabase Authentication account, kecuali nanti tersedia fitur Delete Account terpisah.

---

# 77. Delete Confirmation

User harus mengetik:

```text
HAPUS
```

sebelum tombol aktif.

---

# 78. Categories

System memiliki default categories.

---

# 79. Expense Categories

Default:

- Makanan.
- Transportasi.
- Belanja.
- Tagihan.
- Hiburan.
- Kesehatan.
- Pendidikan.
- Lainnya.

---

# 80. Income Categories

Default:

- Gaji.
- Freelance.
- Bonus.
- Hadiah.
- Investasi.
- Lainnya.

---

# 81. Custom Categories

MVP dapat mendukung custom category jika implementasi tetap sederhana.

User dapat:

- Add.
- Edit.
- Delete.

Kategori yang sedang digunakan transaksi tidak boleh langsung dihapus tanpa warning.

---

# 82. Mobile Experience

Mobile harus terasa seperti mobile application.

Gunakan:

- Bottom navigation.
- Floating action button.
- Bottom sheet.
- Full-width content.
- Native-feeling touch target.

---

# 83. Desktop Experience

Desktop menggunakan:

- Top navbar.
- Wider layout.
- Modal.
- Table/list yang lebih padat.
- Hover interaction.

---

# 84. PWA Requirements

Aplikasi mendukung Progressive Web App.

User dapat:

```text
Add to Home Screen
```

---

# 85. PWA Requirements

Minimum:

- Web app manifest.
- App icons.
- Standalone display.
- Theme color.
- Responsive layout.
- Service worker jika diperlukan.

---

# 86. Offline Strategy

Versi MVP tidak harus mendukung full offline transaction sync.

Namun PWA dapat melakukan caching untuk:

- Static assets.
- UI shell.
- Fonts.
- Icons.

Jika internet offline dan data tidak tersedia:

```text
Tidak ada koneksi internet.
```

Tidak boleh memberikan kesan transaksi sudah tersimpan jika sebenarnya belum tersinkronisasi.

---

# 87. Performance Requirements

Application harus ringan.

Target:

- Minimal dependencies.
- Lazy-loaded routes.
- Lazy-loaded chart.
- Optimized database query.
- No heavy animation library.

---

# 88. Performance Targets

Target aspiratif:

```text
First Contentful Paint < 2s
```

pada koneksi normal.

```text
Lighthouse Performance > 90
```

pada halaman utama jika memungkinkan.

---

# 89. Transaction Pagination

Jangan load seluruh transaksi.

Default:

```text
20 items
```

per query.

Kemudian:

```text
Load More
```

atau infinite scroll.

---

# 90. Database Technology

Backend:

**Supabase PostgreSQL**

---

# 91. Authentication Technology

Authentication:

**Supabase Auth + Google OAuth**

---

# 92. Frontend Technology

Recommended:

```text
React
Vite
TypeScript
Tailwind CSS
React Router
Lucide React
Recharts
```

---

# 93. Deployment

Recommended:

```text
Vercel
```

---

# 94. Database Tables

Main tables:

```text
profiles

accounts

transactions

categories

user_settings

reminders
```

---

# 95. profiles Table

Fields:

```text
id
full_name
email
avatar_url
created_at
updated_at
```

`id` harus berhubungan dengan authenticated user.

---

# 96. accounts Table

Fields:

```text
id
user_id
name
type
icon
initial_balance
created_at
updated_at
```

---

# 97. transactions Table

Fields:

```text
id
user_id

type

account_id

destination_account_id

category_id

amount

transaction_date

notes

created_at

updated_at
```

---

# 98. Transaction Type Values

```text
income

expense

transfer
```

---

# 99. destination_account_id

Digunakan hanya ketika:

```text
type = transfer
```

Untuk income dan expense:

```text
destination_account_id = null
```

---

# 100. categories Table

Fields:

```text
id
user_id
name
type
icon
is_default
created_at
```

Type:

```text
income

expense
```

---

# 101. user_settings Table

Fields:

```text
id
user_id

language

theme

accent_color

currency

created_at

updated_at
```

---

# 102. Default Settings

```text
language:
id

theme:
system

accent_color:
blue

currency:
IDR
```

---

# 103. reminders Table

Fields:

```text
id

user_id

enabled

time

created_at

updated_at
```

---

# 104. Balance Calculation Strategy

Saldo rekening tidak harus disimpan sebagai nilai statis yang terus diedit.

Recommended strategy:

```text
Current Balance =
Initial Balance
+ Total Income
- Total Expense
+ Incoming Transfer
- Outgoing Transfer
```

Pendekatan ini membantu menjaga konsistensi data.

Jika nanti dibutuhkan optimasi, current balance dapat menggunakan cached value atau database function.

---

# 105. Security Requirements

Karena aplikasi menyimpan informasi keuangan pribadi:

- Semua protected page membutuhkan authentication.
- Semua data harus memiliki user ownership.
- User tidak dapat membaca data user lain.
- User tidak dapat mengedit data user lain.
- OAuth secrets tidak boleh berada di frontend.
- Backup tidak boleh mengandung auth token.

---

# 106. Row Level Security

Setiap user-owned table harus menggunakan RLS.

Aturan utama:

```text
auth.uid() = user_id
```

---

# 107. RLS Permissions

Authenticated user hanya boleh:

```text
SELECT
INSERT
UPDATE
DELETE
```

row miliknya sendiri.

---

# 108. Protected Routes

Protected:

```text
/transactions

/accounts

/recap

/settings
```

Jika belum login:

```text
redirect → /login
```

---

# 109. Login Route

```text
/login
```

Jika user sudah login:

```text
redirect → /transactions
```

---

# 110. Route Structure

```text
/

/login

/transactions

/transactions/:id

/accounts

/accounts/:id

/recap

/settings
```

Root:

```text
/
```

melakukan redirect berdasarkan auth state.

---

# 111. Functional Requirement — Login

### FR-AUTH-001

User dapat login menggunakan akun Google.

### FR-AUTH-002

System membuat session setelah login berhasil.

### FR-AUTH-003

Session tetap aktif setelah refresh.

### FR-AUTH-004

User dapat logout.

### FR-AUTH-005

Protected route tidak dapat dibuka tanpa session.

---

# 112. Functional Requirement — Transactions

### FR-TRX-001
User dapat menambahkan pemasukan.

### FR-TRX-002
User dapat menambahkan pengeluaran.

### FR-TRX-003
User dapat melakukan pindah saldo.

### FR-TRX-004
User dapat melihat riwayat transaksi.

### FR-TRX-005
User dapat filter berdasarkan tanggal.

### FR-TRX-006
User dapat membuka detail transaksi.

### FR-TRX-007
User dapat edit transaksi.

### FR-TRX-008
User dapat delete transaksi.

### FR-TRX-009
User dapat export transaksi.

---

# 113. Functional Requirement — Accounts

### FR-ACC-001
User dapat membuat rekening.

### FR-ACC-002
User dapat melihat rekening.

### FR-ACC-003
User dapat melihat saldo rekening.

### FR-ACC-004
User dapat melihat total saldo.

### FR-ACC-005
User dapat membuka detail rekening.

### FR-ACC-006
User dapat edit rekening.

### FR-ACC-007
User dapat delete rekening sesuai restriction.

---

# 114. Functional Requirement — Recap

### FR-REC-001
User dapat melihat realtime recap.

### FR-REC-002
User dapat melihat monthly recap.

### FR-REC-003
User dapat memilih custom date range.

### FR-REC-004
User dapat melihat total income.

### FR-REC-005
User dapat melihat total expense.

### FR-REC-006
User dapat melihat difference.

### FR-REC-007
User dapat melihat donut chart.

### FR-REC-008
User dapat memilih income atau expense chart.

---

# 115. Functional Requirement — Settings

### FR-SET-001
User dapat melihat informasi akun.

### FR-SET-002
User dapat mengaktifkan reminder.

### FR-SET-003
User dapat mengatur waktu reminder.

### FR-SET-004
User dapat mengganti theme.

### FR-SET-005
User dapat mengganti accent color.

### FR-SET-006
User dapat mengganti bahasa.

### FR-SET-007
User dapat backup data.

### FR-SET-008
User dapat restore data.

### FR-SET-009
User dapat menghapus seluruh data.

### FR-SET-010
User dapat logout.

---

# 116. Non-Functional Requirements

## NFR-001 Performance

Aplikasi harus responsif dan cepat.

## NFR-002 Security

Data pengguna harus terisolasi.

## NFR-003 Responsiveness

UI harus bekerja pada:

- Mobile.
- Tablet.
- Desktop.

## NFR-004 Accessibility

Minimum:

- Keyboard navigation.
- Touch target 44px.
- Visible focus.
- Accessible forms.

## NFR-005 Reliability

Transaksi tidak boleh dianggap berhasil sebelum database mengkonfirmasi penyimpanan.

## NFR-006 Maintainability

Code harus modular dan typed menggunakan TypeScript.

---

# 117. Loading States

Aplikasi menyediakan loading state untuk:

- Authentication.
- Transaction list.
- Account list.
- Recap.
- Export.
- Backup.
- Restore.

Gunakan skeleton jika memungkinkan.

---

# 118. Empty States

Contoh transaksi:

```text
Belum ada transaksi.

Tambahkan transaksi pertamamu.
```

Contoh rekening:

```text
Belum ada rekening.

Tambahkan rekening untuk mulai mencatat keuangan.
```

---

# 119. Error Handling

System harus menangani:

- Network failure.
- Google login failure.
- Invalid amount.
- Account not found.
- Insufficient balance.
- Invalid backup.
- Failed export.
- Database error.

---

# 120. Insufficient Balance

Untuk expense atau transfer:

Jika saldo tidak mencukupi:

Recommended MVP behavior:

**beri warning tetapi tentukan aturan secara konsisten.**

Pilihan yang direkomendasikan:

```text
Saldo rekening tidak mencukupi.
```

Transfer harus diblokir.

Pengeluaran juga disarankan diblokir untuk mencegah saldo negatif.

---

# 121. Amount Validation

Amount harus:

```text
> 0
```

Tidak boleh:

```text
0

negative number

invalid string
```

---

# 122. Date Validation

Transaction date boleh:

- Hari ini.
- Tanggal sebelumnya.

Future transaction tidak masuk MVP.

Jika user memilih tanggal masa depan:

```text
Tanggal transaksi tidak boleh melebihi hari ini.
```

---

# 123. Transfer Validation

Transfer membutuhkan:

```text
Source Account != Destination Account
```

dan:

```text
Amount <= Source Account Balance
```

---

# 124. Backup Versioning

File backup sebaiknya memiliki metadata:

```json
{
  "version": 1,
  "created_at": "...",
  "data": {}
}
```

Supaya restore dapat mendukung perubahan format di masa depan.

---

# 125. Analytics

Untuk MVP, analytics aplikasi tidak wajib.

Jika nanti ditambahkan, jangan mengirim:

- Transaction amount.
- Account names.
- Notes.
- Personal financial data.

Analytics hanya boleh melacak event non-sensitive seperti:

```text
page_opened

transaction_created

export_clicked
```

tanpa payload finansial.

---

# 126. Privacy Requirements

Aplikasi harus menyediakan:

- Privacy Policy.
- Terms of Service.

Login page menyediakan link ke kedua halaman tersebut.

---

# 127. Data Ownership

Setiap user hanya memiliki akses terhadap datanya sendiri.

Data finansial tidak bersifat publik.

Tidak terdapat:

- Public profile.
- Public transaction.
- Social feature.

---

# 128. MVP Scope

## Included

### Authentication
- Google Sign-In.
- Logout.
- Session.

### Transactions
- Income.
- Expense.
- Transfer.
- History.
- Date filter.
- Edit.
- Delete.
- CSV export.

### Accounts
- Add account.
- Account list.
- Account detail.
- Edit.
- Delete restriction.
- Total balance.

### Recap
- Realtime.
- Monthly.
- Custom.
- Donut chart.
- Category breakdown.

### Settings
- Account.
- Reminder.
- Notification.
- Theme.
- Accent.
- Language.
- Backup.
- Restore.
- Delete all data.
- Logout.

### Platform
- Mobile responsive.
- Desktop responsive.
- PWA.

---

# 129. Out of Scope

Tidak dibuat untuk versi pertama:

- Apple Login.
- Manual email/password.
- AI financial assistant.
- Bank API.
- Automatic bank sync.
- QRIS integration.
- OCR receipt scanner.
- Investment portfolio.
- Stock prices.
- Cryptocurrency.
- Budget planner.
- Debt management.
- Saving goals.
- Shared wallet.
- Family account.
- Multi-user finance.
- Subscription detection.
- Advanced financial forecasting.
- Tax calculation.

---

# 130. Future Features

Setelah MVP stabil, dapat dikembangkan:

## Budget

```text
Budget per category
```

## Savings Goal

```text
Target Tabungan
```

## Debt

```text
Hutang
Piutang
```

## Recurring Transaction

```text
Netflix
Internet
Rent
Salary
```

## Advanced Report

```text
Yearly recap
Trend chart
Financial comparison
```

## Search

Search berdasarkan:

```text
Notes
Category
Account
```

---

# 131. Success Metrics

Untuk MVP, keberhasilan produk dapat dilihat dari:

### Activation

User berhasil:

```text
Login
→ Add Account
→ Add First Transaction
```

### Engagement

User kembali mencatat transaksi.

### Core Action Speed

Target:

User dapat mencatat transaksi baru dalam:

```text
< 20 detik
```

setelah memahami interface.

### Reliability

Transaction failure rate harus sangat rendah.

---

# 132. Primary User Journey

```text
Open App
    ↓
Login Google
    ↓
Create First Account
    ↓
Transactions
    ↓
Press +
    ↓
Expense
    ↓
Enter Amount
    ↓
Choose Account
    ↓
Choose Category
    ↓
Save
    ↓
Transaction History Updated
    ↓
Account Balance Updated
    ↓
Recap Updated
```

---

# 133. Secondary Journey — Transfer

```text
Transactions
    ↓
+
    ↓
Pindah Saldo
    ↓
BCA
    ↓
GoPay
    ↓
Rp 500.000
    ↓
Save
    ↓
BCA balance decreases
    ↓
GoPay balance increases
    ↓
Income/Expense recap unchanged
```

---

# 134. Secondary Journey — Recap

```text
Rekap
   ↓
Bulanan
   ↓
Agustus 2026
   ↓
Income
Expense
Difference
   ↓
Donut Chart
   ↓
Category Breakdown
```

---

# 135. Secondary Journey — Backup

```text
Setting
   ↓
Data
   ↓
Backup
   ↓
Generate JSON
   ↓
Download
```

---

# 136. Secondary Journey — Restore

```text
Setting
   ↓
Restore
   ↓
Select JSON
   ↓
Validate
   ↓
Preview
   ↓
Confirm
   ↓
Restore
```

---

# 137. Mobile Navigation Requirement

```text
Transaksi
Rekening
Rekap
Setting
```

Bottom navigation harus:

- Fixed.
- Safe-area aware.
- Tidak menutupi konten.
- Menunjukkan active state.

---

# 138. Desktop Navigation Requirement

Top navbar harus memiliki:

```text
Logo

Transaksi

Rekening

Rekap

Setting

Profile Avatar
```

---

# 139. Primary CTA Requirement

Pada halaman Transaksi:

```text
+ Tambah Transaksi
```

Pada halaman Rekening:

```text
+ Tambah Rekening
```

CTA tidak boleh tersembunyi di menu yang sulit ditemukan.

---

# 140. Accessibility Requirements

- Contrast sesuai kebutuhan readability.
- Input memiliki label.
- Icon-only button memiliki aria-label.
- Keyboard navigation.
- Modal dapat ditutup dengan Escape.
- Chart memiliki textual alternative.
- Tidak bergantung pada warna saja.

---

# 141. Internationalization

Semua text UI harus menggunakan translation key.

Contoh:

```text
transaction.title

transaction.add

account.title

recap.monthly

settings.language
```

Hindari hardcoded string langsung di banyak component.

---

# 142. Currency

MVP hanya membutuhkan:

```text
IDR
```

Display:

```text
Rp 1.500.000
```

Currency option disiapkan dalam data model untuk future expansion.

---

# 143. Date Format

Default Indonesia:

```text
25 Agustus 2026
```

English:

```text
August 25, 2026
```

---

# 144. Timezone

Gunakan timezone lokal pengguna untuk:

- Transaction date.
- Reminder.
- Display date.

Database timestamp tetap dapat disimpan dalam standard UTC.

---

# 145. Development Priority

## Phase 1 — Foundation

- Vite.
- React.
- TypeScript.
- Tailwind.
- Routing.
- Supabase.
- Google Auth.

---

## Phase 2 — Accounts

- Create account.
- Account list.
- Account detail.
- Total balance.

---

## Phase 3 — Transactions

- Income.
- Expense.
- Transfer.
- History.
- Detail.
- Edit.
- Delete.

---

## Phase 4 — Recap

- Realtime.
- Monthly.
- Custom.
- Donut chart.
- Breakdown.

---

## Phase 5 — Settings

- Account.
- Theme.
- Accent.
- Language.
- Reminder.
- Backup.
- Restore.
- Delete data.

---

## Phase 6 — PWA & Performance

- Manifest.
- Icon.
- Installable PWA.
- Lazy loading.
- Bundle optimization.
- Responsive testing.

---

# 146. Testing Requirements

## Authentication

Test:

- Google login.
- Refresh session.
- Logout.
- Protected route.

## Transaction

Test:

- Income calculation.
- Expense calculation.
- Transfer calculation.
- Edit.
- Delete.

## Account

Test:

- Initial balance.
- Current balance.
- Delete restriction.

## Recap

Test:

- Date filters.
- Monthly calculation.
- Category aggregation.

## Backup

Test:

- Backup generation.
- Valid restore.
- Invalid restore.

---

# 147. Critical Financial Test Cases

### Test 1

Initial:

```text
BCA = Rp 1.000.000
```

Expense:

```text
Rp 100.000
```

Expected:

```text
BCA = Rp 900.000
```

---

### Test 2

Initial:

```text
BCA = Rp 900.000
```

Income:

```text
Rp 500.000
```

Expected:

```text
BCA = Rp 1.400.000
```

---

### Test 3

Initial:

```text
BCA = Rp 1.400.000
GoPay = Rp 100.000
```

Transfer:

```text
BCA → GoPay
Rp 400.000
```

Expected:

```text
BCA = Rp 1.000.000

GoPay = Rp 500.000
```

Recap:

```text
Income:
unchanged

Expense:
unchanged
```

---

# 148. Definition of Done — MVP

MVP dianggap selesai jika:

- Google login bekerja.
- User data terisolasi.
- Rekening dapat dibuat.
- Saldo rekening benar.
- Income dapat dicatat.
- Expense dapat dicatat.
- Transfer bekerja dengan benar.
- Riwayat dapat difilter berdasarkan tanggal.
- Transaction dapat edit/delete.
- CSV export bekerja.
- Realtime recap bekerja.
- Monthly recap bekerja.
- Custom recap bekerja.
- Donut chart bekerja.
- Theme dapat diganti.
- Language dapat diganti.
- Reminder dapat diaktifkan.
- Backup dapat dibuat.
- Restore dapat dilakukan.
- Delete all data bekerja.
- Mobile bottom navigation bekerja.
- Desktop top navbar bekerja.
- PWA dapat di-install.
- UI responsif.
- Tidak terdapat critical financial calculation bug.

---

# 149. Final Product Requirement

Produk akhir versi MVP harus memenuhi prinsip berikut:

```text
Fast
Simple
Reliable
Responsive
Secure
Lightweight
```

Pengguna harus dapat membuka aplikasi, melihat saldo, mencatat transaksi, dan kembali menutup aplikasi tanpa harus melewati proses yang kompleks.

Fokus utama bukan jumlah fitur, melainkan:

> Membuat pencatatan keuangan menjadi aktivitas yang cepat, mudah, dan konsisten.

---

**End of PRD.md**