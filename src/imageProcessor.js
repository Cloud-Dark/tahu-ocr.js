import sharp from 'sharp';
import fs from 'fs/promises';
import axios from 'axios';

/**
 * Processes an image for OCR optimization.
 * @param {string|Buffer} imagePath - Path to image file, URL, or Buffer.
 * @param {Object} imageOptions - Image processing options.
 * @param {function} log - Logging function.
 * @returns {Promise<{buffer: Buffer, metadata: Object, originalMetadata: Object}>} Processed image buffer and metadata.
 * @throws {Error} If image processing fails.
 */
export async function processImage(imagePath, imageOptions, log) {
  try {
    log('Processing image:', imagePath);
    
    let imageBuffer;
    if (Buffer.isBuffer(imagePath)) {
      imageBuffer = imagePath;
    } else if (typeof imagePath === 'string' && imagePath.startsWith('http')) {
      // Download image from URL
      const response = await axios.get(imagePath, { responseType: 'arraybuffer' });
      imageBuffer = Buffer.from(response.data);
    } else if (typeof imagePath === 'string') {
      // Read from file path
      imageBuffer = await fs.readFile(imagePath);
    } else {
      throw new Error('Invalid imagePath type. Must be string (path/URL) or Buffer.');
    }

    // Get image metadata
    const metadata = await sharp(imageBuffer).metadata();
    log('Original image:', metadata);

    // Process image with Sharp
    let processedImage = sharp(imageBuffer);

    // Resize if too large
    const { maxWidth, maxHeight } = imageOptions;
    if (metadata.width > maxWidth || metadata.height > maxHeight) {
      processedImage = processedImage.resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // Apply enhancements
    if (imageOptions.normalize) {
      processedImage = processedImage.normalize();
    }

    if (imageOptions.sharpen) {
      processedImage = processedImage.sharpen();
    }

    // Convert to high-quality JPEG
    const processedBuffer = await processedImage
      .jpeg({ quality: imageOptions.quality })
      .toBuffer();

    const processedMetadata = await sharp(processedBuffer).metadata();
    log('Processed image:', processedMetadata);

    return {
      buffer: processedBuffer,
      metadata: processedMetadata,
      originalMetadata: metadata
    };
  } catch (error) {
    throw new Error(`Image processing failed: ${error.message}`);
  }
}