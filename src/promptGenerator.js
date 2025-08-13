/**
 * Creates an OCR prompt based on the desired output format and options.
 * @param {'json'|'text'} [outputFormat='json'] - The desired output format.
 * @param {Object} [options] - Additional options for prompt generation.
 * @param {boolean} [options.includeColors=true] - Whether to include color detection instructions.
 * @returns {string} The generated OCR prompt.
 */
export function createOCRPrompt(outputFormat = 'json', options = {}) {
  const basePrompt = `You are an advanced OCR (Optical Character Recognition) AI system. Analyze the provided image and extract ALL visible text with precise coordinate information.\n\nIMPORTANT REQUIREMENTS:\n1. Extract EVERY piece of text visible in the image, no matter how small\n2. Provide precise X,Y coordinates for each text element\n3. Calculate accurate width and height for each text block\n4. Estimate confidence scores for each text element\n5. Detect text colors when possible\n6. Assign line numbers and word indices\n7. Handle multiple languages and fonts\n8. Preserve original text formatting and spacing\n\nCOORDINATE SYSTEM:\n- Origin (0,0) is at top-left corner of the image\n- X increases going right\n- Y increases going down\n- All coordinates should be in pixels`;

  const colorDetection = options.includeColors !== false ? `\n9. COLOR ANALYSIS:\n   - Detect the primary color of each text element\n   - Identify background color behind text when possible\n   - Use standard color names (red, blue, green, etc.) or hex codes\n   - If color cannot be determined, use "unknown"` : '';

  if (outputFormat === 'json') {
    return basePrompt + colorDetection + `\n\nOUTPUT FORMAT: Return ONLY a valid JSON object with this exact structure:\n{\n  "rawText": "[Concatenated text from all elements]",\n  "elements": [\n    {\n      "text": "[Extracted text]",\n      "coordinates": {\n        "x": [number],\n        "y": [number],\n        "width": [number],\n        "height": [number],\n        "centerX": [number],\n        "centerY": [number]\n      },\n      "confidence": [number 0-100],\n      "color": "[string, e.g., black, #RRGGBB]",\n      "backgroundColor": "[string, e.g., white, #RRGGBB]",\n      "lineNumber": [number],\n      "wordIndex": [number]\n    }\n    // ... more OCRTextElement objects\n  ],\n  "metadata": {\n    "totalElements": [number],\n    "averageConfidence": [number],\n    "processingTimeMs": [number],\n    "imageInfo": {\n      "width": [original image width],\n      "height": [original image height],\n      "format": "[original image format, e.g., png, jpeg]"\n    }\n  }\n}\n\nEnsure the JSON is perfectly formatted and valid. Do NOT include any other text or explanation outside the JSON object.`;
  } else {
    return basePrompt + colorDetection + `\n\nOUTPUT FORMAT: Return ONLY the raw extracted text, concatenated line by line. Do NOT include any coordinates, confidence scores, or other metadata.`;
  }
}
