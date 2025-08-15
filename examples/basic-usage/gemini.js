import { createTahuOCR } from '../../src/index.js'; // Updated import path
import fs from 'fs/promises';
import path from 'path';

// Example 3: Google Gemini Configuration
const ocrGemini = createTahuOCR({
  provider: 'gemini',
  apiKey: process.env.GEMINI_API_KEY, // Replace with your actual Gemini API key
  model: 'gemini-2.0-flash-exp',
  debug: true
});

// Quick start function for new users (adapted for Gemini)
async function quickStartGemini() {
  console.log('🚀 TahuOCR Quick Start (Gemini)\n');
  
  try {
    console.log('1. Setting up TahuOCR...');
    
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.log('⚠️  No GEMINI_API_KEY found in environment variables.');
      console.log('   Please set GEMINI_API_KEY.');
      return;
    }

    console.log('2. Running test...');
    const testResult = await ocrGemini.test();
    
    if (testResult.success) {
      console.log('✅ TahuOCR is working correctly with Gemini!');
      console.log(`   Provider: ${testResult.provider}`);
      console.log(`   Processing time: ${testResult.processingTime}ms`);
      
      console.log('\n3. Ready to use! Try these commands:');
      console.log('   - await ocrGemini.extractText("image.jpg", { format: "json" })');
      console.log('   - await ocrGemini.extractText("image.jpg", { format: "text" })');
      console.log('   - await ocrGemini.batchProcess(["img1.jpg", "img2.jpg"])');

    } else {
      console.error('❌ TahuOCR test failed with Gemini:', testResult.error);
    }

  } catch (error) {
    console.error('❌ Quick start failed with Gemini:', error.message);
  }
}

// Example: Simple Text Extraction (JSON Format) using ocrGemini
async function basicTextExtractionGemini() {
  console.log('🔍 Basic Text Extraction Example (Gemini)\n');
  
  try {
    // Extract text with detailed coordinates
    const result = await ocrGemini.extractText('../file_for_ocr_test/full_color.png', {
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

// Example: Raw Text Only (Text Format) using ocrGemini
async function rawTextExtractionGemini() {
  console.log('📝 Raw Text Extraction Example (Gemini)\n');
  
  try {
    const text = await ocrGemini.extractText('../file_for_ocr_test/full_color.png', {
      format: 'text'
    });

    console.log('📄 Extracted Text:');
    console.log(text);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Example: URL Image Processing using ocrGemini
async function urlImageProcessingGemini() {
  console.log('🌐 URL Image Processing Example (Gemini)\n');
  
  try {
    const imageUrl = '../examples/file_for_ocr_test/full_color.png';
    
    const result = await ocrGemini.extractText(imageUrl, {
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

// Example: Buffer Processing using ocrGemini
async function bufferProcessingGemini() {
  console.log('💾 Buffer Processing Example (Gemini)\n');
  
  try {
    const imageBuffer = await fs.readFile('../file_for_ocr_test/full_color.png');
    
    const result = await ocrGemini.extractText(imageBuffer, {
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
      /[\d\s\-\(]{10,}/.test(el.text)
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

export {
  ocrGemini,
  quickStartGemini,
  basicTextExtractionGemini,
  rawTextExtractionGemini,
  urlImageProcessingGemini,
  bufferProcessingGemini
};

basicTextExtractionGemini(); // Added this line to run the example
