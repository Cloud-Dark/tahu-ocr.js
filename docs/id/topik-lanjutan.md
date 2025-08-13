# Topik Lanjutan di TahuOCR.js

Bagian ini membahas fungsionalitas dan kasus penggunaan TahuOCR.js yang lebih canggih, menyediakan penjelasan terperinci dan contoh kode.

## Pemrosesan Batch Beberapa Gambar

TahuOCR.js memungkinkan Anda memproses beberapa gambar secara bersamaan, yang sangat efisien untuk kumpulan data besar. Metode `batchProcess` mengambil array jalur/buffer/URL gambar dan batas konkurensi opsional.

```javascript
import { batchProcessingExample } from '../../examples/advanced-usage.js';

// Jalankan contoh
batchProcessingExample();
```

## Ekstraksi Berbasis Wilayah

Ekstrak teks dari area tertentu pada gambar. Ini berguna untuk dokumen terstruktur di mana Anda hanya memerlukan informasi dari wilayah yang telah ditentukan sebelumnya (misalnya, header, footer, bidang tertentu).

```javascript
import { regionBasedExtraction } from '../../examples/advanced-usage.js';

// Jalankan contoh
regionBasedExtraction();
```

## Prompt Kustom untuk Kasus Penggunaan Spesifik

Manfaatkan kekuatan prompt kustom untuk memandu model AI untuk tugas ekstraksi yang sangat spesifik. Ini memungkinkan Anda untuk menentukan dengan tepat informasi apa yang Anda butuhkan dan dalam format apa.

```javascript
import { customPromptExample } from '../../examples/advanced-usage.js';

// Jalankan contoh
customPromptExample();
```

## Perbandingan Multi-Penyedia

Bandingkan kinerja dan akurasi penyedia AI yang berbeda (OpenRouter, OpenAI, Gemini) pada gambar yang sama untuk memilih yang paling sesuai dengan kebutuhan Anda.

```javascript
import { multiProviderComparison } from '../../examples/advanced-usage.js';

// Jalankan contoh
multiProviderComparison();
```

## Pemrosesan Kartu Identitas / SIM

Ekstrak bidang-bidang spesifik dari dokumen identitas seperti kartu identitas atau SIM dengan presisi tinggi, termasuk koordinat untuk pengisian formulir otomatis.

```javascript
import { idCardProcessing } from '../../examples/specialized-cases.js';

// Jalankan contoh
idCardProcessing();
```

## Ekstraksi Data Tabel

Ekstrak data terstruktur dari tabel dalam gambar, mempertahankan hubungan baris dan kolom serta menyediakan koordinat sel.

```javascript
import { tableDataExtraction } from '../../examples/specialized-cases.js';

// Jalankan contoh
tableDataExtraction();
```

## Analisis Warna dan Gaya Teks

Analisis elemen teks untuk warna dan gayanya, yang dapat berguna untuk aksesibilitas, branding, atau deteksi fitur keamanan.

```javascript
import { colorAnalysisExample } from '../../examples/specialized-cases.js';

// Jalankan contoh
colorAnalysisExample();
```

## Pengujian Kinerja

Evaluasi kinerja TahuOCR.js di bawah konfigurasi dan format keluaran yang berbeda.

```javascript
import { performanceTest } from '../../examples/test-runner.js';

// Jalankan contoh
performanceTest();
```

## Penanganan Kesalahan dan Validasi

Pahami bagaimana TahuOCR.js menangani kesalahan dan memvalidasi masukan, memastikan operasi OCR yang kuat dan andal.

```javascript
import { errorHandlingExample } from '../../examples/test-runner.js';

// Jalankan contoh
errorHandlingExample();
```

## Pengujian dan Validasi Model

Uji fungsionalitas OCR dengan contoh gambar dan ambil model AI yang tersedia untuk penyedia saat ini.

```javascript
import { modelTestingExample } from '../../examples/test-runner.js';

// Jalankan contoh
modelTestingExample();
```

## Pipeline Pemrosesan Dokumen Produksi

Implementasikan pipeline yang kuat untuk memproses berbagai jenis dokumen di lingkungan produksi, termasuk analisis dan pelaporan.

```javascript
import { productionPipeline } from '../../examples/production-examples.js';

// Jalankan contoh
productionPipeline();
```

## OCR Real-time dengan Pemantauan File

Siapkan sistem OCR real-time yang secara otomatis memproses gambar saat ditambahkan ke folder yang dipantau.

```javascript
import { realtimeOCRExample } from '../../examples/production-examples.js';

// Jalankan contoh
realtimeOCRExample();
```
