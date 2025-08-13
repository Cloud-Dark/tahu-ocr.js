# Installation Guide for TahuOCR.js

This guide will help you set up and run TahuOCR.js.

## 1. Clone the Repository (Optional, if you downloaded directly)

```bash
git clone https://github.com/your-repo/tahu-ocr.js.git
cd tahu-ocr.js
```

## 2. Install Dependencies

TahuOCR.js requires `axios`, `sharp`, and `form-data`.

```bash
npm install axios sharp form-data
```

## 3. Set up Environment Variables

Create a `.env` file in the root of the project by copying the `.env.example` file:

```bash
cp .env.example .env
```

Edit the newly created `.env` file and add your API keys for the AI providers you wish to use. At least one API key is required.

```
OPENROUTER_API_KEY=your_openrouter_key
OPENAI_API_KEY=your_openai_key  
GEMINI_API_KEY=your_gemini_key
```

**Note:** OpenRouter is recommended as it provides access to multiple models, including free ones like `google/gemini-2.0-flash-exp:free`.

## 4. Run Examples (Optional)

To run the comprehensive examples, execute the `example.js` file:

```bash
node example.js
```

This will run a quick start test and demonstrate basic usage. You can modify `example.js` to run all examples or specific ones.

## 5. Build the Library (for production use)

To build the library for production, use Rollup:

```bash
npm run build
```

The bundled output will be in the `dist/` directory.
