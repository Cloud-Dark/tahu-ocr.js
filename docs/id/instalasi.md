# Panduan Instalasi untuk TahuOCR.js

Panduan ini akan membantu Anda mengatur dan menjalankan TahuOCR.js.

## 1. Kloning Repositori (Opsional, jika Anda mengunduh langsung)

```bash
git clone https://github.com/Cloud-Dark/tahu-ocr.js.git
cd tahu-ocr.js
```

## 2. Instal Dependensi

TahuOCR.js membutuhkan `axios`, `sharp`, dan `form-data`.

```bash
npm install axios sharp form-data
```

## 3. Atur Variabel Lingkungan

Buat file `.env` di root proyek dengan menyalin file `.env.example`:

```bash
cp .env.example .env
```

Edit file `.env` yang baru dibuat dan tambahkan kunci API Anda untuk penyedia AI yang ingin Anda gunakan. Setidaknya satu kunci API diperlukan.

```
OPENROUTER_API_KEY=kunci_openrouter_anda
OPENAI_API_KEY=kunci_openai_anda  
GEMINI_API_KEY=kunci_gemini_anda
```

**Catatan:** OpenRouter direkomendasikan karena menyediakan akses ke berbagai model, termasuk yang gratis seperti `google/gemini-2.0-flash-exp:free`.

## 4. Jalankan Contoh (Opsional)

Untuk menjalankan contoh-contoh komprehensif, eksekusi file `example.js`:

```bash
node example.js
```

Ini akan menjalankan tes mulai cepat dan mendemonstrasikan penggunaan dasar. Anda dapat memodifikasi `example.js` untuk menjalankan semua contoh atau yang spesifik.

## 5. Bangun Pustaka (untuk penggunaan produksi)

Untuk membangun pustaka untuk produksi, gunakan Rollup:

```bash
npm run build
```

Output yang dibundel akan berada di direktori `dist/`.
