# DESIGN.md — Personal Finance App

## 1. Design Goal

Design a **modern, clean, premium, offline-first personal finance mobile app** for Android and iOS.

The app should help users:
- record income and expenses quickly,
- manage multiple accounts,
- transfer balance between accounts,
- view financial summaries and charts,
- track debts/receivables,
- manage reminders,
- backup and restore local data,
- protect the app with PIN/biometrics,
- customize theme and language.

The visual direction should **not copy an existing finance app exactly**. Use the reference screenshots only as inspiration for information architecture and features. The final UI should feel original, contemporary, polished, and production-ready.

---

## 2. Product Personality

Keywords:
- clean
- calm
- trustworthy
- lightweight
- professional
- friendly
- easy to scan
- not overly decorative
- finance-focused
- fast

Avoid:
- overly playful illustrations,
- excessive gradients,
- glassmorphism everywhere,
- crowded dashboards,
- too many colors,
- excessive animation,
- tiny text,
- dense forms.

---

## 3. Platform

Primary:
- Android
- iOS

Tech target:
- React Native
- Expo
- TypeScript

Design target widths:
- 360 px
- 375 px
- 390 px
- 393 px
- 414 px
- 430 px

All screens must support safe areas, dynamic status bar spacing, and keyboard-safe forms.

---

## 4. Navigation

Use a 5-item bottom tab bar:

1. **Transaksi**
2. **Rekening**
3. **Rekap**
4. **Hutang**
5. **Pengaturan**

Recommended icons:
- Transaksi: `ReceiptText` / `BookOpen`
- Rekening: `WalletCards`
- Rekap: `ChartNoAxesColumnIncreasing`
- Hutang: `HandCoins`
- Pengaturan: `Settings`

### Floating Action Button

A primary FAB appears on:
- Transaksi
- Rekening
- Hutang

On the Transaksi page, pressing the FAB opens a bottom sheet with:
- Pengeluaran
- Pemasukan
- Pindah Saldo

On Rekening:
- Tambah Rekening

On Hutang:
- Saya Meminjam
- Saya Meminjamkan

---

## 5. Visual Direction

### General Style

Use:
- large readable numbers,
- rounded cards,
- clear section hierarchy,
- subtle shadows,
- generous spacing,
- neutral surfaces,
- one primary accent color,
- semantic income/expense colors.

Recommended visual feeling:
> modern banking app + simple expense tracker + polished productivity app

---

## 6. Color System

### Light Theme

```css
--background: #F7F8FA;
--surface: #FFFFFF;
--surface-secondary: #F0F2F5;

--text-primary: #171A1F;
--text-secondary: #6B7280;
--text-tertiary: #9CA3AF;

--border: #E5E7EB;

--primary: #2F80ED;
--primary-hover: #256FD1;
--primary-soft: #EAF3FF;

--income: #14B87A;
--income-soft: #E7F8F1;

--expense: #EF5B5B;
--expense-soft: #FDECEC;

--transfer: #7C6FF2;
--transfer-soft: #F0EEFF;

--warning: #F4A340;
--warning-soft: #FFF3DF;

--danger: #E5484D;
```

### Dark Theme

```css
--background: #0E1116;
--surface: #151A21;
--surface-secondary: #1D232C;

--text-primary: #F7F8FA;
--text-secondary: #A7B0BE;
--text-tertiary: #747E8D;

--border: #2A323D;

--primary: #5BA2FF;
--primary-soft: #152B47;

--income: #48D5A1;
--income-soft: #123B31;

--expense: #FF7777;
--expense-soft: #442222;

--transfer: #9C91FF;
--transfer-soft: #2C2750;

--warning: #FFC267;
--warning-soft: #4A3515;
```

### Rules

- Do not use red for normal UI decoration.
- Red = expense/destructive action.
- Green = income/positive balance.
- Purple/indigo = transfer.
- Orange = warning/due soon.
- Primary blue = navigation, CTA, selected state.

---

## 7. Typography

Recommended font:
- **Inter**
or
- **SF Pro / System font**

### Type Scale

| Style | Size | Weight |
|---|---:|---:|
| Display Balance | 32 | 700 |
| Screen Title | 24 | 700 |
| Section Title | 18 | 700 |
| Card Title | 16 | 600 |
| Body | 15–16 | 400 |
| Label | 13–14 | 500 |
| Caption | 12 | 400 |
| Amount Small | 16 | 700 |
| Amount Large | 24–28 | 700 |

Use tabular numbers where possible for currency values.

---

## 8. Spacing System

Base unit: **4 px**

Recommended:
- 4
- 8
- 12
- 16
- 20
- 24
- 32
- 40

Screen horizontal padding:
- 16 px on 360–390
- 20 px on 414+

Card radius:
- 16 px

Bottom sheet radius:
- 24 px top corners

Button radius:
- 14 px

Input radius:
- 14 px

FAB:
- 56 px diameter
- 64 px if primary high-priority action

---

## 9. Core Components

Create reusable components:

### Navigation
- `AppHeader`
- `BottomTabBar`
- `FloatingActionButton`

### Cards
- `BalanceCard`
- `SummaryCard`
- `AccountCard`
- `TransactionRow`
- `DebtCard`
- `BudgetProgressCard`
- `StatCard`
- `ChartCard`

### Inputs
- `CurrencyInput`
- `TextInput`
- `DatePickerField`
- `AccountPicker`
- `CategoryPicker`
- `SegmentedControl`
- `ToggleRow`
- `SelectRow`

### Overlays
- `BottomSheet`
- `ConfirmDialog`
- `DateRangeSheet`
- `AccountPickerSheet`
- `CategoryPickerSheet`
- `TransactionActionSheet`

### Feedback
- `Toast`
- `EmptyState`
- `Skeleton`
- `InlineError`

---

## 10. Screen Specifications

# 10.1 Transaksi — Main Screen

### Header

Show:
- selected date,
- left/right day navigation,
- calendar icon,
- export icon.

Example:

```text
‹   Kam, 21 Agu 2026   ›      Calendar   Export
```

### Summary Card

Three columns:

- Pemasukan
- Pengeluaran
- Selisih

Example:

```text
Pemasukan       Pengeluaran       Selisih
Rp 5.000.000    Rp 1.250.000      + Rp 3.750.000
```

Use:
- income value in green,
- expense in normal/dark or red accent,
- positive difference in green,
- negative difference in red.

### Transaction List

Group by date if viewing ranges.

Each row:
- category icon,
- title,
- category/account subtitle,
- amount,
- chevron.

Example:

```text
🍔  Makan Siang
    Makanan • BCA                           - Rp 45.000
```

Income example:

```text
💼  Gaji Bulanan
    Pendapatan • BRI                      + Rp 5.000.000
```

Transfer example:

```text
↔  Pindah Saldo
   DANA → BRI                                Rp 500.000
```

Do not count transfers as income or expense.

### FAB Action

Pressing `+` opens a bottom sheet:

```text
Tambah Transaksi

[ Pengeluaran ]
[ Pemasukan   ]
[ Pindah Saldo]
```

Recommended semantic styling:
- Expense: red icon
- Income: green icon
- Transfer: purple icon

---

# 10.2 Add Expense Screen

Fields:

1. Nominal
2. Rekening
3. Kategori
4. Tanggal
5. Catatan (optional)
6. Attachment/receipt (future-ready)
7. Recurring toggle (future-ready)

Layout priority:
- amount input is largest visual element,
- account/category selected using bottom sheets,
- sticky save button at bottom.

CTA:
- `Simpan Pengeluaran`

Validation:
- amount > 0,
- account required,
- category required,
- date required.

---

# 10.3 Add Income Screen

Same structure as expense.

CTA:
- `Simpan Pemasukan`

Default categories:
- Gaji
- Bonus
- Freelance
- Bisnis
- Investasi
- Hadiah
- Refund
- Lainnya

---

# 10.4 Transfer Screen

Fields:
- Dari rekening
- Ke rekening
- Nominal
- Tanggal
- Catatan
- Transfer fee (optional)

Rules:
- source and destination cannot be the same,
- amount > 0,
- transfer does not affect total net worth,
- transfer should create linked ledger records or one transfer entity.

CTA:
- `Pindahkan Saldo`

---

# 10.5 Rekening — Accounts Screen

### Header Summary

Large total balance card:

```text
Total Saldo
Rp 12.850.000
```

Optional:
- show/hide amount icon,
- number of accounts.

### Account List

Each row:
- institution/account icon,
- account name,
- account type,
- current balance,
- chevron.

Examples:
- BCA
- BRI
- Mandiri
- BNI
- BSI
- Bank Aceh
- Jago
- SeaBank
- DANA
- GoPay
- OVO
- ShopeePay
- Uang Tunai
- Custom

Do not hard-code all accounts as mandatory. User can add custom accounts.

### Account Detail

Show:
- account balance,
- total income,
- total expense,
- recent transactions,
- edit account,
- archive/delete account.

Delete flow must warn if transactions exist.

---

# 10.6 Rekap — Report Screen

### Top Segmented Control

Tabs:
- Realtime
- Bulanan
- Tahunan
- Custom

### Summary

Show:
- date range,
- total income,
- total expense,
- net cash flow,
- savings rate.

### Charts

1. Donut chart — expense categories
2. Bar chart — income vs expense
3. Line chart — balance trend
4. Monthly cash-flow chart

Do not overload a single screen. Use sections/cards.

### Category Breakdown

Example:

```text
Makanan & Minuman       35%      Rp 1.250.000
Transportasi            20%      Rp   715.000
Belanja                 18%      Rp   640.000
Tagihan                 15%      Rp   535.000
```

### Empty State

Use a calm illustration/icon and copy:

```text
Belum ada data
Tambahkan transaksi untuk melihat rekap keuanganmu.
```

CTA:
- `Tambah Transaksi`

---

# 10.7 Hutang — Debt Screen

Use two primary tabs:

- **Saya Meminjam**
- **Saya Meminjamkan**

Optional third:
- `Selesai`

### Debt Card

Show:
- person/title,
- original amount,
- remaining amount,
- due date,
- progress,
- status.

Example:

```text
Andi
Saya meminjamkan

Sisa Rp 300.000 dari Rp 500.000
60% belum dibayar

Jatuh tempo 30 Agu 2026
```

Status chips:
- Aktif
- Jatuh Tempo
- Terlambat
- Lunas

### Debt Detail

Show:
- initial amount,
- paid amount,
- remaining amount,
- created date,
- due date,
- notes,
- repayment history.

Actions:
- `Catat Pembayaran`
- `Edit`
- `Tandai Lunas`

---

# 10.8 Pengaturan — Settings Screen

Group settings by sections.

### Akun & Keamanan
- Kunci Aplikasi
- Face ID / Touch ID / Biometrics
- Ubah PIN

### Tampilan
- Light
- Dark
- System
- Accent Color
- Tampilkan angka desimal
- Sembunyikan nominal di halaman utama

### Data
- Backup Data
- Restore Data
- Export CSV
- Export PDF
- Hapus Semua Data

### Notifikasi
- Pengingat Harian
- Pengingat Hutang
- Pengingat Tagihan

### Regional
- Bahasa
- Mata Uang
- Format angka
- Awal minggu

### Tentang
- Versi aplikasi
- Kebijakan privasi
- Lisensi
- Beri rating

Do not show:
- Remove Ads
- Restore Purchase

unless a premium/ads monetization system is actually implemented.

---

## 11. App Lock Screen

When enabled:

```text
[ App Logo ]

Selamat datang kembali

Masukkan PIN
● ● ● ● ● ●

Gunakan Face ID
```

Rules:
- PIN length: 6 digits recommended.
- support biometric unlock.
- after app goes to background for configurable time, lock again.
- sensitive credential material stored using secure storage.

---

## 12. Backup & Restore UX

### Backup

Settings → Data → Backup Data

Show:

```text
Backup Data

Data yang akan disimpan:
• Rekening
• Transaksi
• Kategori
• Hutang
• Pengaturan tertentu

[ Buat Backup ]
```

Output:
- JSON or SQLite export file.

Then show native share sheet.

### Restore

Flow:
1. choose backup file,
2. validate file,
3. show backup metadata,
4. choose:
   - Replace all data
   - Merge data (future)
5. confirm,
6. restore,
7. show success message.

Never silently overwrite user data.

---

## 13. Empty States

Create custom empty states for:
- no transactions,
- no accounts,
- no report data,
- no debts,
- no search results.

Style:
- simple icon/line illustration,
- muted color,
- max two lines of copy,
- one CTA.

---

## 14. Interaction Design

### Buttons

Primary:
- filled blue
- minimum height 48 px

Secondary:
- soft primary background

Danger:
- red only for destructive actions

### Tap Feedback

Use:
- opacity/scale feedback,
- subtle haptic on primary finance actions,
- no exaggerated bounce.

### Animation

Use React Native Reanimated.

Recommended:
- screen transition: 180–250 ms,
- bottom sheet: 220–300 ms,
- card insert: fade + translate 8 px,
- chart animate once on entry,
- FAB expansion: 180–220 ms.

Respect reduce-motion accessibility settings.

---

## 15. Charts

Use:
- minimal grid lines,
- no 3D charts,
- no heavy gradients,
- labels with currency formatting,
- touch tooltip,
- date range filter.

Donut charts:
- max 6 visible categories,
- group remainder into `Lainnya`.

---

## 16. Currency Formatting

Default locale:
- Indonesian

Examples:
- `Rp 10.000`
- `Rp 1.250.000`
- `Rp 12.500.000`

Optional decimal setting:
- off: `Rp 10.000`
- on: `Rp 10.000,00`

Negative:
- `- Rp 45.000`

Positive:
- `+ Rp 5.000.000`

---

## 17. Accessibility

Must support:
- minimum touch target 44×44 px,
- contrast-compliant text,
- screen reader labels,
- dynamic font scaling where possible,
- semantic labels for charts,
- no meaning conveyed by color alone,
- reduce-motion support.

---

## 18. Design Deliverables

Create the following frames:

### Core
1. Splash
2. Onboarding
3. App Lock
4. Transaksi
5. Add Expense
6. Add Income
7. Transfer
8. Transaction Detail
9. Rekening
10. Add Account
11. Account Detail
12. Rekap — Realtime
13. Rekap — Monthly
14. Rekap — Custom
15. Hutang — Borrowed
16. Hutang — Lent
17. Add Debt
18. Debt Detail
19. Settings
20. Backup
21. Restore
22. Reminder Settings
23. Theme Settings
24. Language Settings

### States
25. Empty Transactions
26. Empty Report
27. Empty Debt
28. Error State
29. Delete Confirmation
30. Success Toast

---

## 19. Design Quality Checklist

Before approving any screen:

- [ ] Important financial number is visible immediately.
- [ ] Primary action is obvious.
- [ ] No more than one dominant CTA per screen.
- [ ] Income, expense, and transfer are visually distinct.
- [ ] Bottom navigation remains consistent.
- [ ] Content does not collide with device safe areas.
- [ ] Forms are usable when keyboard is open.
- [ ] All destructive actions require confirmation.
- [ ] Empty/loading/error states exist.
- [ ] Light and dark mode both work.
- [ ] UI looks original and does not directly clone reference screenshots.

---

## 20. Final Design Direction

The final interface should feel like a **2026 personal finance application**, with:
- clean typography,
- strong numeric hierarchy,
- modern rounded cards,
- concise labels,
- subtle motion,
- clear semantic colors,
- excellent one-handed usability,
- offline-first confidence,
- no unnecessary complexity.

The app should look polished enough to be shown as a professional mobile portfolio project.
