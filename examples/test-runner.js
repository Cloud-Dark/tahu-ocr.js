import { createTahuOCR } from '../src/index.js';
import { 
  basicTextExtractionOpenRouter,
  rawTextExtractionOpenRouter,
  urlImageProcessingOpenRouter,
  bufferProcessingOpenRouter,
  quickStartOpenRouter,
  ocrOpenRouter
} from './basic-usage/openrouter.js';
import { 
  quickStartOpenAI,
  basicTextExtractionOpenAI,
  ocrOpenAI
} from './basic-usage/openai.js';
import { 
  quickStartGemini,
  basicTextExtractionGemini,
  ocrGemini
} from './basic-usage/gemini.js';
import { 
  quickStartOllama,
  basicTextExtractionOllama,
  ocrOllama
} from './basic-usage/ollama.js';

import { 
  batchProcessingExample,
  regionBasedExtraction,
  customPromptExample
} from './advanced-usage/openrouter-advanced.js';
import { 
  multiProviderComparison
} from './advanced-usage/multi-provider-comparison.js';

import {
  idCardProcessing,
  tableDataExtraction,
  colorAnalysisExample
} from './specialized-cases/openrouter-specialized.js';

import {
  productionPipeline,
  realtimeOCRExample
} from './production-examples/openrouter-production.js';

/**
 * Example 12: Performance Testing
 */
export async function performanceTest() {
  console.log('⚡ Performance Test Example\n');
  
  const testImage = 'D:\\poject\\tahu-ocr.js\\examples\\file_for_ocr_test\\full_color.png';
  
  console.log('🧪 Running performance comparison...');
  
  const tests = [
    { name: 'JSON Format', options: { format: 'json', includeColors: true } },
    { name: 'Text Format', options: { format: 'text' } },
    { name: 'No Colors', options: { format: 'json', includeColors: false } }
  ];

  for (const test of tests) {
    try {
      const startTime = Date.now();
      const result = await ocrOpenRouter.extractText(testImage, test.options);
      const endTime = Date.now();
      
      console.log(`\n📈 ${test.name}:`);
      console.log(`   Time: ${endTime - startTime}ms`);
      if (result.elements) {
        console.log(`   Elements: ${result.elements.length}`);
        console.log(`   Confidence: ${result.metadata.averageConfidence.toFixed(1)}%`);
      } else {
        console.log(`   Text length: ${result.length} characters`);
      }

    } catch (error) {
      console.log(`❌ ${test.name}: ${error.message}`);
    }
  }
}

/**
 * Example 13: Error Handling and Validation
 */
export async function errorHandlingExample() {
  console.log('🛡️ Error Handling Example\n');
  
  // Test with invalid image
  try {
    await ocrOpenRouter.extractText('./non-existent-image.jpg');
  } catch (error) {
    console.log('✅ Correctly caught file not found error:', error.message);
  }

  // Test with invalid URL
  try {
    await ocrOpenRouter.extractText('https://invalid-url-that-does-not-exist.com/image.jpg');
  } catch (error) {
    console.log('✅ Correctly caught invalid URL error:', error.message);
  }

  // Test with corrupted buffer
  try {
    const corruptedBuffer = Buffer.from('not an image');
    await ocrOpenRouter.extractText(corruptedBuffer);
  } catch (error) {
    console.log('✅ Correctly caught corrupted image error:', error.message);
  }

  console.log('\n🛡️ Error handling is working correctly!');
}

/**
 * Example 14: Model Testing and Validation
 */
export async function modelTestingExample() {
  console.log('🧪 Model Testing Example\n');
  
  try {
    // Test the OCR functionality
    const testResult = await ocrOpenRouter.test();
    
    console.log('🧪 Test Results:');
    console.log(`   Success: ${testResult.success ? '✅' : '❌'}`);
    console.log(`   Provider: ${testResult.provider}`);
    console.log(`   Model: ${testResult.model}`);
    
    if (testResult.success) {
      console.log(`   Elements found: ${testResult.elementsFound}`);
      console.log(`   Processing time: ${testResult.processingTime}ms`);
      console.log(`   Raw text: "${testResult.rawText}"`);
    } else {
      console.log(`   Error: ${testResult.error}`);
    }

    // Get available models
    const models = await ocrOpenRouter.getAvailableModels();
    console.log(`\n📋 Available models for ${ocrOpenRouter.config.provider}:`);
    models.forEach(model => console.log(`   - ${model}`));

  } catch (error) {
    console.error('❌ Model testing error:', error.message);
  }
}

/**
 * Example: PDF Processing
 */
export async function pdfProcessingExample() {
  console.log('📄 PDF Processing Example\n');
  
  try {
    const pdfPath = 'D:\\poject\\tahu-ocr.js\\examples\\file_for_ocr_test\\PublicWaterMassMailing.pdf';
    
    const result = await ocrOpenRouter.extractText(pdfPath, {
      format: 'text'
    });

    console.log(`✅ Processed PDF from: ${pdfPath}`);
    console.log(`📊 Extracted text length: ${result.length} characters`);

  } catch (error) {
    console.error('❌ PDF processing error:', error.message);
  }
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  console.log('🥘 TahuOCR - Comprehensive Examples\n');
  console.log('=' .repeat(60) + '\n');

  const examples = [
    { name: 'Basic Text Extraction (OpenRouter)', fn: basicTextExtractionOpenRouter },
    { name: 'Raw Text Only (OpenRouter)', fn: rawTextExtractionOpenRouter },
    { name: 'URL Image Processing (OpenRouter)', fn: urlImageProcessingOpenRouter },
    { name: 'Buffer Processing (OpenRouter)', fn: bufferProcessingOpenRouter },
    { name: 'Batch Processing (OpenRouter)', fn: batchProcessingExample },
    { name: 'Region-based Extraction (OpenRouter)', fn: regionBasedExtraction },
    { name: 'Custom Prompt Usage (OpenRouter)', fn: customPromptExample },
    { name: 'Multi-Provider Comparison', fn: multiProviderComparison },
    { name: 'ID Card Processing (OpenRouter)', fn: idCardProcessing },
    { name: 'Table Data Extraction (OpenRouter)', fn: tableDataExtraction },
    { name: 'Color Analysis (OpenRouter)', fn: colorAnalysisExample },
    { name: 'Performance Testing (OpenRouter)', fn: performanceTest },
    { name: 'Error Handling (OpenRouter)', fn: errorHandlingExample },
    { name: 'Model Testing (OpenRouter)', fn: modelTestingExample },
    { name: 'Production Pipeline (OpenRouter)', fn: productionPipeline },
    { name: 'Real-time OCR (OpenRouter)', fn: realtimeOCRExample },
    { name: 'Quick Start (OpenRouter)', fn: quickStartOpenRouter },
    { name: 'Quick Start (OpenAI)', fn: quickStartOpenAI },
    { name: 'Quick Start (Gemini)', fn: quickStartGemini },
    { name: 'Quick Start (Ollama)', fn: quickStartOllama },
    { name: 'Basic Text Extraction (OpenAI)', fn: basicTextExtractionOpenAI },
    { name: 'Basic Text Extraction (Gemini)', fn: basicTextExtractionGemini },
    { name: 'Basic Text Extraction (Ollama)', fn: basicTextExtractionOllama },
    { name: 'PDF Processing', fn: pdfProcessingExample } // Added PDF processing example
  ];

  for (let i = 0; i < examples.length; i++) {
    const example = examples[i];
    console.log(`\n${i + 1}. ${example.name}`);
    console.log('-'.repeat(40));
    
    try {
      await example.fn();
    } catch (error) {
      console.error(`❌ Example "${example.name}" failed:`, error.message);
    }
    
    if (i < examples.length - 1) {
      console.log('\n' + '=' .repeat(60));
    }
  }

  console.log('\n🎉 All examples completed!');
}
