# Usage Guide for TahuOCR.js

This guide provides detailed instructions and examples on how to use TahuOCR.js for various OCR tasks.

## 3. Basic Usage

To get started with TahuOCR.js, import `createTahuOCR` and initialize it with your desired provider and API key.

```javascript
import { createTahuOCR } from 'tahu-ocr.js';

const ocr = createTahuOCR({
  provider: 'openrouter', // or 'openai', 'gemini', 'ollama'
  apiKey: process.env.OPENROUTER_API_KEY,
  model: 'google/gemini-2.0-flash-exp:free', // or other models
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
    console.error('OCR Error:', error.message);
  }
}

runOCR();
```

## 4. Running Examples

The `examples/` directory contains a variety of use cases demonstrating the capabilities of TahuOCR.js, including basic usage, advanced features, and a production-ready Express server.

To run the quick start example:

```bash
node example.js
```

This will execute a basic test and demonstrate core functionalities.

To run the Express server example:

```bash
npm install express multer # Install server dependencies
node examples/server.js
```

Once the server is running, you can test the API using `curl`:

```bash
curl -X POST http://localhost:3000/api/ocr \
  -F "image=@your-image.jpg" \
  -F "provider=openai" \
  -F "includeCoordinates=true"
```

