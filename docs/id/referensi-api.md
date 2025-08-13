# Referensi API untuk TahuOCR.js

Bagian ini menyediakan referensi terperinci untuk API TahuOCR.js, termasuk kelas, metode, dan struktur data.

## Kelas `TahuOCR`

Kelas utama untuk melakukan operasi OCR.

### Konstruktor

`new TahuOCR(config: TahuOCRConfig)`

- `config`: (`TahuOCRConfig`) Objek konfigurasi untuk instance OCR.

### Metode

#### `extractText(imagePath: string | Buffer, options?: object): Promise<OCRResult | string>`

Mengekstrak teks dari gambar menggunakan AI.

- `imagePath`: (`string | Buffer`) Jalur ke file gambar, URL, atau Buffer.
- `options`: (`object`, opsional) Opsi OCR.
  - `format`: (`'json' | 'text'`, default: `'json'`) Format keluaran. Jika `'json'`, mengembalikan `OCRResult`. Jika `'text'`, mengembalikan `string`.
  - `includeColors`: (`boolean`, default: `true`) Apakah akan menyertakan deteksi warna dalam keluaran.
  - `customPrompt`: (`string`, opsional) Prompt OCR kustom untuk memandu model AI.
  - `timeout`: (`number`, default: `30000`) Batas waktu permintaan dalam milidetik.

- **Mengembalikan**: (`Promise<OCRResult | string>`) Sebuah promise yang menyelesaikan ke hasil OCR.

#### `batchProcess(images: Array<string | Buffer>, options?: object, concurrency?: number): Promise<Array<OCRResult | string>>`

Memproses beberapa gambar dalam batch.

- `images`: (`Array<string | Buffer>`) Sebuah array jalur gambar, URL, atau Buffer.
- `options`: (`object`, opsional) Opsi OCR (sama dengan `extractText`).
- `concurrency`: (`number`, default: `3`) Jumlah tugas pemrosesan bersamaan.

- **Mengembalikan**: (`Promise<Array<OCRResult | string>>`) Sebuah promise yang menyelesaikan ke array hasil OCR untuk setiap gambar.

#### `extractFromRegions(imagePath: string | Buffer, regions: Array<{x: number, y: number, width: number, height: number}>, options?: object): Promise<Array<OCRResult | string>>`

Mengekstrak teks dari wilayah tertentu pada gambar.

- `imagePath`: (`string | Buffer`) Jalur ke file gambar, URL, atau Buffer.
- `regions`: (`Array<{x: number, y: number, width: number, height: number}>`) Sebuah array objek wilayah, masing-masing dengan properti `x`, `y`, `width`, dan `height`.
- `options`: (`object`, opsional) Opsi OCR (sama dengan `extractText`).

- **Mengembalikan**: (`Promise<Array<OCRResult | string>>`) Sebuah promise yang menyelesaikan ke array hasil OCR untuk setiap wilayah yang ditentukan.

#### `getAvailableModels(): Promise<Array<string>>`

Mengambil daftar model AI yang tersedia untuk penyedia saat ini.

- **Mengembalikan**: (`Promise<Array<string>>`) Sebuah promise yang menyelesaikan ke array nama model.

#### `test(): Promise<object>`

Menjalankan self-test fungsionalitas OCR dengan contoh gambar.

- **Mengembalikan**: (`Promise<object>`) Sebuah promise yang menyelesaikan ke objek hasil tes, menunjukkan keberhasilan/kegagalan dan detail lainnya.

## Struktur Data

### `TahuOCRConfig`

Objek konfigurasi untuk kelas `TahuOCR`.

```typescript
type TahuOCRConfig = {
  provider: 'openrouter' | 'openai' | 'gemini' | 'ollama';
  apiKey: string;
  model?: string;
  ollamaBaseUrl?: string;
  debug?: boolean;
  imageOptions?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    sharpen?: boolean;
    normalize?: boolean;
  };
};
```

### `OCRTextElement`

Mewakili elemen teks individual yang diekstrak dari gambar.

```typescript
type OCRTextElement = {
  text: string;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
    centerX: number;
    centerY: number;
  };
  confidence: number;
  color?: string;
  backgroundColor?: string;
  lineNumber: number;
  wordIndex: number;
};
```

### `OCRResult`

Objek hasil komprehensif yang dikembalikan oleh `extractText` ketika `format` adalah `'json'`.

```typescript
type OCRResult = {
  rawText: string;
  elements: OCRTextElement[];
  metadata: {
    totalElements: number;
    averageConfidence: number;
    processingTimeMs: number;
    imageInfo: {
      width: number;
      height: number;
      format: string;
      processedWidth: number;
      processedHeight: number;
    };
  };
};
```
