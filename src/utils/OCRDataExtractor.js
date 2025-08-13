/**
 * Extract specific data types from OCR results
 */
export class OCRDataExtractor {
  static extractEmails(ocrResult) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    return ocrResult.elements.filter(el => emailRegex.test(el.text));
  }

  static extractPhoneNumbers(ocrResult) {
    const phoneRegex = /[\+]?[\d\s\-\(\)]{10,}/g;
    return ocrResult.elements.filter(el => phoneRegex.test(el.text));
  }

  static extractDates(ocrResult) {
    const dateRegex = /\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}|\d{1,2}-\d{1,2}-\d{4}/g;
    return ocrResult.elements.filter(el => dateRegex.test(el.text));
  }

  static extractNumbers(ocrResult) {
    const numberRegex = /\d+\.?\d*/g;
    return ocrResult.elements.filter(el => numberRegex.test(el.text));
  }

  static extractUrls(ocrResult) {
    const urlRegex = /https?:\/\/[^\s]+/g;
    return ocrResult.elements.filter(el => urlRegex.test(el.text));
  }

  static groupByColor(ocrResult) {
    const groups = {};
    ocrResult.elements.forEach(el => {
      const color = el.color || 'unknown';
      if (!groups[color]) groups[color] = [];
      groups[color].push(el);
    });
    return groups;
  }

  static groupByRegion(ocrResult, regionHeight = 50) {
    const regions = {};
    ocrResult.elements.forEach(el => {
      const regionIndex = Math.floor(el.coordinates.y / regionHeight);
      if (!regions[regionIndex]) regions[regionIndex] = [];
      regions[regionIndex].push(el);
    });
    return regions;
  }

  static findByCoordinates(ocrResult, x, y, tolerance = 10) {
    return ocrResult.elements.filter(el => 
      Math.abs(el.coordinates.x - x) <= tolerance &&
      Math.abs(el.coordinates.y - y) <= tolerance
    );
  }
}