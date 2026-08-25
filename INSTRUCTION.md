# INSTRUCTION.md

## 1. Purpose

Dokumen ini berisi instruksi implementasi untuk membangun **Personal Finance Web App** berdasarkan:

- `PRD.md`
- `DESIGN.md`

Gunakan kedua file tersebut sebagai sumber utama kebutuhan produk dan desain.

Jika terdapat konflik:

1. `PRD.md` menentukan kebutuhan fitur dan perilaku produk.
2. `DESIGN.md` menentukan visual, layout, responsivitas, dan pengalaman pengguna.
3. `INSTRUCTION.md` menentukan cara implementasi teknis dan aturan pengerjaan.

Jangan menambahkan fitur baru di luar scope tanpa instruksi tambahan.

---

# 2. Product Objective

Bangun aplikasi pencatatan keuangan pribadi yang:

- Ringan.
- Cepat.
- Mobile-first.
- Responsif.
- Aman.
- Mudah digunakan.
- Memiliki Google Login.
- Mendukung PWA.
- Menggunakan bottom navigation di mobile.
- Menggunakan top navbar di desktop.

Empat menu utama aplikasi:

```text
Transaksi
Rekening
Rekap
Setting
```

Halaman default setelah login:

```text
/transactions
```

---

# 3. Technology Stack

Gunakan stack berikut.

## Frontend

```text
React
Vite
TypeScript
Tailwind CSS
React Router
Lucide React
Recharts
```

## Backend

```text
Supabase
├── Authentication
├── PostgreSQL
└── Row Level Security
```

## Authentication

```text
Google OAuth
```

## Deployment

```text
Vercel
```

## App Experience

```text
Progressive Web App
```

---

# 4. Core Technical Principles

Seluruh implementasi harus mengikuti prinsip berikut.

## 4.1 Lightweight First

Jangan menggunakan dependency besar jika fungsi yang sama dapat dibuat secara sederhana.

Jangan gunakan:

```text
Three.js
GSAP
Framer Motion
React Bits
Material UI
Ant Design
Bootstrap
```

kecuali diminta secara eksplisit.

Gunakan:

- CSS transition.
- Tailwind utility.
- Native browser API.
- Komponen React sederhana.

---

## 4.2 Mobile First

Mulai styling dari mobile.

Kemudian gunakan breakpoint:

```text
md
```

untuk desktop.

Secara umum:

```text
< 768px
Mobile

>= 768px
Desktop
```

---

## 4.3 Component Reusability

Jangan membuat satu file component yang sangat besar.

Pisahkan:

```text
Layout
Navigation
Form
Card
Modal
Bottom Sheet
Transaction Item
Account Item
Chart
Setting Item
```

---

## 4.4 Type Safety

Gunakan TypeScript secara benar.

Hindari:

```ts
any
```

kecuali benar-benar diperlukan.

Buat type/interface untuk:

```text
User
Account
Transaction
Category
UserSettings
Reminder
BackupData
```

---

# 5. Recommended Project Structure

Gunakan struktur:

```text
src/
│
├── assets/
│
├── components/
│   │
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   ├── BottomSheet.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── Toast.tsx
│   │   ├── Skeleton.tsx
│   │   └── EmptyState.tsx
│   │
│   ├── navigation/
│   │   ├── MobileBottomNav.tsx
│   │   └── DesktopNavbar.tsx
│   │
│   ├── transactions/
│   │   ├── TransactionItem.tsx
│   │   ├── TransactionList.tsx
│   │   ├── TransactionForm.tsx
│   │   ├── TransactionTypeSheet.tsx
│   │   ├── TransactionFilter.tsx
│   │   └── TransactionDetail.tsx
│   │
│   ├── accounts/
│   │   ├── AccountCard.tsx
│   │   ├── AccountForm.tsx
│   │   └── AccountSummary.tsx
│   │
│   ├── recap/
│   │   ├── RecapSummary.tsx
│   │   ├── DonutChart.tsx
│   │   └── CategoryBreakdown.tsx
│   │
│   └── settings/
│       ├── AccountSetting.tsx
│       ├── ReminderSetting.tsx
│       ├── ThemeSetting.tsx
│       ├── LanguageSetting.tsx
│       └── DataSetting.tsx
│
├── pages/
│   ├── LoginPage.tsx
│   ├── TransactionsPage.tsx
│   ├── AccountsPage.tsx
│   ├── AccountDetailPage.tsx
│   ├── RecapPage.tsx
│   └── SettingsPage.tsx
│
├── layouts/
│   ├── AppLayout.tsx
│   └── AuthLayout.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── useAccounts.ts
│   ├── useTransactions.ts
│   ├── useSettings.ts
│   └── useReminder.ts
│
├── lib/
│   ├── supabase.ts
│   └── constants.ts
│
├── services/
│   ├── auth.service.ts
│   ├── accounts.service.ts
│   ├── transactions.service.ts
│   ├── recap.service.ts
│   ├── settings.service.ts
│   └── backup.service.ts
│
├── stores/
│   └── optional
│
├── types/
│   ├── account.ts
│   ├── transaction.ts
│   ├── category.ts
│   ├── settings.ts
│   └── backup.ts
│
├── utils/
│   ├── currency.ts
│   ├── date.ts
│   ├── exportCsv.ts
│   ├── backup.ts
│   └── validation.ts
│
├── App.tsx
└── main.tsx
```

Jangan membuat folder atau abstraction yang belum diperlukan.

---

# 6. Routing

Gunakan React Router.

Routes:

```text
/

/login

/transactions

/accounts

/accounts/:id

/recap

/settings
```

Behavior root:

```text
/
```

Jika user login:

```text
redirect → /transactions
```

Jika belum login:

```text
redirect → /login
```

Protected routes:

```text
/transactions
/accounts
/accounts/:id
/recap
/settings
```

---

# 7. Authentication Implementation

Gunakan:

```text
Supabase Auth
Google OAuth
```

Login button:

```text
Continue with Google
```

Jangan membuat:

- Email/password login.
- Register manual.
- Apple Login.

---

# 8. Google Authentication Flow

Implementasikan:

```text
Login Page
   ↓
Continue with Google
   ↓
Supabase OAuth
   ↓
Google
   ↓
Redirect Callback
   ↓
Session Created
   ↓
Check profile
   ↓
Transactions
```

Gunakan Supabase session listener.

Pastikan session tetap tersimpan setelah refresh.

---

# 9. Environment Variables

Gunakan environment variable.

Contoh:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Jangan hardcode secret.

Jangan memasukkan:

```text
service_role key
Google client secret
database password
```

ke frontend.

---

# 10. Supabase Client

Buat satu instance Supabase client saja.

Contoh file:

```text
src/lib/supabase.ts
```

Jangan membuat client berulang kali dalam component.

---

# 11. Database Schema

Gunakan tabel:

```text
profiles
accounts
transactions
categories
user_settings
reminders
```

---

# 12. Profiles Table

Fields:

```text
id UUID PRIMARY KEY

full_name TEXT

email TEXT

avatar_url TEXT

created_at TIMESTAMPTZ

updated_at TIMESTAMPTZ
```

`id` harus sama dengan:

```text
auth.users.id
```

---

# 13. Accounts Table

Fields:

```text
id UUID PRIMARY KEY

user_id UUID NOT NULL

name TEXT NOT NULL

type TEXT NOT NULL

icon TEXT

initial_balance NUMERIC NOT NULL DEFAULT 0

created_at TIMESTAMPTZ

updated_at TIMESTAMPTZ
```

Allowed account types:

```text
bank
cash
ewallet
other
```

---

# 14. Transactions Table

Fields:

```text
id UUID PRIMARY KEY

user_id UUID NOT NULL

type TEXT NOT NULL

account_id UUID NOT NULL

destination_account_id UUID NULL

category_id UUID NULL

amount NUMERIC NOT NULL

transaction_date DATE NOT NULL

notes TEXT NULL

created_at TIMESTAMPTZ

updated_at TIMESTAMPTZ
```

Transaction type:

```text
income
expense
transfer
```

---

# 15. Categories Table

Fields:

```text
id UUID PRIMARY KEY

user_id UUID

name TEXT NOT NULL

type TEXT NOT NULL

icon TEXT

is_default BOOLEAN DEFAULT false

created_at TIMESTAMPTZ
```

Category types:

```text
income
expense
```

---

# 16. User Settings Table

Fields:

```text
id UUID PRIMARY KEY

user_id UUID UNIQUE NOT NULL

language TEXT DEFAULT 'id'

theme TEXT DEFAULT 'system'

accent_color TEXT DEFAULT 'blue'

currency TEXT DEFAULT 'IDR'

created_at TIMESTAMPTZ

updated_at TIMESTAMPTZ
```

---

# 17. Reminders Table

Fields:

```text
id UUID PRIMARY KEY

user_id UUID UNIQUE NOT NULL

enabled BOOLEAN DEFAULT false

time TIME

created_at TIMESTAMPTZ

updated_at TIMESTAMPTZ
```

---

# 18. Foreign Keys

Gunakan foreign key.

Contoh:

```text
accounts.user_id
→ auth.users.id

transactions.user_id
→ auth.users.id

transactions.account_id
→ accounts.id

transactions.destination_account_id
→ accounts.id

transactions.category_id
→ categories.id
```

Gunakan delete behavior secara hati-hati.

Jangan membuat cascading delete yang dapat menghapus histori transaksi secara tidak sengaja.

---

# 19. Row Level Security

Aktifkan RLS pada semua tabel user-owned.

Wajib:

```text
profiles
accounts
transactions
categories
user_settings
reminders
```

User hanya boleh membaca data miliknya.

Rule utama:

```text
auth.uid() = user_id
```

Untuk `profiles`:

```text
auth.uid() = id
```

---

# 20. Security Requirement

Jangan pernah menggunakan filtering frontend sebagai pengganti RLS.

Contoh tidak aman:

```text
fetch all transactions
→ filter by user_id in React
```

Ini tidak boleh dilakukan.

Filtering harus dilakukan di database.

---

# 21. Profile Creation

Saat user login pertama kali:

Jika profile belum tersedia:

buat profile berdasarkan metadata Google:

```text
id
full_name
email
avatar_url
```

Jika sudah ada:

jangan membuat profile baru.

---

# 22. Default User Settings

Pada first login buat:

```text
language = id
theme = system
accent_color = blue
currency = IDR
```

---

# 23. Default Categories

Pada first login buat kategori default.

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
Freelance
Bonus
Hadiah
Investasi
Lainnya
```

Pastikan kategori default tidak dibuat berkali-kali.

---

# 24. First Login Onboarding

Jika user belum memiliki rekening:

Tampilkan onboarding sederhana.

Flow:

```text
Welcome
   ↓
Tambah Rekening Pertama
   ↓
Masukkan Saldo Awal
   ↓
Save
   ↓
Transactions
```

Jangan buat onboarding panjang.

---

# 25. Navigation — Mobile

Mobile:

```text
< 768px
```

Gunakan fixed bottom navigation.

Items:

```text
Transaksi

Rekening

Rekap

Setting
```

Gunakan Lucide icons.

Suggested:

```text
ArrowLeftRight
WalletCards
ChartPie
Settings
```

Bottom navigation harus:

- Fixed.
- Selalu terlihat.
- Mendukung safe area.
- Tidak menutupi konten.

---

# 26. Mobile Safe Area

Gunakan:

```css
padding-bottom: env(safe-area-inset-bottom);
```

Content juga harus memiliki bottom spacing agar tidak tertutup navigation.

---

# 27. Navigation — Desktop

Desktop:

```text
>= 768px
```

Gunakan top navbar.

Struktur:

```text
Logo

Transaksi
Rekening
Rekap
Setting

Avatar
```

Navbar:

```text
sticky top-0
```

---

# 28. Responsive Requirement

Jangan hanya mengecilkan desktop layout pada mobile.

Mobile dan desktop harus memiliki layout yang sesuai perangkat.

Contoh:

Desktop:

```text
3 cards horizontal
```

Mobile:

```text
stacked cards
```

---

# 29. Page — Transactions

Halaman Transaksi adalah halaman utama.

Tampilkan:

```text
Title

Saldo total

Date filter

Export

Transaction History

Add Transaction
```

---

# 30. Total Balance

Formula:

```text
SUM semua saldo rekening
```

Saldo rekening dihitung berdasarkan transaksi.

Jangan memperlakukan transfer sebagai income atau expense.

---

# 31. Add Transaction Button

Mobile:

Gunakan Floating Action Button:

```text
+
```

Posisi:

```text
bottom di atas bottom navigation
right
```

Desktop:

Gunakan:

```text
+ Tambah Transaksi
```

pada header halaman.

---

# 32. Add Transaction Action

Ketika button ditekan:

Mobile:

```text
Bottom Sheet
```

Desktop:

```text
Modal
```

Pilihan:

```text
Pengeluaran
Pemasukan
Pindah Saldo
```

---

# 33. Expense Form

Fields:

```text
Jumlah
Rekening
Kategori
Tanggal
Catatan
```

Required:

```text
amount
account
category
date
```

Optional:

```text
notes
```

---

# 34. Income Form

Fields:

```text
Jumlah
Rekening
Kategori
Tanggal
Catatan
```

---

# 35. Transfer Form

Fields:

```text
Rekening Asal

Rekening Tujuan

Jumlah

Tanggal

Catatan
```

Rules:

```text
Source != Destination
```

dan:

```text
Amount <= Source Balance
```

---

# 36. Transaction Amount Input

Input harus mendukung format mata uang IDR.

User dapat mengetik:

```text
50000
```

Display dapat menjadi:

```text
50.000
```

Stored value:

```text
50000
```

Jangan menyimpan string:

```text
"Rp 50.000"
```

ke database.

---

# 37. Transaction Validation

Amount:

```text
> 0
```

Date:

```text
<= today
```

Source account:

harus tersedia.

Transfer:

destination wajib.

---

# 38. Account Balance Logic

Gunakan formula:

```text
Current Balance =
Initial Balance
+ Income
- Expense
+ Incoming Transfer
- Outgoing Transfer
```

Jangan memperbarui current balance secara manual setiap transaksi jika tidak diperlukan.

Hitung dari source of truth transaksi.

---

# 39. Transfer Logic

Contoh:

```text
BCA → GoPay
Rp 500.000
```

Efek:

```text
BCA:
-500.000

GoPay:
+500.000
```

Rekap:

```text
Income unchanged

Expense unchanged
```

---

# 40. Transaction History

Transaction history harus:

- Sort terbaru ke terlama.
- Group berdasarkan tanggal.
- Pagination.
- Filter berdasarkan tanggal.

Default:

```text
20 transactions
```

per request.

---

# 41. Transaction List Item

Tampilkan:

```text
Icon

Nama / Catatan

Kategori

Rekening

Jumlah
```

Example:

```text
Makan Siang
Makanan • BCA
- Rp 45.000
```

Transfer:

```text
BCA → GoPay
Pindah Saldo
Rp 500.000
```

---

# 42. Transaction Colors

Income:

```text
Success
+
```

Expense:

```text
Danger
-
```

Transfer:

```text
Neutral / Primary
⇄
```

Jangan hanya menggunakan warna.

---

# 43. Date Filter

Sediakan:

```text
Hari Ini

Kemarin

7 Hari Terakhir

Bulan Ini

Pilih Tanggal

Custom Range
```

Filter harus diterapkan langsung pada query database.

Jangan mengambil semua data lalu memfilter di client.

---

# 44. Transaction Detail

Saat transaksi dipilih:

Tampilkan:

```text
Type

Amount

Account

Destination Account jika transfer

Category

Date

Notes

Edit

Delete
```

Mobile:

gunakan full screen sheet atau modal responsif.

Desktop:

modal atau detail panel.

---

# 45. Edit Transaction

Saat transaksi diedit:

Update data transaksi.

Saldo rekening harus otomatis mengikuti perhitungan terbaru.

Jangan membuat adjustment tersembunyi.

---

# 46. Delete Transaction

Gunakan confirmation dialog.

Setelah delete berhasil:

- Refresh transaction list.
- Refresh account balances.
- Refresh recap.

---

# 47. CSV Export

Export berada di halaman Transaksi.

MVP:

```text
CSV
```

Export mengikuti filter tanggal aktif.

Columns:

```text
Date

Type

Account

Destination Account

Category

Amount

Notes
```

Gunakan UTF-8.

Pastikan file aman dibuka di Excel/Google Sheets.

---

# 48. Page — Accounts

Tampilkan:

```text
Total Saldo

Account List

+ Tambah Rekening
```

Account card:

```text
Name
Type
Balance
Icon
```

---

# 49. Add Account

Fields:

```text
Nama Rekening

Jenis Rekening

Saldo Awal

Icon
```

Required:

```text
Name
Type
Initial Balance
```

Initial balance boleh:

```text
0
```

---

# 50. Account Types

Supported:

```text
Bank

Cash

E-Wallet

Other
```

Stored values:

```text
bank
cash
ewallet
other
```

---

# 51. Account Detail

Tampilkan:

```text
Account Name

Current Balance

Monthly Income

Monthly Expense

Transaction History
```

Action:

```text
Edit

Delete
```

---

# 52. Delete Account

Untuk MVP:

Jangan izinkan delete rekening jika rekening memiliki transaksi.

Tampilkan:

```text
Rekening ini masih memiliki transaksi.
Hapus atau pindahkan transaksi terlebih dahulu.
```

---

# 53. Page — Recap

Halaman Rekap memiliki mode:

```text
Realtime

Bulanan

Custom
```

Gunakan segmented control.

---

# 54. Realtime Definition

Realtime berarti data terbaru sesuai transaksi yang tersimpan.

Bukan live websocket wajib.

Tidak perlu Supabase Realtime subscription kecuali benar-benar dibutuhkan.

Refresh setelah mutation sudah cukup untuk MVP.

---

# 55. Monthly Recap

User dapat memilih:

```text
Month
Year
```

Default:

bulan saat ini.

---

# 56. Custom Recap

Fields:

```text
Start Date

End Date
```

Validation:

```text
Start <= End
```

---

# 57. Recap Calculations

Income:

```text
SUM(type = income)
```

Expense:

```text
SUM(type = expense)
```

Difference:

```text
Income - Expense
```

Transfer tidak ikut.

---

# 58. Donut Chart

Gunakan:

```text
Recharts
```

Hanya load Recharts di halaman Rekap.

Gunakan lazy import jika memungkinkan.

Donut chart harus support:

```text
Pengeluaran

Pemasukan
```

---

# 59. Donut Data

Aggregate berdasarkan kategori.

Example:

```text
Makanan 35%
Transportasi 20%
Belanja 18%
```

Di tengah chart tampil:

```text
Total
```

---

# 60. Chart Accessibility

Donut chart harus memiliki textual breakdown di bawahnya.

Jangan membuat data hanya tersedia melalui visual chart.

---

# 61. Page — Settings

Sections:

```text
Akun

Pengingat

Tampilan

Bahasa

Data

Danger Zone
```

---

# 62. Account Setting

Tampilkan:

```text
Google Avatar

Name

Email

Provider: Google
```

Action:

```text
Logout
```

---

# 63. Reminder

Feature:

```text
Pengingat Harian
```

Fields:

```text
Enabled

Time
```

Jangan meminta notification permission saat login.

Permission hanya diminta ketika user mengaktifkan reminder.

---

# 64. Reminder Limitations

Web notification memiliki keterbatasan platform.

Implementasikan dengan Progressive Web App dan Notification API secara aman.

Jika browser tidak mendukung:

tampilkan informasi:

```text
Notifikasi tidak didukung pada perangkat ini.
```

Jangan membuat aplikasi error.

---

# 65. Theme

Modes:

```text
system
light
dark
```

Default:

```text
system
```

Simpan ke:

```text
user_settings
```

---

# 66. Accent Color

Preset:

```text
blue

green

purple

orange

red
```

Gunakan CSS variables.

Jangan membuat CSS terpisah untuk setiap theme jika dapat menggunakan variable.

---

# 67. Language

MVP:

```text
id
en
```

Default:

```text
id
```

Semua label UI harus menggunakan translation key.

Jangan hardcode UI string di banyak component.

---

# 68. i18n Structure

Contoh:

```text
src/locales/

├── id.ts
└── en.ts
```

Contoh key:

```text
transaction.title
transaction.add
transaction.income
transaction.expense

account.title

recap.title

settings.title
```

Tidak wajib menggunakan library i18n berat.

Sistem object sederhana diperbolehkan.

---

# 69. Backup

Backup menghasilkan:

```text
JSON
```

Isi:

```text
metadata

accounts

transactions

categories

settings

reminders
```

---

# 70. Backup Metadata

Format:

```json
{
  "version": 1,
  "created_at": "",
  "app": "finance-web-app"
}
```

---

# 71. Backup Security

Jangan backup:

```text
Supabase token

OAuth token

Google token

Password

Secret
```

---

# 72. Restore

Restore flow:

```text
Select JSON
   ↓
Validate
   ↓
Read Metadata
   ↓
Preview
   ↓
Confirmation
   ↓
Restore
```

Jika file invalid:

jangan mengubah data existing.

---

# 73. Restore Validation

Validate:

```text
version

required fields

data type

ownership-independent format
```

Semua restored row harus menggunakan:

```text
current authenticated user_id
```

Jangan mempercayai `user_id` dari backup file.

---

# 74. Delete All Data

Action berada di:

```text
Setting → Danger Zone
```

Require user mengetik:

```text
HAPUS
```

Delete:

```text
transactions
accounts
custom categories
settings-related finance data
```

Jangan delete:

```text
Google Account
Supabase Auth User
```

Setelah selesai:

buat ulang default settings dan default categories jika diperlukan.

---

# 75. PWA

Tambahkan:

```text
manifest
icons
standalone display
theme color
```

App harus dapat di-install ke home screen.

---

# 76. PWA Display

Gunakan:

```json
"display": "standalone"
```

Aplikasi pada mobile harus terasa seperti web app.

---

# 77. Offline Behavior

MVP tidak perlu full offline database sync.

Cache:

```text
HTML shell
CSS
JS
icons
static assets
```

Jika action membutuhkan internet dan user offline:

tampilkan error.

Jangan menampilkan success sebelum Supabase mengkonfirmasi.

---

# 78. Loading State

Gunakan skeleton untuk:

```text
Transactions

Accounts

Recap
```

Gunakan button loading untuk mutation.

Example:

```text
Menyimpan...
```

Disable button saat request berjalan.

---

# 79. Toast

Gunakan toast sederhana.

Examples:

```text
Transaksi berhasil ditambahkan.

Transaksi berhasil dihapus.

Rekening berhasil dibuat.

Data berhasil dipulihkan.
```

Jangan menggunakan notification library besar jika tidak diperlukan.

---

# 80. Error Handling

Tangani:

```text
No connection

Authentication error

Database error

Invalid form

Insufficient balance

Invalid backup

CSV export error

Notification permission denied
```

Error message harus dapat dipahami user.

Jangan tampilkan raw database error kepada user.

---

# 81. Form Rules

Setiap form harus memiliki:

- Label.
- Input.
- Error message.
- Loading state.
- Disabled state.
- Submit handling.

Jangan menggunakan placeholder sebagai pengganti label.

---

# 82. Confirmation Dialog

Wajib untuk:

```text
Delete Transaction

Delete Account

Delete All Data

Restore overwrite
```

---

# 83. Accessibility

Minimum:

```text
44px touch targets

Visible focus

Keyboard accessible

aria-label for icon buttons

Form labels

Good contrast
```

Modal harus dapat ditutup dengan:

```text
Escape
```

desktop.

---

# 84. Typography

Gunakan:

```text
Inter
```

Fallback:

```text
system-ui
-apple-system
Segoe UI
sans-serif
```

Jika menggunakan Google Font, hindari blocking load.

Self-host atau gunakan system fallback jika ingin lebih ringan.

---

# 85. Currency Formatting

Gunakan helper:

```ts
formatCurrency()
```

Dengan:

```text
Intl.NumberFormat
```

Default:

```text
id-ID
IDR
```

Display:

```text
Rp 1.500.000
```

---

# 86. Date Formatting

Gunakan helper.

Indonesia:

```text
25 Agustus 2026
```

English:

```text
August 25, 2026
```

Gunakan locale berdasarkan setting.

---

# 87. Timezone

Database timestamps:

```text
UTC
```

Display:

timezone lokal user.

Transaction date menggunakan:

```text
DATE
```

bukan timestamp jika hanya memerlukan tanggal.

---

# 88. Performance

Target:

```text
Lighthouse Performance > 90
```

jika memungkinkan.

Optimasi:

```text
Route lazy loading

Chart lazy loading

Pagination

Minimal dependencies

No large images

Tree-shakable icons
```

---

# 89. React Performance

Jangan menggunakan:

```text
useMemo
useCallback
React.memo
```

secara berlebihan.

Gunakan hanya ketika benar-benar diperlukan.

Fokus pada:

- Query efisien.
- Component sederhana.
- Pagination.

---

# 90. Query Rules

Jangan:

```text
SELECT *
```

jika field yang dibutuhkan sedikit.

Pilih field yang diperlukan.

Filter:

```text
user ownership
date range
transaction type
```

di database.

---

# 91. Database Indexes

Pertimbangkan index:

```text
transactions(user_id)

transactions(user_id, transaction_date)

transactions(account_id)

transactions(category_id)

accounts(user_id)
```

Supaya query tetap cepat ketika data bertambah.

---

# 92. Pagination

Gunakan Supabase:

```text
range()
```

atau strategi pagination yang sesuai.

Default:

```text
20 records
```

---

# 93. Avoid Premature Complexity

Jangan membuat:

```text
Redux
GraphQL
Custom backend Express
Microservices
Event bus
Complex state machine
```

untuk MVP.

Gunakan React state/context/hooks terlebih dahulu.

---

# 94. State Management

Gunakan:

```text
React state
Context
Custom hooks
```

Jika kebutuhan global state tumbuh signifikan, baru pertimbangkan Zustand.

Jangan langsung menambahkan Zustand jika tidak dibutuhkan.

---

# 95. API Layer

Jangan melakukan query Supabase langsung dari seluruh komponen.

Gunakan service layer.

Example:

```text
transactions.service.ts
```

functions:

```text
getTransactions()

createTransaction()

updateTransaction()

deleteTransaction()

getTransactionById()
```

---

# 96. Business Logic

Business logic harus ditempatkan di:

```text
service
hook
utility
```

bukan tersebar di JSX.

---

# 97. Testing Critical Logic

Prioritaskan test untuk:

```text
Balance calculation

Income

Expense

Transfer

Edit transaction

Delete transaction

Recap calculation

Backup validation
```

---

# 98. Critical Test Example

Initial:

```text
BCA = Rp1.000.000
```

Expense:

```text
Rp100.000
```

Expected:

```text
Rp900.000
```

---

# 99. Transfer Test

Initial:

```text
BCA = Rp1.000.000
GoPay = Rp100.000
```

Transfer:

```text
Rp400.000
```

Expected:

```text
BCA = Rp600.000
GoPay = Rp500.000
```

Income:

```text
unchanged
```

Expense:

```text
unchanged
```

---

# 100. Recap Test

Transactions:

```text
Income Rp5.000.000

Expense Rp1.000.000

Transfer Rp500.000
```

Expected:

```text
Income Rp5.000.000

Expense Rp1.000.000

Difference Rp4.000.000
```

Transfer tidak masuk recap.

---

# 101. Visual Rules

Gunakan desain:

```text
Clean
Modern
Professional
Simple
Trustworthy
```

Hindari:

```text
Glassmorphism berlebihan

Neon

3D

AI-looking gradient

Huge rounded cards

Unnecessary animation
```

---

# 102. Card Design

Gunakan:

```text
simple border
subtle shadow optional
moderate radius
```

Radius:

```text
12px - 16px
```

Jangan semua elemen dibuat pill.

---

# 103. Spacing

Gunakan 4px spacing system.

Allowed:

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

---

# 104. Button Design

Primary:

```text
solid accent
```

Secondary:

```text
border / muted
```

Danger:

```text
danger semantic
```

Minimum height:

```text
44px
```

---

# 105. Mobile Transaction Layout

Target:

```text
Header

Total Balance

Date Filter

Riwayat

Floating +

Bottom Navigation
```

Bottom bar tidak boleh tertutup modal atau content.

---

# 106. Desktop Transaction Layout

Target:

```text
Top Navbar

Page Header
├── Title
├── Filter
├── Export
└── Add Transaction

Balance Summary

Transaction List
```

---

# 107. Mobile Bottom Sheet

Use for:

```text
Transaction type

Account selector

Category selector

Date selector
```

Bottom sheet harus:

- Smooth.
- Simple.
- Dismissible.
- Accessible.

---

# 108. Desktop Modal

Recommended max width:

```text
480px - 560px
```

Jangan menggunakan fullscreen modal kecuali dibutuhkan.

---

# 109. Empty States

Transactions:

```text
Belum ada transaksi.

Tambahkan transaksi pertamamu.
```

Accounts:

```text
Belum ada rekening.

Tambahkan rekening untuk mulai mencatat keuangan.
```

Recap:

```text
Belum ada data untuk periode ini.
```

---

# 110. Avatar

Gunakan avatar Google dari Supabase user metadata.

Jika tidak tersedia:

gunakan initials.

Jangan crash jika image URL gagal.

---

# 111. Logout

Flow:

```text
Setting
→ Logout
→ supabase.auth.signOut()
→ /login
```

Clear app-specific local cache jika diperlukan.

Jangan delete database data.

---

# 112. Sensitive Data

Jangan:

- Log transaction amount ke analytics.
- Log financial notes.
- Log token.
- Expose database credentials.
- Store auth token di custom plaintext storage.

Gunakan session management Supabase.

---

# 113. Analytics

Analytics tidak wajib untuk MVP.

Jika ditambahkan nanti, hanya event non-sensitive.

Allowed:

```text
page_opened

transaction_form_opened

transaction_created
```

Tidak boleh menyertakan:

```text
amount

account name

notes
```

---

# 114. Privacy Pages

Sediakan route sederhana:

```text
/privacy

/terms
```

Login page dapat menautkan keduanya.

Isi lengkap dapat dibuat belakangan, tetapi route dan placeholder yang layak boleh disiapkan.

---

# 115. Dependency Policy

Sebelum install dependency:

Tanyakan secara internal:

```text
Apakah bisa dibuat dengan React / browser API / Tailwind?
```

Jika iya:

jangan install library baru.

---

# 116. Do Not Overengineer

Project ini adalah MVP.

Prioritas:

```text
Correctness
Usability
Security
Performance
Maintainability
```

Bukan:

```text
Architecture complexity
Animation
Fancy infrastructure
```

---

# 117. Implementation Order

Kerjakan dalam urutan berikut.

## Phase 1

```text
Project setup

Tailwind

React Router

Base UI

Responsive AppLayout
```

---

## Phase 2

```text
Supabase setup

Google OAuth

Protected routes

Session handling

Profile creation
```

---

## Phase 3

```text
Database schema

RLS

Default categories

User settings
```

---

## Phase 4

```text
Accounts

Add Account

Account List

Account Detail

Balance calculation
```

---

## Phase 5

```text
Transactions

Income

Expense

Transfer

History

Date filter

Edit

Delete
```

---

## Phase 6

```text
CSV export
```

---

## Phase 7

```text
Recap

Realtime

Monthly

Custom date

Donut chart

Category breakdown
```

---

## Phase 8

```text
Settings

Theme

Accent

Language

Reminder

Account
```

---

## Phase 9

```text
Backup

Restore

Delete All Data
```

---

## Phase 10

```text
PWA

Performance optimization

Accessibility

Responsive QA
```

---

# 118. Do Not Skip RLS

Sebelum aplikasi dianggap selesai:

RLS harus aktif dan sudah diuji dengan setidaknya dua akun user.

Test:

```text
User A tidak bisa melihat data User B.

User B tidak bisa mengubah data User A.
```

---

# 119. Supabase Migration

Simpan schema database dalam migration atau SQL file.

Contoh:

```text
supabase/
└── migrations/
```

Jangan hanya membuat tabel manual tanpa dokumentasi.

---

# 120. SQL Requirements

SQL harus mencakup:

```text
Tables

Constraints

Foreign keys

Indexes

RLS

Policies
```

---

# 121. Environment Setup Documentation

Buat:

```text
.env.example
```

Isi:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Jangan commit:

```text
.env
```

---

# 122. Gitignore

Pastikan:

```text
.env

node_modules

dist
```

tidak masuk repository.

---

# 123. README Requirement

Buat README singkat dengan:

```text
Project description

Tech stack

Installation

Environment setup

Run development

Build

Supabase setup

Google OAuth setup

Deploy
```

---

# 124. Development Commands

Harus tersedia:

```bash
npm install
npm run dev
npm run build
npm run preview
```

Jika menggunakan lint:

```bash
npm run lint
```

---

# 125. Build Requirement

Sebelum final:

```bash
npm run build
```

harus berhasil tanpa error.

TypeScript tidak boleh memiliki critical type error.

---

# 126. Console Requirement

Jangan tinggalkan:

```text
console.log
debugger
```

yang tidak diperlukan.

Error logging teknis boleh digunakan secara terkontrol.

---

# 127. Code Style

Gunakan:

- Descriptive naming.
- Small functions.
- Early return.
- Minimal nesting.
- No duplicate logic.
- Reusable utility.

---

# 128. Naming Convention

Components:

```text
PascalCase
```

Example:

```text
TransactionItem.tsx
```

Functions:

```text
camelCase
```

Example:

```text
createTransaction()
```

Constants:

```text
UPPER_SNAKE_CASE
```

jika benar-benar constant global.

---

# 129. File Size Guidance

Usahakan component utama tetap mudah dibaca.

Jika satu file mulai memiliki:

- Banyak subcomponent.
- Banyak business logic.
- Banyak form logic.

Pisahkan.

Tidak perlu mengikuti batas line yang kaku.

---

# 130. Comments

Jangan memberi komentar untuk kode yang sudah jelas.

Gunakan comments hanya untuk:

- Business rule penting.
- Workaround.
- Security consideration.
- Complex calculation.

---

# 131. Transaction Business Rule Comments

Business rule yang sebaiknya jelas:

```text
Transfer is excluded from income and expense recap.
```

dan:

```text
Initial balance is not treated as income.
```

---

# 132. Data Integrity

Gunakan database constraints jika memungkinkan.

Contoh:

```text
amount > 0
```

Transaction type hanya:

```text
income
expense
transfer
```

Account type hanya:

```text
bank
cash
ewallet
other
```

---

# 133. Delete Safety

Hindari accidental destructive actions.

Gunakan confirmation.

Delete All Data harus memerlukan:

```text
HAPUS
```

---

# 134. Restore Safety

Restore tidak boleh langsung berjalan setelah file dipilih.

Harus ada:

```text
Validation

Preview

Confirmation
```

---

# 135. Network Mutation

Untuk:

```text
Create
Update
Delete
Restore
```

button harus disabled saat request berlangsung.

Jangan memungkinkan double-submit.

---

# 136. Optimistic UI

Jangan gunakan optimistic update untuk critical financial mutations pada MVP.

Tunggu database mengkonfirmasi.

Kemudian update UI.

Ini mengurangi risiko tampilan saldo sementara yang salah.

---

# 137. Data Refresh

Setelah mutation berhasil:

refresh hanya data terkait.

Contoh create expense:

```text
Transactions

Account balances

Recap
```

Jangan reload seluruh browser page.

---

# 138. Error Rollback

Jika mutation gagal:

- UI tetap menampilkan data lama.
- Tampilkan toast error.
- Jangan mengubah saldo lokal secara permanen.

---

# 139. Number Precision

Untuk IDR, tidak perlu decimal.

Gunakan integer-like numeric value.

Jangan menggunakan floating point untuk perhitungan uang jika dapat dihindari.

---

# 140. Currency Future Proofing

MVP hanya IDR.

Namun helper currency harus menerima:

```text
currency
locale
```

supaya bisa dikembangkan nanti.

---

# 141. Future Features

Jangan implementasikan sekarang:

```text
Budget

Savings Goals

Debt

Investment

Bank Sync

OCR Receipt

AI Assistant

Family Wallet

Subscription Tracker
```

Hanya siapkan struktur yang mudah dikembangkan.

---

# 142. Avoid Fake Data in Production

Mock data hanya boleh digunakan untuk development awal.

Setelah Supabase aktif:

hapus fake transaction yang tampil sebagai data user.

Empty state harus benar-benar empty jika user belum punya data.

---

# 143. Responsive QA

Test minimum width:

```text
360px

375px

390px

430px

768px

1024px

1280px

1440px
```

Pastikan:

- Tidak horizontal scroll.
- Bottom navigation tidak overlap.
- Modal tidak keluar viewport.
- Chart tidak terpotong.
- Amount tetap readable.

---

# 144. Browser Testing

Minimum:

```text
Chrome

Edge

Safari mobile
```

Jika memungkinkan:

```text
Firefox
```

---

# 145. PWA Mobile Testing

Test:

```text
Install to Home Screen

Launch standalone

Bottom navigation

Safe area

Theme color

Reload
```

---

# 146. Final Verification Checklist

Sebelum project dianggap selesai, verifikasi:

- [ ] Google Login bekerja.
- [ ] Session bertahan setelah refresh.
- [ ] Logout bekerja.
- [ ] Protected routes aman.
- [ ] User A tidak dapat melihat data User B.
- [ ] User dapat menambahkan rekening.
- [ ] Saldo awal benar.
- [ ] Income menambah saldo.
- [ ] Expense mengurangi saldo.
- [ ] Transfer mengurangi source.
- [ ] Transfer menambah destination.
- [ ] Transfer tidak masuk income.
- [ ] Transfer tidak masuk expense.
- [ ] Riwayat transaksi bekerja.
- [ ] Filter tanggal bekerja.
- [ ] Edit transaksi bekerja.
- [ ] Delete transaksi bekerja.
- [ ] CSV export bekerja.
- [ ] Total saldo benar.
- [ ] Rekap realtime benar.
- [ ] Rekap bulanan benar.
- [ ] Rekap custom benar.
- [ ] Donut chart benar.
- [ ] Theme bekerja.
- [ ] Accent color bekerja.
- [ ] Bahasa Indonesia bekerja.
- [ ] English bekerja.
- [ ] Reminder setting bekerja.
- [ ] Backup bekerja.
- [ ] Restore valid bekerja.
- [ ] Restore invalid tidak merusak data.
- [ ] Delete all data bekerja.
- [ ] Mobile bottom navbar bekerja.
- [ ] Desktop top navbar bekerja.
- [ ] PWA dapat di-install.
- [ ] Build berhasil.
- [ ] Tidak ada critical console error.

---

# 147. Definition of Done

Project dianggap selesai ketika:

1. Seluruh MVP pada `PRD.md` telah berfungsi.
2. Tampilan mengikuti `DESIGN.md`.
3. Seluruh aturan pada `INSTRUCTION.md` dipenuhi.
4. Tidak ada critical financial calculation bug.
5. Authentication dan RLS sudah diuji.
6. Mobile dan desktop responsif.
7. Build production berhasil.
8. Website dapat dideploy ke Vercel.
9. Tidak ada secret yang terekspos.
10. User dapat menjalankan alur utama tanpa error.

Alur utama:

```text
Login Google
   ↓
Tambah Rekening
   ↓
Tambah Pengeluaran / Pemasukan
   ↓
Lihat Riwayat
   ↓
Lihat Rekap
   ↓
Backup Data
```

---

# 148. Final Instruction to Development Agent

Bangun aplikasi berdasarkan ketiga dokumen:

```text
PRD.md
DESIGN.md
INSTRUCTION.md
```

Prioritaskan:

```text
Correctness
Security
Performance
Usability
Maintainability
```

Jangan menambahkan fitur yang tidak diminta.

Jangan mengganti stack utama tanpa alasan teknis yang kuat.

Jangan mengorbankan performa demi visual.

Jangan mengorbankan integritas data demi implementasi yang lebih cepat.

Jika terdapat pilihan antara implementasi kompleks dan sederhana dengan hasil yang sama:

> Pilih implementasi yang lebih sederhana, aman, dan mudah dipelihara.

Aplikasi akhir harus terasa seperti **mobile finance app saat digunakan di smartphone** dan seperti **clean finance dashboard saat digunakan di desktop**, dengan pengalaman yang cepat, ringan, dan konsisten.

---

**End of INSTRUCTION.md**