# Panduan Penggunaan TahuOCR.js

Panduan ini menyediakan instruksi dan contoh terperinci tentang cara menggunakan TahuOCR.js untuk berbagai tugas OCR.

## 3. Penggunaan Dasar

Untuk memulai dengan TahuOCR.js, impor `createTahuOCR` dan inisialisasi dengan penyedia dan kunci API yang Anda inginkan.

```javascript
import { createTahuOCR } from 'tahu-ocr.js';

const ocr = createTahuOCR({
  provider: 'openrouter', // atau 'openai', 'gemini', 'ollama'
  apiKey: process.env.OPENROUTER_API_KEY,
  model: 'google/gemini-2.0-flash-exp:free', // atau model lain
  debug: true
});

async function runOCR() {
  try {
    const result = await ocr.extractText('./path/to/your/image.jpg', {
      format: 'json',
      includeColors: true
    });
    console.log(result);
  } catch (error) {
    console.error('Kesalahan OCR:', error.message);
  }
}

runOCR();
```

## 4. Menjalankan Contoh

Direktori `examples/` berisi berbagai kasus penggunaan yang menunjukkan kemampuan TahuOCR.js, termasuk penggunaan dasar, fitur lanjutan, dan server Express yang siap produksi.

Untuk menjalankan contoh mulai cepat:

```bash
node example.js
```

Ini akan menjalankan tes dasar dan mendemonstrasikan fungsionalitas inti.

Untuk menjalankan contoh server Express:

```bash
npm install express multer # Instal dependensi server
node examples/server.js
```

Setelah server berjalan, Anda dapat menguji API menggunakan `curl`:

```bash
curl -X POST http://localhost:3000/api/ocr \
  -F "image=@gambar_anda.jpg" \
  -F "provider=openai" \
  -F "includeCoordinates=true"
```

```