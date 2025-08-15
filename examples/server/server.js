import express from 'express';
import multer from 'multer';
import { createTahuOCR } from '../../src/index.js'; // Adjusted import path

const app = express();
const upload = multer(); // for parsing multipart/form-data
const port = process.env.PORT || 3000;

// Initialize TahuOCR (using OpenRouter for flexibility)
const ocr = createTahuOCR({
  provider: 'openrouter',
  apiKey: process.env.OPENROUTER_API_KEY,
  model: 'google/gemini-2.0-flash-exp:free',
  debug: false
});

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
  res.send('TahuOCR API is running. Use POST /api/ocr to process images.');
});

app.post('/api/ocr', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided.' });
    }

    const imageBuffer = req.file.buffer;
    const { provider, includeCoordinates, outputFormat, customPrompt } = req.body;

    // Validate provider if provided, otherwise use default
    const currentOcr = provider ? createTahuOCR({ provider, apiKey: process.env[`${provider.toUpperCase()}_API_KEY`] }) : ocr;

    const result = await currentOcr.extractText(imageBuffer, {
      format: outputFormat || 'json',
      includeColors: includeCoordinates === 'true',
      customPrompt: customPrompt || undefined
    });

    res.json(result);

  } catch (error) {
    console.error('OCR API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`TahuOCR API server listening at http://localhost:${port}`);
  console.log('Use POST /api/ocr with an image file and optional parameters.');
});