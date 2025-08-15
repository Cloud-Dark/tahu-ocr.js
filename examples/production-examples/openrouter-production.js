import { createTahuOCR } from '../../src/index.js';
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
 * Example 15: Production Document Processing Pipeline
 */
export async function productionPipeline() {
  console.log('🏭 Production Pipeline Example (OpenRouter)\n');
  
  try {
    const documentTypes = [
      {
        name: 'Invoice',
        path: './sample-images/invoice.jpg',
        extractFields: ['invoice_number', 'date', 'total_amount', 'vendor']
      },
      {
        name: 'Receipt',
        path: './sample-images/receipt.jpg', 
        extractFields: ['merchant', 'date', 'total', 'items']
      },
      {
        name: 'Business Card',
        path: './sample-images/business-card.jpg',
        extractFields: ['name', 'title', 'company', 'email', 'phone']
      }
    ];

    const processingResults = [];

    for (const doc of documentTypes) {
      console.log(`\n📄 Processing ${doc.name}...`);
      
      const startTime = Date.now();
      const result = await ocrOpenRouter.extractText(doc.path, {
        format: 'json',
        includeColors: true
      });
      const processingTime = Date.now() - startTime;

      // Analyze extracted data
      const analysis = {
        documentType: doc.name,
        processingTimeMs: processingTime,
        elementsFound: result.elements.length,
        averageConfidence: result.metadata.averageConfidence,
        textLength: result.rawText.length,
        colorsDetected: [...new Set(result.elements.map(el => el.color))].filter(c => c !== 'unknown'),
        highConfidenceElements: result.elements.filter(el => el.confidence > 90).length
      };

      processingResults.push(analysis);

      console.log(`   ✅ Completed in ${processingTime}ms`);
      console.log(`   📊 Elements: ${analysis.elementsFound}`);
      console.log(`   💯 Avg confidence: ${analysis.averageConfidence.toFixed(1)}%`);
      console.log(`   🎨 Colors: ${analysis.colorsDetected.join(', ')}`);
    }

    // Summary report
    console.log('\n📈 Pipeline Summary Report:');
    console.log(`   Total documents processed: ${processingResults.length}`);
    console.log(`   Average processing time: ${(processingResults.reduce((sum, r) => sum + r.processingTimeMs, 0) / processingResults.length).toFixed(0)}ms`);
    console.log(`   Overall confidence: ${(processingResults.reduce((sum, r) => sum + r.averageConfidence, 0) / processingResults.length).toFixed(1)}%`);

  } catch (error) {
    console.error('❌ Production pipeline error:', error.message);
  }
}

/**
 * Example 16: Real-time OCR with File Watching
 */
export async function realtimeOCRExample() {
  console.log('👁️ Real-time OCR Example (OpenRouter)\n');
  
  const watchDirectory = './watch-folder';
  
  // Create watch directory if it doesn't exist
  try {
    await fs.mkdir(watchDirectory, { recursive: true });
    console.log(`📁 Watching directory: ${watchDirectory}`);
    console.log('💡 Drop image files here for automatic OCR processing...');
    
    // Simple file watcher simulation (in production, use chokidar)
    const processFile = async (filename) => {
      const filePath = path.join(watchDirectory, filename);
      
      try {
        console.log(`\n🔍 Processing new file: ${filename}`);
        
        const result = await ocrOpenRouter.extractText(filePath, {
          format: 'json',
          includeColors: true
        });

        // Save results
        const resultPath = path.join(watchDirectory, `${filename}.ocr.json`);
        await fs.writeFile(resultPath, JSON.stringify(result, null, 2));
        
        console.log(`✅ OCR completed for ${filename}`);
        console.log(`   Elements found: ${result.elements.length}`);
        console.log(`   Results saved to: ${resultPath}`);
        console.log(`   Processing time: ${result.metadata.processingTimeMs}ms`);

      } catch (error) {
        console.error(`❌ Failed to process ${filename}:`, error.message);
      }
    };

    // Example: Process a sample file
    // await processFile('sample-document.jpg');
    
    console.log('\n💡 To use real-time watching, integrate with libraries like chokidar:');
    console.log('npm install chokidar');
    console.log(`
import chokidar from 'chokidar';

chokidar.watch('${watchDirectory}/*.{jpg,jpeg,png,gif,bmp,tiff}')
  .on('add', processFile)
  .on('change', processFile);
`);

  } catch (error) {
    console.error('❌ Real-time OCR setup error:', error.message);
  }
}

export {
  ocrOpenRouter,
  productionPipeline,
  realtimeOCRExample
};
