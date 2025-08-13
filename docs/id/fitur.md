# Fitur TahuOCR.js

TahuOCR.js adalah pustaka OCR bertenaga AI yang komprehensif dan kuat untuk Node.js, dirancang untuk teks bahasa Indonesia tetapi mampu menangani berbagai bahasa. Ini menawarkan dukungan multi-penyedia, deteksi koordinat yang tepat, format keluaran yang fleksibel, dan kemampuan pemrosesan gambar tingkat lanjut.

## ✨ Fitur Utama

### ✅ Dukungan Multi-Penyedia
- **OpenAI GPT-4 Vision**: Untuk akurasi tertinggi.
- **Google Gemini**: Hemat biaya dan cepat.
- **OpenRouter**: Akses ke berbagai model dari berbagai penyedia.
- **Ollama**: Dukungan untuk model visi lokal.

### ✅ Deteksi Koordinat Presisi
- Mengekstrak koordinat X, Y untuk setiap elemen teks.
- Menyediakan lebar dan tinggi untuk setiap blok teks.
- Termasuk pelacakan nomor baris.

### ✅ Keluaran Fleksibel
- Keluaran JSON terstruktur dengan metadata komprehensif.
- Keluaran teks mentah untuk kasus penggunaan sederhana.
- Pemformatan kustom melalui prompt lanjutan.

### ✅ Peningkatan Gambar
- Pengubahan ukuran dan optimasi otomatis.
- Penajaman untuk teks yang buram.
- Normalisasi kecerahan/kontras.

### ✅ Fitur Lanjutan
- Pemrosesan batch untuk beberapa gambar.
- Prompt kustom untuk kasus penggunaan spesifik (misalnya, faktur, kartu identitas, ekstraksi data tabel).
- Penanganan kesalahan yang komprehensif.
- Dukungan TypeScript dengan definisi tipe.

### ✅ Siap Produksi
- Termasuk contoh server Express.js untuk endpoint API REST, penanganan unggahan file, dan pemrosesan batch.
- Dirancang untuk kinerja dan skalabilitas.
