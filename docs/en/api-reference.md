# API Reference for TahuOCR.js

This section provides a detailed reference for the TahuOCR.js API, including classes, methods, and data structures.

## `TahuOCR` Class

The main class for performing OCR operations.

### Constructor

`new TahuOCR(config: TahuOCRConfig)`

- `config`: (`TahuOCRConfig`) Configuration object for the OCR instance.

### Methods

#### `extractText(imagePath: string | Buffer, options?: object): Promise<OCRResult | string>`

Extracts text from an image using AI.

- `imagePath`: (`string | Buffer`) Path to image file, URL, or Buffer.
- `options`: (`object`, optional) OCR options.
  - `format`: (`'json' | 'text'`, default: `'json'`) Output format. If `'json'`, returns `OCRResult`. If `'text'`, returns `string`.
  - `includeColors`: (`boolean`, default: `true`) Whether to include color detection in the output.
  - `customPrompt`: (`string`, optional) Custom OCR prompt to guide the AI model.
  - `timeout`: (`number`, default: `30000`) Request timeout in milliseconds.

- **Returns**: (`Promise<OCRResult | string>`) A promise that resolves to the OCR result.

#### `batchProcess(images: Array<string | Buffer>, options?: object, concurrency?: number): Promise<Array<OCRResult | string>>`

Processes multiple images in batch.

- `images`: (`Array<string | Buffer>`) An array of image paths, URLs, or Buffers.
- `options`: (`object`, optional) OCR options (same as `extractText`).
- `concurrency`: (`number`, default: `3`) Number of concurrent processing tasks.

- **Returns**: (`Promise<Array<OCRResult | string>>`) A promise that resolves to an array of OCR results for each image.

#### `extractFromRegions(imagePath: string | Buffer, regions: Array<{x: number, y: number, width: number, height: number}>, options?: object): Promise<Array<OCRResult | string>>`

Extracts text from specific regions of an image.

- `imagePath`: (`string | Buffer`) Path to image file, URL, or Buffer.
- `regions`: (`Array<{x: number, y: number, width: number, height: number}>`) An array of region objects, each with `x`, `y`, `width`, and `height` properties.
- `options`: (`object`, optional) OCR options (same as `extractText`).

- **Returns**: (`Promise<Array<OCRResult | string>>`) A promise that resolves to an array of OCR results for each specified region.

#### `getAvailableModels(): Promise<Array<string>>`

Retrieves a list of available AI models for the current provider.

- **Returns**: (`Promise<Array<string>>`) A promise that resolves to an array of model names.

#### `test(): Promise<object>`

Runs a self-test of the OCR functionality with a sample image.

- **Returns**: (`Promise<object>`) A promise that resolves to a test result object, indicating success/failure and other details.

## Data Structures

### `TahuOCRConfig`

Configuration object for the `TahuOCR` class.

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

Represents an individual text element extracted from the image.

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

The comprehensive result object returned by `extractText` when `format` is `'json'`.

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
