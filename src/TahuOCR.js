// ============================================================================ 
// 🥘 TahuOCR - Advanced AI OCR Library with TahuJS Integration
// ============================================================================ 
// A comprehensive OCR library with AI-powered text detection and extraction
// Supports multiple AI providers through TahuJS integration
// Features: Coordinate detection, color analysis, batch processing
// ============================================================================ 

import { createTahu } from 'tahu.js';
import sharp from 'sharp'; // Still needed for test method
import { validateConfig, getDefaultModel, log as configLog } from './config.js';
import { processImage as imageProcessor } from './imageProcessor.js';
import { createOCRPrompt } from './promptGenerator.js';
import { parseJSONResult } from './resultParser.js';

/**
 * TahuOCR Configuration Interface
 * @typedef {Object} TahuOCRConfig
 * @property {'openrouter'|'openai'|'gemini'|'ollama'} provider - AI provider
 * @property {string} apiKey - API key for the provider
 * @property {string} [model] - Specific model to use
 * @property {string} [ollamaBaseUrl] - Base URL for Ollama (if using Ollama)
 * @property {boolean} [debug=false] - Enable debug logging
 * @property {Object} [imageOptions] - Image processing options
 * @property {number} [imageOptions.maxWidth=2048] - Maximum image width
 * @property {number} [imageOptions.maxHeight=2048] - Maximum image height
 * @property {number} [imageOptions.quality=90] - JPEG quality (1-100)
 * @property {boolean} [imageOptions.sharpen=true] - Apply sharpening filter
 * @property {boolean} [imageOptions.normalize=true] - Normalize brightness/contrast
 */

/**
 * OCR Result Interface
 * @typedef {Object} OCRTextElement
 * @property {string} text - Extracted text
 * @property {Object} coordinates - Position coordinates
 * @property {number} coordinates.x - X position (left)
 * @property {number} coordinates.y - Y position (top)
 * @property {number} coordinates.width - Width of text block
 * @property {number} coordinates.height - Height of text block
 * @property {number} coordinates.centerX - Center X coordinate
 * @property {number} coordinates.centerY - Center Y coordinate
 * @property {number} confidence - Confidence score (0-100)
 * @property {string} [color] - Detected text color
 * @property {string} [backgroundColor] - Background color behind text
 * @property {number} lineNumber - Line number in document
 * @property {number} wordIndex - Word index in line
 */

/**
 * OCR Result
 * @typedef {Object} OCRResult
 * @property {string} rawText - Complete raw text
 * @property {OCRTextElement[]} elements - Individual text elements
 * @property {Object} metadata - Processing metadata
 * @property {number} metadata.totalElements - Total text elements found
 * @property {number} metadata.averageConfidence - Average confidence score
 * @property {number} metadata.processingTimeMs - Processing time in milliseconds
 * @property {Object} metadata.imageInfo - Original image information
 * @property {number} metadata.imageInfo.width - Image width
 * @property {number} metadata.imageInfo.height - Image height
 * @property {string} metadata.imageInfo.format - Image format
 */

class TahuOCR {
  /**
   * Create TahuOCR instance
   * @param {TahuOCRConfig} config - Configuration object
   */
  constructor(config) {
    validateConfig(config);
    
    this.config = {
      debug: false,
      imageOptions: {
        maxWidth: 2048,
        maxHeight: 2048,
        quality: 90,
        sharpen: true,
        normalize: true
      },
      ...config
    };

    // Initialize TahuJS
    this.tahu = createTahu({
      provider: this.config.provider,
      apiKey: this.config.apiKey,
      model: this.config.model || getDefaultModel(this.config.provider),
      ollamaBaseUrl: this.config.ollamaBaseUrl,
      temperature: 0.1, // Low temperature for consistent OCR results
    });

    this.log('TahuOCR initialized with provider:', this.config.provider);
  }

  /**
   * Debug logging
   * @private
   */
  log(...args) {
    configLog(this.config.debug, ...args);
  }

  /**
   * Extract text from image using AI
   * @param {string|Buffer} imagePath - Path to image file, URL, or Buffer
   * @param {Object} [options] - OCR options
   * @param {'json'|'text'} [options.format='json'] - Output format
   * @param {boolean} [options.includeColors=true] - Include color detection
   * @param {string} [options.customPrompt] - Custom OCR prompt
   * @param {number} [options.timeout=30000] - Request timeout in ms
   * @returns {Promise<OCRResult|string>} OCR result
   */
  async extractText(imagePath, options = {}) {
    const startTime = Date.now();
    
    try {
      const {
        format = 'json',
        includeColors = true,
        customPrompt,
        timeout = 30000
      } = options;

      this.log('Starting OCR extraction...');

      // Process image
      const { buffer, metadata, originalMetadata } = await imageProcessor(imagePath, this.config.imageOptions, this.log.bind(this));

      // Convert image to base64
      const base64Image = buffer.toString('base64');
      const mimeType = `image/${metadata.format}`;
      const dataUri = `data:${mimeType};base64,${base64Image}`;

      // Create prompt
      const prompt = customPrompt || createOCRPrompt(format, { includeColors });

      this.log('Sending to AI provider...');

      // Send to TahuJS with vision capabilities
      let result;
      try {
        // Create a specialized OCR agent for this task
        const ocrAgent = this.tahu.builder()
          .name('TahuOCRAgent')
          .systemPrompt(prompt)
          .build();

        // For vision models, we need to format the input properly
        const visionInput = `Please analyze this image and extract all text with coordinates.\n\nImage: ${dataUri}`;
        
        const response = await Promise.race([
          this.tahu.runAgent('TahuOCRAgent', visionInput),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('OCR timeout')), timeout)
          )
        ]);

        result = response.response;
        
      } catch (error) {
        this.log('Agent approach failed, trying direct chat:', error.message);
        
        // Fallback to direct chat
        const response = await Promise.race([
          this.tahu.chat(prompt + `\n\nImage: ${dataUri}`),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('OCR timeout')), timeout)
          )
        ]);

        result = response.response;
      }

      this.log('AI response received');

      // Process result based on format
      if (format === 'json') {
        const ocrResult = parseJSONResult(result, metadata, originalMetadata, startTime, this.log.bind(this));
        this.log(`OCR completed: ${ocrResult.elements.length} elements found`);
        return ocrResult;
      } else {
        this.log('OCR completed (text format)');
        return result.trim();
      }

    } catch (error) {
      this.log('OCR extraction failed:', error);
      throw new Error(`OCR extraction failed: ${error.message}`);
    }
  }

  /**
   * Process multiple images in batch
   * @param {Array<string|Buffer>} images - Array of image paths, URLs, or Buffers
   * @param {Object} [options] - OCR options (same as extractText)
   * @param {number} [concurrency=3] - Number of concurrent processing
   * @returns {Promise<Array<OCRResult|string>>} Array of OCR results
   */
  async batchProcess(images, options = {}, concurrency = 3) {
    if (!Array.isArray(images)) {
      throw new Error('Images must be an array');
    }

    this.log(`Starting batch processing of ${images.length} images with concurrency ${concurrency}`);

    const results = [];
    const batches = [];

    // Split into batches
    for (let i = 0; i < images.length; i += concurrency) {
      batches.push(images.slice(i, i + concurrency));
    }

    // Process batches
    for (const batch of batches) {
      const batchPromises = batch.map(async (image, index) => {
        try {
          this.log(`Processing batch item ${index + 1}/${batch.length}`);
          return await this.extractText(image, options);
        } catch (error) {
          this.log(`Batch item ${index + 1} failed:`, error.message);
          return { error: error.message, image };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    this.log(`Batch processing completed: ${results.length} results`);
    return results;
  }

  /**
   * Extract text from specific regions of an image
   * @param {string|Buffer} imagePath - Path to image file, URL, or Buffer
   * @param {Array<{x: number, y: number, width: number, height: number}>} regions - Regions to extract
   * @param {Object} [options] - OCR options
   * @returns {Promise<Array<OCRResult|string>>} OCR results for each region
   */
  async extractFromRegions(imagePath, regions, options = {}) {
    if (!Array.isArray(regions)) {
      throw new Error('Regions must be an array');
    }

    this.log(`Extracting text from ${regions.length} regions`);

    // Process the original image
    const { buffer } = await imageProcessor(imagePath, this.config.imageOptions, this.log.bind(this));

    const results = [];

    for (let i = 0; i < regions.length; i++) {
      const region = regions[i];
      this.log(`Processing region ${i + 1}/${regions.length}:`, region);

      try {
        // Extract region from image
        const regionBuffer = await sharp(buffer)
          .extract({
            left: Math.max(0, Math.floor(region.x)),
            top: Math.max(0, Math.floor(region.y)),
            width: Math.max(1, Math.floor(region.width)),
            height: Math.max(1, Math.floor(region.height))
          })
          .toBuffer();

        // Extract text from region
        const result = await this.extractText(regionBuffer, options);
        results.push(result);

      } catch (error) {
        this.log(`Region ${i + 1} extraction failed:`, error.message);
        results.push({ error: error.message, region });
      }
    }

    return results;
  }

  /**
   * Get available AI models for the current provider
   * @returns {Promise<Array<string>>} Array of available model names
   */
  async getAvailableModels() {
    try {
      // This would depend on the provider's API to list models
      // For now, return common models based on provider
      const modelsByProvider = {
        openrouter: [
          'google/gemini-2.0-flash-exp:free',
          'anthropic/claude-3-sonnet',
          'openai/gpt-4o-mini',
          'meta-llama/llama-3.2-90b-vision-instruct'
        ],
        openai: [
          'gpt-4o',
          'gpt-4o-mini',
          'gpt-4-turbo'
        ],
        gemini: [
          'gemini-2.0-flash-exp',
          'gemini-1.5-pro',
          'gemini-1.5-flash'
        ],
        ollama: [
          'llava',
          'llava:13b',
          'llava:34b',
          'bakllava'
        ]
      };

      return modelsByProvider[this.config.provider] || [];
    } catch (error) {
      this.log('Failed to get available models:', error);
      return [];
    }
  }

  /**
   * Test OCR functionality with a sample
   * @returns {Promise<Object>} Test result
   */
  async test() {
    try {
      this.log('Running OCR test...');
      
      // Create a simple test image with text
      const testImageBuffer = await sharp({
        create: {
          width: 400,
          height: 200,
          channels: 3,
          background: { r: 255, g: 255, b: 255 }
        }
      })
      .composite([
        {
          input: Buffer.from(`
            <svg width="400" height="200">
              <text x="50" y="50" font-family="Arial" font-size="20" fill="black">Test OCR Text</text>
              <text x="50" y="100" font-family="Arial" font-size="16" fill="blue">Line 2: Blue Text</text>
              <text x="50" y="150" font-family="Arial" font-size="14" fill="red">Line 3: Red Text</text>
            </svg>
          `),
          top: 0,
          left: 0
        }
      ])
      .png()
      .toBuffer();

      const result = await this.extractText(testImageBuffer, { format: 'json' });

      return {
        success: true,
        provider: this.config.provider,
        model: this.config.model,
        elementsFound: result.elements.length,
        rawText: result.rawText,
        processingTime: result.metadata.processingTimeMs
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        provider: this.config.provider
      };
    }
  }
}

// Export the class and utility functions
export { TahuOCR };

// Convenience function to create TahuOCR instance
export function createTahuOCR(config) {
  return new TahuOCR(config);
}

// Default export
export default TahuOCR;