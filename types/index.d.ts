/**
 * TahuOCR Configuration Interface
 */
export type TahuOCRConfig = {
  provider: 'openrouter'|'openai'|'gemini'|'ollama';
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

/**
 * OCR Text Element Interface
 */
export type OCRTextElement = {
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

/**
 * OCR Result Interface
 */
export type OCRResult = {
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
