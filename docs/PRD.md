# PRD — Offline Personal Finance App

## 1. Product Overview

### Product Type
Offline-first personal finance management mobile application.

### Platforms
- Android
- iOS

### Development Stack
- React Native
- Expo
- TypeScript
- Expo Router
- `expo-sqlite`
- Expo SecureStore
- Expo Local Authentication
- Expo Notifications
- Expo FileSystem / Sharing
- React Native Reanimated
- chart library compatible with React Native

### Data Architecture
**Local-only by default.**

No Supabase, Firebase, PostgreSQL server, VPS, or external backend is required for the core product.

Primary data is stored locally on the user's device using SQLite.

---

## 2. Product Vision

Provide a fast, private, simple, and complete personal finance manager that works fully offline and allows users to understand where their money goes without requiring an account or internet connection.

The product should combine:
- daily expense tracking,
- multiple account management,
- transfer tracking,
- financial reporting,
- debt/receivable management,
- reminders,
- secure local storage,
- manual backup/restore.

---

## 3. Goals

### Primary Goals

1. Allow users to record daily financial transactions in seconds.
2. Provide an accurate total balance across multiple accounts.
3. Help users understand spending patterns through reports and charts.
4. Track personal debts and receivables.
5. Work completely offline.
6. Keep financial data on-device.
7. Provide backup and restore to reduce risk of data loss.
8. Offer optional PIN/biometric protection.

### Secondary Goals

- export financial data,
- support Indonesian and English,
- support light/dark theme,
- support reminders,
- support custom accounts and categories.

---

## 4. Non-Goals for MVP

The MVP will NOT include:
- bank API synchronization,
- automatic transaction import from banking apps,
- investment trading,
- crypto wallet integration,
- cloud synchronization,
- web dashboard,
- AI financial advice,
- OCR receipt scanning,
- shared/family accounts,
- subscription billing,
- advertisements.

These can be considered later.

---

## 5. Target Users

### Primary Persona

Individuals who:
- want to manually track personal finances,
- use multiple bank accounts/e-wallets/cash,
- prefer privacy,
- need offline use,
- want a simple but complete finance tool.

### Example Use Cases

- record lunch expense,
- record monthly salary,
- transfer money from DANA to BRI,
- see total money across all accounts,
- check monthly spending,
- track money lent to a friend,
- receive reminder for a debt due date,
- backup all app data before changing phones.

---

## 6. Product Principles

1. **Offline First**
   - all primary actions work without internet.

2. **Privacy First**
   - user financial records stay on device.

3. **Fast Entry**
   - common transaction entry should take only a few taps.

4. **No Duplicate Accounting**
   - transfers must not be counted as income or expense.

5. **Recoverable**
   - user can manually backup and restore data.

6. **Safe Destructive Actions**
   - deleting accounts/data requires explicit confirmation.

7. **Transparent Calculations**
   - summaries are derived from transaction data, not manually edited balances.

---

## 7. Information Architecture

Bottom navigation:

```text
Transaksi
Rekening
Rekap
Hutang
Pengaturan
```

Core flows:

```text
Transaksi
├── Pemasukan
├── Pengeluaran
├── Transfer
├── Detail
├── Edit
└── Hapus

Rekening
├── Daftar Rekening
├── Tambah
├── Detail
├── Edit
└── Arsip/Hapus

Rekap
├── Realtime
├── Bulanan
├── Tahunan
└── Custom

Hutang
├── Saya Meminjam
├── Saya Meminjamkan
├── Detail
├── Catat Pembayaran
└── Tandai Lunas

Pengaturan
├── Keamanan
├── Tema
├── Bahasa
├── Format Angka
├── Reminder
├── Backup
├── Restore
├── Export
└── Hapus Semua Data
```

---

## 8. MVP Feature Requirements

# 8.1 Transactions

### Transaction Types
- Income
- Expense
- Transfer

### Income Fields
- id
- amount
- account
- category
- date/time
- note
- created_at
- updated_at

### Expense Fields
Same as income.

### Transfer Fields
- id
- source_account
- destination_account
- amount
- transfer_fee (optional)
- date/time
- note
- created_at
- updated_at

### Requirements

- User can create a transaction.
- User can edit a transaction.
- User can delete a transaction.
- User can choose transaction date.
- User can choose account.
- User can choose category.
- User can add optional notes.
- User can filter by date.
- User can browse previous/next day.
- User can search by title/note/category.
- User can see daily totals.

### Daily Summary

Calculate:

```text
Income = sum(income)
Expense = sum(expense)
Difference = Income - Expense
```

Transfers are excluded.

---

# 8.2 Accounts

### Account Types
- Bank
- E-Wallet
- Cash
- Custom

### Default Suggested Accounts
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

These are suggestions only.

### Account Fields

- id
- name
- type
- initial_balance
- icon
- color
- archived
- created_at
- updated_at

### Balance Calculation

For an account:

```text
Current Balance
=
Initial Balance
+ Total Income
- Total Expense
+ Incoming Transfers
- Outgoing Transfers
```

Transfer fee behavior:
- if a transfer fee exists, fee is recorded as an expense from the source account.

### Requirements

- Add account.
- Edit account.
- Archive account.
- Delete account if allowed.
- View account-specific transaction history.
- View current account balance.
- View total balance across active accounts.

---

# 8.3 Categories

### Default Expense Categories
- Makanan & Minuman
- Transportasi
- Belanja
- Tagihan
- Hiburan
- Kesehatan
- Pendidikan
- Rumah
- Keluarga
- Donasi
- Lainnya

### Default Income Categories
- Gaji
- Bonus
- Freelance
- Bisnis
- Investasi
- Hadiah
- Refund
- Lainnya

### Requirements
- Create custom category.
- Edit category.
- Set icon/color.
- Archive category.
- Prevent deleting category if transactions use it unless migrated.

---

# 8.4 Reports / Rekap

### Modes
- Realtime
- Monthly
- Yearly
- Custom date range

### Metrics
- total income
- total expense
- net cash flow
- current balance
- savings rate
- top spending category

### Savings Rate

```text
Savings Rate =
(Income - Expense) / Income × 100
```

If income = 0, display `—`.

### Charts
- expense by category donut chart,
- income vs expense bar chart,
- balance trend line chart,
- monthly cash-flow chart.

### Requirements
- tap chart item to see value,
- filter by account,
- filter by category,
- choose custom date range,
- view category breakdown.

---

# 8.5 Debt / Receivables

### Types
1. `BORROWED`
   - user owes someone.

2. `LENT`
   - someone owes user.

### Debt Fields
- id
- type
- person_name
- original_amount
- due_date
- note
- status
- created_at
- updated_at

### Payment Fields
- id
- debt_id
- amount
- payment_date
- note
- account_id optional

### Remaining Amount

```text
remaining =
original_amount - sum(payments)
```

### Status
- Active
- Due Soon
- Overdue
- Paid

### Requirements
- create debt,
- edit debt,
- record partial payment,
- mark as paid,
- view payment history,
- show due date,
- notify when due soon if reminder enabled.

### Optional Ledger Integration

When recording debt repayment, user may choose:
- record only inside debt module,
- or also create linked finance transaction.

MVP recommendation:
- allow linked transaction to keep balances accurate.

---

# 8.6 Settings

## Appearance
- Light
- Dark
- System
- Accent color
- show decimal numbers
- hide/show balances

## Language
- Indonesian
- English

## Currency
MVP:
- IDR

Future:
- multi-currency.

## Notifications
- daily expense reminder,
- debt due reminder,
- optional custom time.

## Security
- 6 digit app PIN,
- biometric unlock,
- auto-lock duration.

## Data
- backup,
- restore,
- export CSV,
- export PDF,
- delete all data.

---

## 9. Local Data Storage

### Primary Database
SQLite using `expo-sqlite`.

Suggested database file:

```text
finance.db
```

### Storage Rules

Store in SQLite:
- accounts
- transactions
- categories
- transfers
- debts
- debt payments
- reminders
- settings that are not sensitive

Store securely:
- app PIN metadata
- biometric/security configuration
- encryption key if encryption is implemented

Use Expo SecureStore for sensitive values.

---

## 10. Suggested SQLite Schema

```sql
CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  initial_balance INTEGER NOT NULL DEFAULT 0,
  icon TEXT,
  color TEXT,
  archived INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  archived INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  account_id TEXT,
  category_id TEXT,
  note TEXT,
  transaction_date TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY(account_id) REFERENCES accounts(id),
  FOREIGN KEY(category_id) REFERENCES categories(id)
);

CREATE TABLE transfers (
  id TEXT PRIMARY KEY,
  source_account_id TEXT NOT NULL,
  destination_account_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  fee INTEGER NOT NULL DEFAULT 0,
  note TEXT,
  transfer_date TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY(source_account_id) REFERENCES accounts(id),
  FOREIGN KEY(destination_account_id) REFERENCES accounts(id)
);

CREATE TABLE debts (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  person_name TEXT NOT NULL,
  original_amount INTEGER NOT NULL,
  due_date TEXT,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE debt_payments (
  id TEXT PRIMARY KEY,
  debt_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  payment_date TEXT NOT NULL,
  note TEXT,
  linked_transaction_id TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY(debt_id) REFERENCES debts(id)
);

CREATE TABLE reminders (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1,
  scheduled_time TEXT,
  related_entity_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

### Monetary Data Rule

Store money as **integer smallest unit**, not floating point.

For IDR:

```text
Rp 45.000 → 45000
```

Do not use floating point for money.

---

## 11. Backup

### Backup Goal
Allow user to safely move/recover local data.

### Backup Content
- accounts
- categories
- transactions
- transfers
- debts
- debt payments
- reminder settings
- app preferences that are safe to export

### Backup Format

Recommended MVP:
- JSON

Example filename:

```text
finance-backup-2026-08-21-1839.json
```

Include metadata:

```json
{
  "backup_version": 1,
  "app_version": "1.0.0",
  "created_at": "2026-08-21T18:39:00+07:00",
  "data": {}
}
```

### Backup Flow
1. generate backup,
2. save temporary file,
3. open native share sheet,
4. user saves to Files/Drive/iCloud/etc.

No external service is required by the app.

---

## 12. Restore

### Restore Requirements

- user chooses file,
- app validates JSON,
- app checks backup version,
- app displays backup date,
- app asks confirmation,
- app creates emergency current-state backup before replacing data,
- restore is transactional where possible,
- show success/failure result.

### MVP Restore Strategy
`Replace all existing data`

Future:
- merge.

---

## 13. Export

### CSV
Allow export of:
- transactions,
- account summary,
- debt records.

### PDF
Allow monthly financial report with:
- date range,
- income,
- expense,
- difference,
- account balances,
- category breakdown.

Export is not the same as backup.

---

## 14. Notifications

Use local notifications.

No remote push server required.

### Daily Reminder
Example:

```text
20:00
Jangan lupa catat pengeluaran hari ini.
```

### Debt Reminder
Options:
- 7 days before
- 3 days before
- 1 day before
- due day

### Requirements
- ask notification permission only when user enables reminder,
- allow changing time,
- allow disabling reminders.

---

## 15. Security

### App Lock

Optional:
- PIN
- biometrics

### Requirements
- app PIN stored securely,
- never store PIN as plain text,
- use SecureStore,
- support biometric fallback,
- automatically lock after app is inactive.

### Local Database

MVP:
- private app sandbox + app lock.

Enhanced version:
- encrypted SQLite or encrypted backup.

---

## 16. Privacy

Core privacy statement:

> Financial data is stored locally on the user's device and is not automatically uploaded to an external server.

If analytics/crash reporting are added later:
- disclose separately,
- make sure it never contains financial amounts, notes, or personal transaction data.

---

## 17. Onboarding

Maximum 3 screens.

### Screen 1
**Kelola uang dengan lebih jelas**

Record income, expenses, accounts, and debts.

### Screen 2
**Data tetap di perangkatmu**

Explain local-only storage.

### Screen 3
**Jangan lupa backup**

Explain manual backup to prevent data loss.

Then:
- currency selection,
- optional PIN setup,
- create first account.

---

## 18. First-Run Setup

Flow:

```text
Splash
→ Onboarding
→ Choose Language
→ Currency = IDR
→ Optional App Lock
→ Create First Account
→ Transaction Screen
```

A user should not need to register or provide an email.

---

## 19. Search & Filters

Transaction filters:
- date range,
- type,
- account,
- category,
- min/max amount.

Search:
- notes,
- category,
- account name.

---

## 20. Error Handling

Examples:

### Invalid amount
`Nominal harus lebih besar dari Rp 0.`

### Insufficient balance
For MVP, allow negative balances by default but warn:

`Saldo rekening akan menjadi negatif.`

User may continue.

### Delete account
If account has transactions:
- recommend archive,
- if deleting is allowed, require explicit confirmation and transaction migration/deletion strategy.

### Restore error
`File backup tidak valid atau tidak didukung.`

---

## 21. Empty States

### Transactions
`Belum ada transaksi.`

CTA:
`Tambah Transaksi`

### Accounts
`Belum ada rekening.`

CTA:
`Tambah Rekening`

### Reports
`Belum cukup data untuk membuat rekap.`

### Debt
`Belum ada hutang atau piutang.`

---

## 22. Performance Requirements

- app launch should feel immediate,
- adding transaction should complete locally without network,
- lists should remain smooth with 10,000+ transactions,
- charts should aggregate data efficiently,
- use indexes for common date/account/category queries.

Suggested indexes:

```sql
CREATE INDEX idx_transactions_date
ON transactions(transaction_date);

CREATE INDEX idx_transactions_account
ON transactions(account_id);

CREATE INDEX idx_transactions_category
ON transactions(category_id);
```

---

## 23. Offline Requirements

All MVP features must work with airplane mode enabled:

- add transaction,
- edit transaction,
- delete transaction,
- transfer,
- accounts,
- reports,
- debt,
- reminders,
- settings,
- export,
- backup,
- restore.

Only external actions such as sharing a file to a cloud service may require internet depending on the destination selected by the user.

---

## 24. Functional Acceptance Criteria

### Transactions
- [ ] User can add income.
- [ ] User can add expense.
- [ ] User can transfer between accounts.
- [ ] Transfer does not increase total income/expense.
- [ ] Account balances update correctly.
- [ ] User can edit and delete records.

### Accounts
- [ ] User can create custom account.
- [ ] Total balance equals sum of active account balances.
- [ ] Archived accounts do not appear in default list.
- [ ] Account detail displays transaction history.

### Reports
- [ ] Monthly income matches underlying transactions.
- [ ] Monthly expense matches underlying transactions.
- [ ] Custom range works.
- [ ] Category chart totals equal expense total.

### Debt
- [ ] User can create borrowed/lent record.
- [ ] Partial payments reduce remaining balance.
- [ ] Debt becomes paid when remaining amount reaches zero.

### Backup
- [ ] User can create backup file.
- [ ] Backup contains all required financial data.
- [ ] Valid backup restores successfully.
- [ ] Invalid backup cannot overwrite data.

### Security
- [ ] PIN lock works.
- [ ] Biometrics work when supported.
- [ ] User can disable app lock.

### Offline
- [ ] Core application remains functional without internet.

---

## 25. MVP Release Scope

### Must Have
- Transactions
- Accounts
- Categories
- Transfers
- Reports
- Debt/receivables
- Settings
- Local SQLite storage
- Backup/restore
- Local notifications
- PIN/biometric lock
- Light/dark mode
- Indonesian language
- CSV export

### Should Have
- English
- PDF report
- custom accent color
- account icons
- balance hiding
- advanced report filtering

### Could Have
- recurring transactions
- budgets
- saving goals
- receipt attachments
- encrypted backup

---

## 26. Phase 2

Possible future additions:

### Budget
- monthly category budget,
- progress indicator,
- overspending warning.

### Financial Goals
- emergency fund,
- travel savings,
- laptop/car/home target.

### Recurring Transactions
- salary,
- subscriptions,
- rent,
- utilities.

### Receipt
- local image attachment.

### Better Security
- encrypted SQLite,
- encrypted backup.

---

## 27. Phase 3

Optional cloud capabilities:
- cloud backup,
- multi-device sync,
- web dashboard.

Cloud must remain optional.

The product should still support a local-only privacy mode.

---

## 28. Suggested Project Structure

```text
finance-app/
├── app/
│   ├── (tabs)/
│   │   ├── transactions.tsx
│   │   ├── accounts.tsx
│   │   ├── reports.tsx
│   │   ├── debts.tsx
│   │   └── settings.tsx
│   │
│   ├── transaction/
│   │   ├── expense.tsx
│   │   ├── income.tsx
│   │   ├── transfer.tsx
│   │   └── [id].tsx
│   │
│   ├── account/
│   ├── debt/
│   └── settings/
│
├── components/
│   ├── ui/
│   ├── finance/
│   ├── charts/
│   └── forms/
│
├── database/
│   ├── db.ts
│   ├── migrations/
│   ├── repositories/
│   └── seed.ts
│
├── services/
│   ├── backup.ts
│   ├── restore.ts
│   ├── export.ts
│   ├── notifications.ts
│   └── security.ts
│
├── hooks/
├── utils/
├── types/
├── constants/
├── locales/
└── assets/
```

---

## 29. Product Success Criteria

For the first usable release:

1. A new user can create an account and first transaction within 2 minutes.
2. Transaction entry requires no internet.
3. Total account balance is always mathematically consistent with ledger data.
4. User can understand monthly income and expenses without reading raw transactions.
5. User can backup all important data.
6. User can restore a backup on a fresh install.
7. App remains usable with thousands of transactions.
8. Private financial data is never automatically sent to an external server.

---

## 30. Final Product Definition

This product is a:

> **Private, offline-first personal finance manager for Android and iOS that stores user financial data locally, supports multiple accounts, transactions, transfers, financial reports, debts, reminders, security, and manual backup/restore.**

The MVP should prioritize reliability, privacy, accounting correctness, and excellent mobile UX over feature quantity.
