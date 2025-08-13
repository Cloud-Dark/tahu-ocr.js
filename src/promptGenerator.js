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
    return basePrompt + colorDetection + `\n\nOUTPUT FORMAT: Return ONLY a valid JSON object with this exact structure:\n{\n  \