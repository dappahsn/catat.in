# 💰 Personal Finance Web App (MVP)

Aplikasi pencatatan keuangan pribadi yang sangat ringan, cepat, responsif, mobile-first, dan installable sebagai PWA.

---

## 🚀 Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4 + Vanilla CSS Variable Design System (Light/Dark theme & 5 accent colors)
- **Backend & Database:** Supabase (PostgreSQL + Row Level Security + Google OAuth)
- **Icons & Charts:** Lucide React & Recharts
- **PWA:** Vite Plugin PWA (Service Worker, Manifest, Standalone Mode)

---

## 📋 Fitur Utama (MVP)

1. **Autentikasi & Keamanan:**
   - Login dengan Akun Google via Supabase OAuth.
   - Protected Routes dengan session persistence.
   - Isolasi data penuh antar pengguna menggunakan PostgreSQL Row Level Security (RLS).

2. **Pencatatan Transaksi (CRUD):**
   - Pemasukan (+), Pengeluaran (-), dan Pindah Saldo (↔).
   - Validasi saldo: Transfer dan Pengeluaran diblokir jika saldo rekening asal tidak mencukupi.
   - Format input mata uang rupiah otomatis (misal `50.000` disimpan sebagai `50000`).
   - Riwayat transaksi terkelompok per tanggal dengan infinite pagination.
   - Filter tanggal: Hari Ini, Kemarin, 7 Hari Terakhir, Bulan Ini, dan Rentang Kustom.
   - Ekspor data transaksi ke file CSV berstandar UTF-8 BOM.

3. **Manajemen Rekening (CRUD):**
   - Dukungan tipe rekening: Bank, Tunai, E-Wallet, dan Lainnya.
   - Perhitungan saldo dinamis secara real-time berdasarkan rumus transaksi (bukan cached mutable field).
   - Pencegahan penghapusan rekening yang masih memiliki transaksi.
   - Halaman detail rekening lengkap dengan ringkasan arus kas bulanan.

4. **Rekap & Analisis Keuangan:**
   - Mode Rekap: Realtime, Bulanan (dengan navigasi bulan), dan Custom Date Range.
   - Ringkasan total Pemasukan, Pengeluaran, dan Selisih (Pindah Saldo tidak dimasukkan ke rekap).
   - Donut Chart interaktif (Recharts) dengan toggle Pemasukan / Pengeluaran dan tooltip detail.
   - Rincian kategori dengan persentase dan bar visual yang mudah dibaca.

5. **Pengaturan & Manajemen Data:**
   - **Pengingat:** Pengingat harian dengan waktu kustom (browser notifications API).
   - **Tampilan:** Mode Tema (Sistem, Terang, Gelap) dan 5 Pilihan Warna Utama (Biru, Hijau, Ungu, Oranye, Merah).
   - **Bahasa:** Dukungan multi-bahasa (Bahasa Indonesia & English).
   - **Backup:** Unduh seluruh data dalam format JSON standar.
   - **Restore:** Pratinjau data backup sebelum pemulihan dengan validasi integritas struktur file.
   - **Zona Bahaya:** Hapus seluruh data dengan konfirmasi ketik `HAPUS`.

6. **Pengalaman Pengguna (UI/UX):**
   - Mobile-first bottom navigation (< 768px) dengan safe-area padding.
   - Clean top navigation bar pada desktop (≥ 768px).
   - Skeleton loading states dan toast notifications yang ringan tanpa library berat.

---

## 🛠️ Panduan Instalasi & Menjalankan Lokal

### 1. Prasyarat
- Node.js versi 18+ atau 20+
- Akun Supabase (gratis di [supabase.com](https://supabase.com))

### 2. Clone & Install Dependencies
```bash
cd Finance
npm install
```

### 3. Setup Supabase & Database Schema
1. Buat project baru di Supabase Dashboard.
2. Buka **SQL Editor** di Supabase Dashboard.
3. Salin dan jalankan seluruh isi file migrasi:
   [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql)

### 4. Setup Google OAuth di Supabase
1. Di Google Cloud Console, buat OAuth 2.0 Client ID (Web Application).
2. Tambahkan Authorized Redirect URI dari Supabase: `https://<YOUR-PROJECT-REF>.supabase.co/auth/v1/callback`
3. Di Supabase Dashboard, buka **Authentication -> Providers -> Google**, aktifkan dan masukkan **Client ID** serta **Client Secret**.

### 5. Konfigurasi Environment Variables
Salin `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi dengan kredensial Supabase Anda:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 6. Menjalankan Server Development
```bash
npm run dev
```
Buka browser di `http://localhost:5173`.

---

## 📦 Build untuk Produksi & Deployment

### Build Produksi
```bash
npm run build
```
File build yang optimal akan berada di direktori `dist/`.

### Preview Build Lokal
```bash
npm run preview
```

### Deploy ke Vercel
1. Hubungkan repository GitHub ke [Vercel](https://vercel.com).
2. Masukkan Environment Variables di Vercel Dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Framework Preset: **Vite** (Build command: `npm run build`, Output directory: `dist`).
4. Klik **Deploy**.

---

## 🔒 Aturan Bisnis & Integritas Keuangan

- **Saldo Rekening:** Tidak disimpan sebagai nilai statis yang terus dimutasi. Dihitung secara deterministik:
  $$\text{Saldo} = \text{Saldo Awal} + \sum \text{Pemasukan} - \sum \text{Pengeluaran} + \sum \text{Transfer Masuk} - \sum \text{Transfer Keluar}$$
- **Pindah Saldo:** Diisolasi dari perhitungan laba/rugi rekapitulasi pengeluaran dan pemasukan.
- **Konfirmasi Transaksi:** Menunggu konfirmasi database PostgreSQL sebelum status transaksi diperbarui pada UI (menghindari ketidaksinkronan saldo sementara).
