/**
 * Parses the AI response into a structured OCRResult object.
 * @param {string} aiResponse - The raw response string from the AI.
 * @param {Object} metadata - Metadata about the processed image.
 * @param {Object} originalMetadata - Metadata about the original image.
 * @param {number} startTime - The timestamp when OCR extraction started.
 * @param {function} log - Logging function.
 * @returns {OCRResult} The parsed OCR result.
 */
export function parseJSONResult(aiResponse, metadata, originalMetadata, startTime, log) {
  try {
    // Try to extract JSON from response
    let jsonStr = aiResponse.trim();
    
    // Remove markdown code blocks if present
    jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Find JSON object in response
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }

    const parsed = JSON.parse(jsonStr);
    
    // Validate and enhance the result
    const result = {
      rawText: parsed.rawText || '',
      elements: (parsed.elements || []).map((element, index) => ({
        text: element.text || '',
        coordinates: {
          x: Number(element.coordinates?.x) || 0,
          y: Number(element.coordinates?.y) || 0,
          width: Number(element.coordinates?.width) || 0,
          height: Number(element.coordinates?.height) || 0,
          centerX: Number(element.coordinates?.centerX) || Number(element.coordinates?.x) || 0,
          centerY: Number(element.coordinates?.centerY) || Number(element.coordinates?.y) || 0
        },
        confidence: Number(element.confidence) || 50,
        color: element.color || 'unknown',
        backgroundColor: element.backgroundColor || 'unknown',
        lineNumber: Number(element.lineNumber) || Math.floor(index / 10) + 1,
        wordIndex: Number(element.wordIndex) || (index % 10) + 1
      })),
      metadata: {
        totalElements: parsed.elements?.length || 0,
        averageConfidence: parsed.elements?.length ? 
          parsed.elements.reduce((sum, el) => sum + (Number(el.confidence) || 50), 0) / parsed.elements.length : 0,
        processingTimeMs: Date.now() - startTime,
        imageInfo: {
          width: originalMetadata.width,
          height: originalMetadata.height,
          format: originalMetadata.format,
          processedWidth: metadata.width,
          processedHeight: metadata.height
        }
      }
    };

    return result;

  } catch (parseError) {
    log('JSON parsing failed, creating fallback result:', parseError);
    
    // Fallback: treat as raw text
    return {
      rawText: aiResponse,
      elements: [{
        text: aiResponse,
        coordinates: { x: 0, y: 0, width: metadata.width, height: metadata.height, centerX: metadata.width/2, centerY: metadata.height/2 },
        confidence: 50,
        color: 'unknown',
        backgroundColor: 'unknown',
        lineNumber: 1,
        wordIndex: 1
      }],
      metadata: {
        totalElements: 1,
        averageConfidence: 50,
        processingTimeMs: Date.now() - startTime,
        imageInfo: {
          width: originalMetadata.width,
          height: originalMetadata.height,
          format: originalMetadata.format,
          processedWidth: metadata.width,
          processedHeight: metadata.height
        }
      }
    };
  }
}