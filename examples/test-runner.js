import { createTahuOCR } from '../src/index.js';
import { 
  basicTextExtraction,
  rawTextExtraction,
  urlImageProcessing,
  bufferProcessing,
  createSampleImages,
  quickStart,
  ocrOpenRouter,
  ocrOpenAI,
  ocrGemini,
  ocrOllama
} from './basic-usage.js';
import { 
  batchProcessingExample,
  regionBasedExtraction,
  customPromptExample,
  multiProviderComparison
} from './advanced-usage.js';
import {
  idCardProcessing,
  tableDataExtraction,
  colorAnalysisExample
} from './specialized-cases.js';
import {
  productionPipeline,
  realtimeOCRExample
} from './production-examples.js';

/**
 * Example 12: Performance Testing
 */
export async function performanceTest() {
  console.log('⚡ Performance Test Example\n');
  
  const testImage = './sample-images/performance-test.jpg';
  
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
 * Run all examples
 */
export async function runAllExamples() {
  console.log('🥘 TahuOCR - Comprehensive Examples\n');
  console.log('=' .repeat(60) + '\n');

  const examples = [
    { name: 'Basic Text Extraction', fn: basicTextExtraction },
    { name: 'Raw Text Only', fn: rawTextExtraction },
    { name: 'URL Image Processing', fn: urlImageProcessing },
    { name: 'Buffer Processing', fn: bufferProcessing },
    { name: 'Batch Processing', fn: batchProcessingExample },
    { name: 'Region-based Extraction', fn: regionBasedExtraction },
    { name: 'Custom Prompt Usage', fn: customPromptExample },
    { name: 'Multi-Provider Comparison', fn: multiProviderComparison },
    { name: 'ID Card Processing', fn: idCardProcessing },
    { name: 'Table Data Extraction', fn: tableDataExtraction },
    { name: 'Color Analysis', fn: colorAnalysisExample },
    { name: 'Performance Testing', fn: performanceTest },
    { name: 'Error Handling', fn: errorHandlingExample },
    { name: 'Model Testing', fn: modelTestingExample },
    { name: 'Production Pipeline', fn: productionPipeline },
    { name: 'Real-time OCR', fn: realtimeOCRExample }
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
      console.log('\n' + '='.repeat(60));
    }
  }

  console.log('\n🎉 All examples completed!');
}
