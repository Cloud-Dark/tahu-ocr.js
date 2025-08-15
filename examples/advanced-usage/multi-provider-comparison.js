import { createTahuOCR } from '../../src/index.js';

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

export {
  multiProviderComparison
};
