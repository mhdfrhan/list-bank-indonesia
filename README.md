# BankID.API - API Daftar Bank Indonesia Terlengkap & Gratis

Proyek ini adalah API publik dan landing page dokumentasi gratis berisi kode bank transfer, nama resmi, nama singkat, sandi BIC (SWIFT), dan kode kantor untuk **125 bank di Indonesia** (data terupdate per 1 November 2024 dari Bank Indonesia).

API ini didesain agar **100% statis**, dihost secara gratis melalui Vercel CDN, sehingga memiliki latensi ultra-cepat (~0ms), mendukung CORS secara bawaan (CORS-enabled), dan tanpa batasan rate limit (unlimited rate limits).

---

## ⚡ Fitur Utama

- **CORS Enabled**: Menggunakan header `Access-Control-Allow-Origin: *` di Vercel agar dapat di-fetch langsung dari frontend (seperti Flutter Web, React, Vue, Android, iOS).
- **Performa CDN**: Dihost sebagai file JSON statis di Vercel CDN, respon instan tanpa waktu bangun (cold start) database.
- **Gratis Selamanya**: Tidak membutuhkan database serverless atau server aktif yang memakan biaya.
- **Direktori Interaktif**: Dilengkapi dokumentasi landing page dengan fitur pencarian real-time dan playground kode.

---

## 🚀 Daftar Endpoint API

### 1. Dapatkan Semua Daftar Bank
Mengembalikan list lengkap 125 bank beserta seluruh atributnya.
- **URL**: `https://<domain-anda>.vercel.app/api/banks.json`
- **Method**: `GET`
- **Response**: `Array of Bank Objects`

### 2. Dapatkan Bank Berdasarkan Kode Bank (3-Digit)
- **URL**: `https://<domain-anda>.vercel.app/api/banks/code/{code}.json`
- **Method**: `GET`
- **Contoh**: `https://<domain-anda>.vercel.app/api/banks/code/014.json` (BCA)

### 3. Dapatkan Bank Berdasarkan Sandi BIC (SWIFT)
- **URL**: `https://<domain-anda>.vercel.app/api/banks/bic/{bic}.json`
- **Method**: `GET`
- **Contoh**: `https://<domain-anda>.vercel.app/api/banks/bic/CENAIDJA.json` (BCA)

---

## 📝 Skema Data JSON

Setiap objek bank memiliki struktur sebagai berikut:

```json
{
  "no": 83,
  "sandi_bic": "CENAIDJA",
  "name": "PT. BANK CENTRAL ASIA Tbk.",
  "name_singkat": "BCA",
  "code": "014",
  "kode_kantor": "0397"
}
```

### Penjelasan Field:
- `no`: Nomor urut baris data (Integer).
- `sandi_bic`: Sandi BIC (Bank Identifier Code) atau SWIFT Code bank tersebut.
- `name`: Nama resmi hukum/legal dari bank.
- `name_singkat`: Nama populer/singkat dari bank.
- `code`: 3-digit kode transfer bank (misal `014` untuk BCA, `008` untuk Mandiri).
- `kode_kantor`: 4-digit kode kantor pusat bank.

---

## 💻 Cara Menjalankan Secara Lokal

1. **Clone repositori ini**:
   ```bash
   git clone https://github.com/mhdfrhan/list-bank-indonesia.git
   cd list-bank-indonesia
   ```

2. **Jalankan Build Script**:
   Script ini akan membaca file markdown `sandi-bank-bi.md`, melakukan parsing data bank, memproduksi seluruh file JSON API ke folder `dist/api/`, dan menyalin aset frontend ke folder `dist/`.
   ```bash
   npm run build
   ```

3. **Jalankan Development Server**:
   Menjalankan server statis lokal untuk menguji landing page dan API.
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` (atau port yang tertera) di browser Anda.

---

## ☁️ Cara Deploy ke GitHub & Vercel

### Langkah 1: Publish ke GitHub
1. Inisialisasi Git di folder lokal Anda jika belum:
   ```bash
   git init
   git add .
   git commit -m "Inisialisasi API Bank Indonesia"
   ```
2. Buat repositori baru di GitHub (misal bernama `list-bank-indonesia`).
3. Hubungkan repositori lokal Anda ke GitHub dan push:
   ```bash
   git remote add origin https://github.com/mhdfrhan/list-bank-indonesia.git
   git branch -M main
   git push -u origin main
   ```

### Langkah 2: Deploy ke Vercel (Gratis)
1. Masuk ke dashboard **Vercel** (`https://vercel.com`).
2. Klik **Add New** -> **Project**.
3. Hubungkan akun GitHub Anda dan pilih repositori `list-bank-indonesia`.
4. Vercel akan membaca konfigurasi secara otomatis:
   - **Framework Preset**: *Other* atau *Vite/Create React App* (biarkan default).
   - **Build Command**: `npm run build` (auto-detected).
   - **Output Directory**: `dist` (auto-detected).
5. Klik **Deploy**.
6. Proyek Anda sekarang aktif! Vercel akan otomatis men-deploy setiap kali Anda melakukan `git push` ke branch `main`.

---

## ⚖️ Lisensi

Proyek ini menggunakan lisensi **MIT**. Anda bebas menggunakan API ini untuk kebutuhan komersil maupun non-komersil secara gratis.
Data mentah bersumber dari Sandi Bank Bank Indonesia.
