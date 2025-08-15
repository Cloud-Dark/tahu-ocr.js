import { createTahuOCR } from '../../src/index.js'; // Updated import path

// Example 2: OpenAI Configuration
const ocrOpenAI = createTahuOCR({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4o-mini', // GPT-4 with vision
  debug: false
});

// Quick start function for new users (adapted for OpenAI)
async function quickStartOpenAI() {
  console.log('🚀 TahuOCR Quick Start (OpenAI)\n');
  
  try {
    console.log('1. Setting up TahuOCR...');
    
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.log('⚠️  No OPENAI_API_KEY found in environment variables.');
      console.log('   Please set OPENAI_API_KEY.');
      return;
    }

    console.log('2. Running test...');
    const testResult = await ocrOpenAI.test();
    
    if (testResult.success) {
      console.log('✅ TahuOCR is working correctly with OpenAI!');
      console.log(`   Provider: ${testResult.provider}`);
      console.log(`   Processing time: ${testResult.processingTime}ms`);
      
      console.log('\n3. Ready to use! Try these commands:');
      console.log('   - await ocrOpenAI.extractText("image.jpg", { format: "json" })');
      console.log('   - await ocrOpenAI.extractText("image.jpg", { format: "text" })');
      console.log('   - await ocrOpenAI.batchProcess(["img1.jpg", "img2.jpg"])');

    } else {
      console.error('❌ TahuOCR test failed with OpenAI:', testResult.error);
    }

  } catch (error) {
    console.error('❌ Quick start failed with OpenAI:', error.message);
  }
}

// Example: Simple Text Extraction (JSON Format) using ocrOpenAI
async function basicTextExtractionOpenAI() {
  console.log('🔍 Basic Text Extraction Example (OpenAI)\n');
  
  try {
    // Extract text with detailed coordinates
    const result = await ocrOpenAI.extractText('./sample-images/document.jpg', {
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

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

export {
  ocrOpenAI,
  quickStartOpenAI,
  basicTextExtractionOpenAI
};
