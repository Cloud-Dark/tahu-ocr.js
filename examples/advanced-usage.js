import { createTahuOCR } from '../src/index.js';
import fs from 'fs/promises';
import path from 'path';

// Example 1: OpenRouter Configuration (Recommended - Access to multiple models)
const ocrOpenRouter = createTahuOCR({
  provider: 'openrouter',
  apiKey: process.env.OPENROUTER_API_KEY,
  model: 'google/gemini-2.0-flash-exp:free', // Free model with vision capabilities
  debug: true, // Enable logging
  imageOptions: {
    maxWidth: 2048,
    maxHeight: 2048,
    quality: 95,
    sharpen: true,
    normalize: true
  }
});

/**
 * Example 5: Batch Processing Multiple Images
 */
export async function batchProcessingExample() {
  console.log('📦 Batch Processing Example\n');
  
  try {
    const imagePaths = [
      './sample-images/invoice1.jpg',
      './sample-images/invoice2.jpg',
      './sample-images/invoice3.jpg',
      './sample-images/receipt1.jpg',
      './sample-images/receipt2.jpg'
    ];

    const results = await ocrOpenRouter.batchProcess(imagePaths, {
      format: 'json',
      includeColors: true
    }, 2); // Process 2 images concurrently

    console.log(`📊 Batch Results: ${results.length} images processed`);
    
    results.forEach((result, index) => {
      if (result.error) {
        console.log(`❌ Image ${index + 1}: Error - ${result.error}`);
      } else {
        console.log(`✅ Image ${index + 1}: ${result.elements.length} elements found`);
        console.log(`   Average confidence: ${result.metadata.averageConfidence.toFixed(1)}%`);
      }
    });

  } catch (error) {
    console.error('❌ Batch processing error:', error.message);
  }
}

/**
 * Example 6: Region-based Extraction
 */
export async function regionBasedExtraction() {
  console.log('📋 Region-based Extraction Example\n');
  
  try {
    // Define specific regions to extract (e.g., header, body, footer)
    const regions = [
      { x: 0, y: 0, width: 800, height: 100 },      // Header region
      { x: 0, y: 100, width: 800, height: 400 },    // Body region
      { x: 0, y: 500, width: 800, height: 100 }     // Footer region
    ];

    const results = await ocrOpenRouter.extractFromRegions(
      './sample-images/structured-document.jpg',
      regions,
      { format: 'json' }
    );

    console.log('📄 Document Structure Analysis:');
    const regionNames = ['Header', 'Body', 'Footer'];
    
    results.forEach((result, index) => {
      if (result.error) {
        console.log(`❌ ${regionNames[index]}: Error - ${result.error}`);
      } else {
        console.log(`
📍 ${regionNames[index]} Region:`);
        console.log(`   Text: "${result.rawText.substring(0, 100)}"...`);
        console.log(`   Elements: ${result.elements.length}`);
      }
    });

  } catch (error) {
    console.error('❌ Region extraction error:', error.message);
  }
}

/**
 * Example 7: Custom Prompt for Specific Use Cases
 */
export async function customPromptExample() {
  console.log('🎯 Custom Prompt Example\n');
  
  try {
    // Custom prompt for invoice processing
    const invoicePrompt = `You are an expert invoice OCR system. Extract all text from this invoice image with precise coordinates.

Pay special attention to:
- Invoice number and date
- Vendor/supplier information  
- Line items with quantities and prices
- Tax amounts and totals
- Payment terms

For each text element, provide:
- Exact text content
- Precise X,Y coordinates and dimensions
- Confidence level
- Text color if detectable
- Line and word positioning

Return results in JSON format with the structure specified in your training.`;

    const result = await ocrOpenRouter.extractText('./sample-images/invoice.jpg', {
      format: 'json',
      customPrompt: invoicePrompt,
      includeColors: true
    });

    console.log('🧾 Invoice OCR Results:');
    console.log(`📊 Total elements: ${result.elements.length}`);
    console.log(`💯 Average confidence: ${result.metadata.averageConfidence.toFixed(1)}%`);
    
    // Find potential invoice numbers
    const invoiceNumbers = result.elements.filter(el => 
      /inv|invoice|#/i.test(el.text) || /\d{4,}/g.test(el.text)
    );
    
    if (invoiceNumbers.length > 0) {
      console.log('\n🔢 Potential Invoice Numbers:');
      invoiceNumbers.forEach(inv => {
        console.log(`  - "${inv.text}" at (${inv.coordinates.x}, ${inv.coordinates.y})`);
      });
    }

  } catch (error) {
    console.error('❌ Custom prompt error:', error.message);
  }
}

/**
 * Example 8: Multi-Provider Comparison
 */
export async function multiProviderComparison() {
  console.log('🔄 Multi-Provider Comparison Example\n');
  
  const providers = [
    {
      name: 'OpenRouter (Gemini)',
      ocr: createTahuOCR({
        provider: 'openrouter',
        apiKey: process.env.OPENROUTER_API_KEY,
        model: 'google/gemini-2.0-flash-exp:free'
      })
    },
    {
      name: 'OpenAI',
      ocr: createTahuOCR({
        provider: 'openai',
        apiKey: process.env.OPENAI_API_KEY,
        model: 'gpt-4o-mini'
      })
    },
    {
      name: 'Gemini Direct',
      ocr: createTahuOCR({
        provider: 'gemini',
        apiKey: process.env.GEMINI_API_KEY,
        model: 'gemini-2.0-flash-exp'
      })
    }
  ];

  const testImage = './sample-images/test-document.jpg';
  
  console.log('🧪 Testing same image with different providers...\n');

  for (const { name, ocr } of providers) {
    try {
      console.log(`Testing ${name}...`);
      const startTime = Date.now();
      
      const result = await ocr.extractText(testImage, { format: 'json' });
      const endTime = Date.now();
      
      console.log(`✅ ${name} Results:`);
      console.log(`   Elements found: ${result.elements.length}`);
      console.log(`   Average confidence: ${result.metadata.averageConfidence.toFixed(1)}%`);
      console.log(`   Processing time: ${endTime - startTime}ms`);
      console.log(`   Raw text length: ${result.rawText.length} characters`);
      console.log('');

    } catch (error) {
      console.log(`❌ ${name} failed: ${error.message}\n`);
    }
  }
}
