import { createTahuOCR } from '../../src/index.js'; // Updated import path

// Example 4: Ollama Configuration (Local)
const ocrOllama = createTahuOCR({
  provider: 'ollama',
  model: 'llava', // Local vision model
  ollamaBaseUrl: 'http://localhost:11434',
  debug: true
});

// Quick start function for new users (adapted for Ollama)
async function quickStartOllama() {
  console.log('🚀 TahuOCR Quick Start (Ollama)\n');
  
  try {
    console.log('1. Setting up TahuOCR...');
    
    // Check if Ollama base URL is set
    if (!ocrOllama.ollamaBaseUrl) {
      console.log('⚠️  Ollama base URL not configured. Please ensure ollamaBaseUrl is set.');
      return;
    }

    console.log('2. Running test...');
    const testResult = await ocrOllama.test();
    
    if (testResult.success) {
      console.log('✅ TahuOCR is working correctly with Ollama!');
      console.log(`   Provider: ${testResult.provider}`);
      console.log(`   Processing time: ${testResult.processingTime}ms`);
      
      console.log('\n3. Ready to use! Try these commands:');
      console.log('   - await ocrOllama.extractText("image.jpg", { format: "json" })');
      console.log('   - await ocrOllama.extractText("image.jpg", { format: "text" })');
      console.log('   - await ocrOllama.batchProcess(["img1.jpg", "img2.jpg"])');

    } else {
      console.error('❌ TahuOCR test failed with Ollama:', testResult.error);
    }

  } catch (error) {
    console.error('❌ Quick start failed with Ollama:', error.message);
  }
}

// Example: Simple Text Extraction (JSON Format) using ocrOllama
async function basicTextExtractionOllama() {
  console.log('🔍 Basic Text Extraction Example (Ollama)\n');
  
  try {
    // Extract text with detailed coordinates
    const result = await ocrOllama.extractText('./sample-images/document.jpg', {
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
  ocrOllama,
  quickStartOllama,
  basicTextExtractionOllama
};
