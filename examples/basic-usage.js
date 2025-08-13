// ============================================================================ 
// 🥘 TahuOCR - Examples & Usage Guide
// ============================================================================ 
// Comprehensive examples showing how to use TahuOCR in different scenarios
// ============================================================================ 

import { createTahuOCR } from '../src/index.js'; // Updated import path
import fs from 'fs/promises';
import path from 'path';

// ============================================================================ 
// 📝 BASIC CONFIGURATION EXAMPLES
// ============================================================================ 

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

// Example 2: OpenAI Configuration
const ocrOpenAI = createTahuOCR({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4o-mini', // GPT-4 with vision
  debug: false
});

// Example 3: Google Gemini Configuration
const ocrGemini = createTahuOCR({
  provider: 'gemini',
  apiKey: process.env.GEMINI_API_KEY,
  model: 'gemini-2.0-flash-exp',
  debug: false
});

// Example 4: Ollama Configuration (Local)
const ocrOllama = createTahuOCR({
  provider: 'ollama',
  model: 'llava', // Local vision model
  ollamaBaseUrl: 'http://localhost:11434',
  debug: true
});

// ============================================================================ 
// 🎯 BASIC USAGE EXAMPLES
// ============================================================================ 

/**
 * Example 1: Simple Text Extraction (JSON Format)
 */
async function basicTextExtraction() {
  console.log('🔍 Basic Text Extraction Example\n');
  
  try {
    // Extract text with detailed coordinates
    const result = await ocrOpenRouter.extractText('./sample-images/document.jpg', {
      format: 'json',
      includeColors: true
    });

    console.log('📄 Raw Text:');
    console.log(result.rawText);
    console.log('\n📍 Detailed Elements:');
    
    result.elements.forEach((element, index) => {
      console.log(`Element ${index + 1}:`);
      console.log(`  Text: "${element.text}"`);
      console.log(`  Position: (${element.coordinates.x}, ${element.coordinates.y})`);
      console.log(`  Size: ${element.coordinates.width}x${element.coordinates.height}`);
      console.log(`  Center: (${element.coordinates.centerX}, ${element.coordinates.centerY})`);
      console.log(`  Confidence: ${element.confidence}%`);
      console.log(`  Color: ${element.color}`);
      console.log(`  Line: ${element.lineNumber}, Word: ${element.wordIndex}`);
      console.log('');
    });

    console.log('📊 Metadata:');
    console.log(`  Total Elements: ${result.metadata.totalElements}`);
    console.log(`  Average Confidence: ${result.metadata.averageConfidence.toFixed(1)}%`);
    console.log(`  Processing Time: ${result.metadata.processingTimeMs}ms`);
    console.log(`  Image Size: ${result.metadata.imageInfo.width}x${result.metadata.imageInfo.height}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

/**
 * Example 2: Raw Text Only (Text Format)
 */
async function rawTextExtraction() {
  console.log('📝 Raw Text Extraction Example\n');
  
  try {
    const text = await ocrOpenRouter.extractText('./sample-images/receipt.jpg', {
      format: 'text'
    });

    console.log('📄 Extracted Text:');
    console.log(text);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

/**
 * Example 3: URL Image Processing
 */
async function urlImageProcessing() {
  console.log('🌐 URL Image Processing Example\n');
  
  try {
    const imageUrl = 'https://example.com/sample-text-image.jpg';
    
    const result = await ocrOpenRouter.extractText(imageUrl, {
      format: 'json',
      includeColors: true,
      timeout: 45000 // Longer timeout for URL processing
    });

    console.log(`🔗 Processed image from URL: ${imageUrl}`);
    console.log(`📊 Found ${result.elements.length} text elements`);
    console.log(`⏱️ Processing time: ${result.metadata.processingTimeMs}ms`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

/**
 * Example 4: Buffer Processing
 */
async function bufferProcessing() {
  console.log('💾 Buffer Processing Example\n');
  
  try {
    const imageBuffer = await fs.readFile('./sample-images/business-card.jpg');
    
    const result = await ocrOpenRouter.extractText(imageBuffer, {
      format: 'json',
      includeColors: true
    });

    console.log('💳 Business Card OCR Results:');
    console.log(`📊 Elements found: ${result.elements.length}`);
    
    // Filter and categorize common business card elements
    const emails = result.elements.filter(el => 
      el.text.includes('@') && el.text.includes('.')
    );
    const phones = result.elements.filter(el => 
      /[\d\s\-\(\)]{10,}/.test(el.text)
    );

    if (emails.length > 0) {
      console.log('📧 Emails found:');
      emails.forEach(email => console.log(`  - ${email.text}`));
    }

    if (phones.length > 0) {
      console.log('📞 Phone numbers found:');
      phones.forEach(phone => console.log(`  - ${phone.text}`));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// ============================================================================ 
// 📦 UTILITY FUNCTIONS
// ============================================================================ 

/**
 * Create sample test images for demonstration
 */
async function createSampleImages() {
  const sampleDir = './sample-images';
  
  try {
    await fs.mkdir(sampleDir, { recursive: true });
    console.log(`📁 Created sample images directory: ${sampleDir}`);
    
    // This would create sample images in a real implementation
    console.log('💡 Add your test images to this directory:');
    console.log('   - document.jpg (general document)');
    console.log('   - receipt.jpg (receipt/invoice)');
    console.log('   - business-card.jpg (business card)');
    console.log('   - id-card.jpg (ID card/license)');
    console.log('   - data-table.jpg (table data)');
    console.log('   - colorful-document.jpg (document with colors)');
    
  } catch (error) {
    console.error('Failed to create sample images directory:', error);
  }
}

/**
 * Quick start function for new users
 */
async function quickStart() {
  console.log('🚀 TahuOCR Quick Start\n');
  
  try {
    console.log('1. Setting up TahuOCR...');
    
    // Check if API key is available
    if (!process.env.OPENROUTER_API_KEY && !process.env.OPENAI_API_KEY && !process.env.GEMINI_API_KEY) {
      console.log('⚠️  No API keys found in environment variables.');
      console.log('   Please set one of the following:');
      console.log('   - OPENROUTER_API_KEY (recommended)');
      console.log('   - OPENAI_API_KEY');
      console.log('   - GEMINI_API_KEY');
      return;
    }

    console.log('2. Running test...');
    const testResult = await ocrOpenRouter.test();
    
    if (testResult.success) {
      console.log('✅ TahuOCR is working correctly!');
      console.log(`   Provider: ${testResult.provider}`);
      console.log(`   Processing time: ${testResult.processingTime}ms`);
      
      console.log('\n3. Ready to use! Try these commands:');
      console.log('   - await ocr.extractText("image.jpg", { format: "json" })');
      console.log('   - await ocr.extractText("image.jpg", { format: "text" })');
      console.log('   - await ocr.batchProcess(["img1.jpg", "img2.jpg"])');

    } else {
      console.log('❌ TahuOCR test failed:', testResult.error);
    }

  } catch (error) {
    console.error('❌ Quick start failed:', error.message);
  }
}

// ============================================================================ 
// 🎯 EXPORT EVERYTHING
// ============================================================================ 

export {
  ocrOpenRouter, // Export the configured OCR instance for use in other examples
  ocrOpenAI,
  ocrGemini,
  ocrOllama,
  basicTextExtraction,
  rawTextExtraction,
  urlImageProcessing,
  bufferProcessing,
  createSampleImages,
  quickStart
};