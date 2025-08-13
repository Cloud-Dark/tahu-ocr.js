import { createTahuOCR } from '../src/index.js';
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
 * Example 9: ID Card / Driver's License Processing
 */
export async function idCardProcessing() {
  console.log('🆔 ID Card Processing Example\n');
  
  try {
    const idPrompt = `You are an expert ID card OCR system. Extract all text from this ID card or driver's license with precise coordinates.

Focus on identifying:
- Full name
- ID/License number
- Date of birth
- Address
- Expiration date
- Any other personal information

Provide exact coordinates for each field to enable automated form filling.
Include color information for security feature detection.`;

    const result = await ocrOpenRouter.extractText('./sample-images/id-card.jpg', {
      format: 'json',
      customPrompt: idPrompt,
      includeColors: true
    });

    console.log('🆔 ID Card Analysis:');
    console.log(`📊 Elements extracted: ${result.elements.length}`);
    
    // Categorize common ID card fields
    const categories = {
      names: result.elements.filter(el => /^[A-Z][a-z]+ [A-Z][a-z]+/.test(el.text)),
      numbers: result.elements.filter(el => /^\d{8,}$/.test(el.text.replace(/\s/g, ''))),
      dates: result.elements.filter(el => /\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}|\d{1,2}-\d{1,2}-\d{4}/.test(el.text)),
      addresses: result.elements.filter(el => el.text.length > 20 && /\d+/.test(el.text))
    };

    Object.entries(categories).forEach(([category, items]) => {
      if (items.length > 0) {
        console.log(`\n${category.toUpperCase()}:`);
        items.forEach(item => {
          console.log(`  - "${item.text}" at (${item.coordinates.x}, ${item.coordinates.y})`);
        });
      }
    });

  } catch (error) {
    console.error('❌ ID card processing error:', error.message);
  }
}

/**
 * Example 10: Table Data Extraction
 */
export async function tableDataExtraction() {
  console.log('📊 Table Data Extraction Example\n');
  
  try {
    const tablePrompt = `You are a table OCR expert. Extract all text from this table image with precise coordinates.

For table data:
- Identify table headers vs data rows
- Maintain row and column relationships
- Preserve numerical data accuracy
- Detect table borders and cell boundaries
- Provide coordinates for each cell

Return structured data that preserves the table layout.`;

    const result = await ocrOpenRouter.extractText('./sample-images/data-table.jpg', {
      format: 'json',
      customPrompt: tablePrompt
    });

    console.log('📋 Table Data Results:');
    console.log(`📊 Total cells: ${result.elements.length}`);
    
    // Group elements by line (approximate rows)
    const rows = {};
    result.elements.forEach(element => {
      const rowKey = Math.floor(element.coordinates.y / 30); // Approximate row height
      if (!rows[rowKey]) rows[rowKey] = [];
      rows[rowKey].push(element);
    });

    console.log(`📏 Detected rows: ${Object.keys(rows).length}`);
    
    // Display first few rows
    Object.entries(rows).slice(0, 5).forEach(([rowIndex, cells]) => {
      console.log(`\nRow ${parseInt(rowIndex) + 1}:
`);
      cells
        .sort((a, b) => a.coordinates.x - b.coordinates.x) // Sort by X coordinate
        .forEach(cell => {
          console.log(`  Column: "${cell.text}" (${cell.coordinates.x}, ${cell.coordinates.y})`);
        });
    });

  } catch (error) {
    console.error('❌ Table extraction error:', error.message);
  }
}

/**
 * Example 11: Color Analysis and Text Styling
 */
export async function colorAnalysisExample() {
  console.log('🎨 Color Analysis Example\n');
  
  try {
    const result = await ocrOpenRouter.extractText('./sample-images/colorful-document.jpg', {
      format: 'json',
      includeColors: true
    });

    console.log('🌈 Color Analysis Results:');
    
    // Group by colors
    const colorGroups = {};
    result.elements.forEach(element => {
      const color = element.color || 'unknown';
      if (!colorGroups[color]) colorGroups[color] = [];
      colorGroups[color].push(element);
    });

    Object.entries(colorGroups).forEach(([color, elements]) => {
      console.log(`\n${color.toUpperCase()} TEXT (${elements.length} elements):
`);
      elements.slice(0, 3).forEach(el => { // Show first 3 of each color
        console.log(`  - "${el.text}" (${el.color}) - ${el.confidence}% confidence`);
      });
    });

    // Find high-confidence colored text
    const coloredText = result.elements.filter(el => 
      el.color !== 'unknown' && el.color !== 'black' && el.confidence > 80
    );

    if (coloredText.length > 0) {
      console.log('\n🎯 High-Confidence Colored Text:');
      coloredText.forEach(el => {
        console.log(`  - "${el.text}" (${el.color}) - ${el.confidence}% confidence`);
      });
    }

  } catch (error) {
    console.error('❌ Color analysis error:', error.message);
  }
}
