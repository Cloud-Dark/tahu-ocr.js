# tahu-ocr.js

A powerful AI-powered OCR library for Node.js, supporting multiple AI providers (OpenAI, Gemini, OpenRouter, Ollama) and capable of extracting text from various languages with precise coordinates, color detection, and advanced image processing.

## ✨ Features

-   **Multi-Provider Support**: OpenAI GPT-4 Vision, Google Gemini, OpenRouter, Ollama.
-   **Precise Coordinate Detection**: Extracts X, Y coordinates, width, height, and line numbers for text elements.
-   **Flexible Output**: Structured JSON or raw text.
-   **Image Enhancement**: Automatic resizing, sharpening, and normalization.
-   **Advanced Capabilities**: Batch processing, custom prompts, comprehensive error handling, TypeScript support.
-   **Production Ready**: Includes an Express.js server example.

## 🚀 Installation

Install the library and its peer dependencies:

```bash
npm install tahu-ocr.js axios sharp form-data
```

**Node.js Version Requirement**: Tahu-OCR.js requires Node.js versions 17, 18, 19, or 20. Newer or older versions are not supported due to dependencies that are only compatible with this range.

Set up your environment variables by copying `.env.example` to `.env` and adding your API keys.

## 📚 Documentation

For detailed installation instructions, comprehensive usage guides, API reference, advanced topics, and contribution guidelines, please refer to our full documentation:

-   [**English Documentation**](docs/en/index.md)
-   [**Dokumentasi Bahasa Indonesia**](docs/id/index.md)

## 💎 Why TahuOCR.js?

-   **🎯 Accurate**: Leverages multiple AI providers for optimal results.
-   **📍 Precise**: Detailed X,Y coordinates for every text element.
-   **⚡ Fast**: Image optimization and batch processing for efficiency.
-   **🔒 Secure**: Designed with security considerations for production environments.
-   **🛠️ Flexible**: Adaptable to various OCR needs with custom prompts and output formats.
-   **📱 Production Ready**: Includes server examples and robust error handling.
-   **📚 Well Documented**: Comprehensive guides and examples to get you started.

## 🎉 Ready to Use!

`tahu-ocr.js` is production-ready and suitable for a wide range of OCR applications, including document processing, invoice extraction, ID card scanning, receipt processing, table data extraction, and business card scanning.
