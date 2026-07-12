# BankID.API - API Daftar Bank Indonesia Terlengkap & Gratis

API publik gratis berisi kode bank transfer, nama resmi, nama singkat, sandi BIC (SWIFT), dan kode kantor untuk **125 bank di Indonesia** (data terupdate per 12 Juli 2026 dari Bank Indonesia).

API ini didesain agar **100% statis**, dihost secara gratis melalui Vercel CDN, sehingga memiliki latensi ultra-cepat (~0ms), mendukung CORS secara bawaan (CORS-enabled), dan tanpa batasan rate limit (unlimited rate limits).

---

## ⚡ Fitur Utama

- **CORS-Enabled**: Menggunakan header `Access-Control-Allow-Origin: *` sehingga dapat di-fetch langsung dari frontend (seperti Flutter, React, Vue, Android, iOS).
- **Performa CDN**: Hosted statically on Vercel CDN untuk respon instan tanpa database cold start.
- **Dua Endpoint List**: Mendukung `/api/banks.json` dan `/api/bank.json`.
- **Lookup Individual**: Mendukung lookup per kode bank (`/api/banks/code/{code}.json`) dan per sandi BIC (`/api/banks/bic/{bic}.json`).

---

## 🚀 Daftar Endpoint API

### 1. Dapatkan Semua Daftar Bank
Mengembalikan list lengkap 125 bank beserta seluruh strukturnya.
- **URL**: `https://list-bank-indonesia.vercel.app/api/banks.json` (atau `https://list-bank-indonesia.vercel.app/api/bank.json`)
- **Method**: `GET`
- **Response**: `Array of Bank Objects`

### 2. Dapatkan Bank Berdasarkan Kode Bank (3-Digit)
- **URL**: `https://list-bank-indonesia.vercel.app/api/banks/code/{code}.json`
- **Method**: `GET`
- **Contoh**: [https://list-bank-indonesia.vercel.app/api/banks/code/014.json](https://list-bank-indonesia.vercel.app/api/banks/code/014.json) (BCA)

### 3. Dapatkan Bank Berdasarkan Sandi BIC (SWIFT)
- **URL**: `https://list-bank-indonesia.vercel.app/api/banks/bic/{bic}.json`
- **Method**: `GET`
- **Contoh**: [https://list-bank-indonesia.vercel.app/api/banks/bic/CENAIDJA.json](https://list-bank-indonesia.vercel.app/api/banks/bic/CENAIDJA.json) (BCA)

---

## 📝 Skema Data JSON

Setiap objek bank memiliki struktur sebagai berikut (nama bank sudah bersih tanpa awalan PT):

```json
{
  "no": 83,
  "sandi_bic": "CENAIDJA",
  "name": "BANK CENTRAL ASIA Tbk.",
  "name_singkat": "BCA",
  "code": "014",
  "kode_kantor": "0397"
}
```

### Penjelasan Field:
- `no`: Nomor urut data (Integer).
- `sandi_bic`: Sandi BIC (Bank Identifier Code) atau SWIFT Code bank.
- `name`: Nama resmi hukum/legal dari bank (tanpa awalan PT).
- `name_singkat`: Nama populer/singkat dari bank.
- `code`: 3-digit kode transfer bank (misal `014` untuk BCA, `008` untuk Mandiri).
- `kode_kantor`: 4-digit kode kantor pusat bank.

---

## 💻 Contoh Integrasi Kode

### JavaScript
```javascript
fetch('https://list-bank-indonesia.vercel.app/api/banks.json')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Dart / Flutter
```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<List<dynamic>> fetchBanks() async {
  final url = Uri.parse('https://list-bank-indonesia.vercel.app/api/banks.json');
  final response = await http.get(url);

  if (response.statusCode == 200) {
    return jsonDecode(response.body);
  } else {
    throw Exception('Gagal mengambil data bank');
  }
}
```

### Python
```python
import requests

response = requests.get("https://list-bank-indonesia.vercel.app/api/banks.json")
if response.status_code == 200:
    banks = response.json()
    print(banks)
```

---

## ⚖️ Lisensi

Proyek ini menggunakan lisensi **MIT**. Bebas digunakan untuk kebutuhan komersil maupun non-komersil secara gratis.
Data mentah bersumber dari Sandi Bank Bank Indonesia.
