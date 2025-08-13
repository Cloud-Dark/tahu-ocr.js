const assert = require('assert');
const path = require('path');

// --- Mocked Dependencies ---
// Directly import and modify module exports for mocking
// This is a simplified approach for ES Modules in a CJS runner.
// Mocks will be global and not reset per test.

// Mock tahu.js
const mockTahu = {
    builder: () => ({
        name: () => mockTahu.builder(),
        systemPrompt: () => mockTahu.builder(),
        build: () => ({}),
    }),
    runAgent: async () => ({ response: 'Mocked OCR Result' }),
    chat: async () => ({ response: 'Mocked OCR Result' }),
};
// We can't directly mock `tahu.js` if it's an external dependency and we're not using a module loader.
// For now, we'll assume `tahu.js` is mocked by the `createTahu` function.

// Mock sharp
const mockSharp = (input) => ({
    composite: () => mockSharp(), // Return a new mockSharp instance for chaining
    png: () => mockSharp(),
    toBuffer: async () => Buffer.from('mock-image-buffer'),
    extract: () => mockSharp(),
});
mockSharp.create = (options) => mockSharp(); // Static create method

// Mock internal modules
const mockConfig = {
    validateConfig: () => {},
    getDefaultModel: () => 'mock-model',
    log: () => {},
};

const mockImageProcessor = {
    processImage: async () => ({
        buffer: Buffer.from('mock-processed-image'),
        metadata: { format: 'png', width: 100, height: 100 },
        originalMetadata: { format: 'png', width: 100, height: 100 },
    }),
};

const mockPromptGenerator = {
    createOCRPrompt: () => 'mock-ocr-prompt',
};

const mockResultParser = {
    parseJSONResult: () => ({
        rawText: 'Mocked OCR Result',
        elements: [{ text: 'Mocked', coordinates: {}, confidence: 90 }],
        metadata: {},
    }),
};

// --- Test Runner ---
let passedTests = 0;
let failedTests = 0;

async function test(name, fn) {
    try {
        await fn();
        console.log(`✓ ${name}`);
        passedTests++;
    } catch (error) {
        console.error(`✗ ${name}`);
        console.error(error);
        failedTests++;
    }
}

async function runTests() {
    console.log('Running TahuOCR Tests (Node.js)');

    // Dynamically import TahuOCR and other modules
    // This assumes the modules are designed to be imported this way
    const { TahuOCR } = await import('../src/TahuOCR.js');

    // Test: should initialize TahuOCR with provided config
    await test('should initialize TahuOCR with provided config', async () => {
        const config = {
            provider: 'gemini',
            apiKey: 'test-api-key',
        };
        const ocr = new TahuOCR(config, mockTahu, mockSharp, mockImageProcessor.processImage, mockPromptGenerator.createOCRPrompt, mockResultParser.parseJSONResult, mockConfig);
        assert.strictEqual(ocr.config.provider, 'gemini');
        assert.strictEqual(ocr.config.apiKey, 'test-api-key');
    });

    // Test: should run the built-in test method successfully
    await test('should run the built-in test method successfully', async () => {
        const config = {
            provider: 'gemini',
            apiKey: 'test-api-key',
        };
        const ocr = new TahuOCR(config, mockTahu, mockSharp, mockImageProcessor.processImage, mockPromptGenerator.createOCRPrompt, mockResultParser.parseJSONResult, mockConfig);
        const result = await ocr.test();

        assert.strictEqual(result.success, true);
        assert.strictEqual(result.provider, 'gemini');
        assert.strictEqual(result.rawText, 'Mocked OCR Result');
        assert.strictEqual(result.elementsFound, 1);
    });

    // Test: should extract text in JSON format
    await test('should extract text in JSON format', async () => {
        const config = {
            provider: 'gemini',
            apiKey: 'test-api-key',
        };
        const ocr = new TahuOCR(config, mockTahu, mockSharp, mockImageProcessor.processImage, mockPromptGenerator.createOCRPrompt, mockResultParser.parseJSONResult, mockConfig);
        const result = await ocr.extractText('D:\\poject\\tahu-ocr.js\\examples\\image\\full_color.png', { format: 'json' });

        assert.ok(result.hasOwnProperty('rawText'));
        assert.ok(result.hasOwnProperty('elements'));
        assert.strictEqual(result.rawText, 'Mocked OCR Result');
        assert.strictEqual(result.elements.length, 1);
    });

    // Test: should extract text in plain text format
    await test('should extract text in plain text format', async () => {
        const config = {
            provider: 'gemini',
            apiKey: 'test-api-key',
        };
        const ocr = new TahuOCR(config, mockTahu, mockSharp, mockImageProcessor.processImage, mockPromptGenerator.createOCRPrompt, mockResultParser.parseJSONResult, mockConfig);
        const result = await ocr.extractText('D:\\poject\\tahu-ocr.js\\examples\\image\\full_color.png', { format: 'text' });

        assert.strictEqual(typeof result, 'string');
        assert.strictEqual(result, 'Mocked OCR Result');
    });

    // Test: should handle batch processing
    await test('should handle batch processing', async () => {
        const config = {
            provider: 'gemini',
            apiKey: 'test-api-key',
        };
        const ocr = new TahuOCR(config, mockTahu, mockSharp, mockImageProcessor.processImage, mockPromptGenerator.createOCRPrompt, mockResultParser.parseJSONResult, mockConfig);
        const images = ['image1.png', 'image2.png'];
        const results = await ocr.batchProcess(images);

        assert.strictEqual(results.length, 2);
        assert.strictEqual(results[0].rawText, 'Mocked OCR Result');
        assert.strictEqual(results[1].rawText, 'Mocked OCR Result');
    });

    // Test: should extract text from regions
    await test('should extract text from regions', async () => {
        const config = {
            provider: 'gemini',
            apiKey: 'test-api-key',
        };
        const ocr = new TahuOCR(config, mockTahu, mockSharp, mockImageProcessor.processImage, mockPromptGenerator.createOCRPrompt, mockResultParser.parseJSONResult, mockConfig);
        const regions = [
            { x: 0, y: 0, width: 10, height: 10 },
            { x: 20, y: 20, width: 30, height: 30 },
        ];
        const results = await ocr.extractFromRegions('D:\\poject\\tahu-ocr.js\\examples\\image\\full_color.png', regions);

        assert.strictEqual(results.length, 2);
        assert.strictEqual(results[0].rawText, 'Mocked OCR Result');
        assert.strictEqual(results[1].rawText, 'Mocked OCR Result');
    });

    // Test: should return available models for a provider
    await test('should return available models for a provider', async () => {
        const config = {
            provider: 'gemini',
            apiKey: 'test-api-key',
        };
        const ocr = new TahuOCR(config, mockTahu, mockSharp, mockImageProcessor.processImage, mockPromptGenerator.createOCRPrompt, mockResultParser.parseJSONResult, mockConfig);
        const models = await ocr.getAvailableModels();

        assert.ok(Array.isArray(models));
        assert.ok(models.length > 0);
        assert.ok(models.includes('gemini-2.0-flash-exp'));
    });

    // Test: should throw an error if image processing fails
    await test('should throw an error if image processing fails', async () => {
        const config = {
            provider: 'gemini',
            apiKey: 'test-api-key',
        };

        const errorImageProcessor = {
            processImage: async () => {
                throw new Error('Image processing failed');
            },
        };

        const ocr = new TahuOCR(config, mockTahu, mockSharp, errorImageProcessor.processImage, mockPromptGenerator.createOCRPrompt, mockResultParser.parseJSONResult, mockConfig);

        let errorThrown = false;
        try {
            await ocr.extractText('invalid/path.png');
        } catch (error) {
            errorThrown = true;
            assert.ok(error.message.includes('OCR extraction failed: Image processing failed'));
        }
        assert.ok(errorThrown, 'Error was not thrown');
    });

    // Test: should handle errors in batch processing gracefully
    await test('should handle errors in batch processing gracefully', async () => {
        const config = {
            provider: 'gemini',
            apiKey: 'test-api-key',
        };

        const ocr = new TahuOCR(config, mockTahu, mockSharp, mockImageProcessor.processImage, mockPromptGenerator.createOCRPrompt, mockResultParser.parseJSONResult, mockConfig);
        const images = ['image1.png', 'image2.png'];

        // Temporarily mock extractText to fail for the first image
        const originalExtractText = ocr.extractText;
        let extractTextCalledCount = 0;
        ocr.extractText = async (imagePath, options) => {
            extractTextCalledCount++;
            if (extractTextCalledCount === 1) {
                throw new Error('Simulated OCR failure for image1');
            } else {
                return originalExtractText.call(ocr, imagePath, options);
            }
        };

        const results = await ocr.batchProcess(images);

        assert.strictEqual(results.length, 2);
        assert.ok(results[0].hasOwnProperty('error'));
        assert.ok(results[0].error.includes('Simulated OCR failure for image1'));
        assert.strictEqual(results[1].rawText, 'Mocked OCR Result');

        // Restore original extractText
        ocr.extractText = originalExtractText;
    });

    // Test: should handle errors in region extraction gracefully
    await test('should handle errors in region extraction gracefully', async () => {
        const config = {
            provider: 'gemini',
            apiKey: 'test-api-key',
        };
        const regions = [
            { x: 0, y: 0, width: 10, height: 10 },
            { x: 20, y: 20, width: 30, height: 30 },
        ];

        let extractCalledCount = 0;
        const errorSharp = (input) => ({
            composite: () => errorSharp(),
            png: () => errorSharp(),
            toBuffer: async () => Buffer.from('mock-image-buffer'),
            extract: () => {
                extractCalledCount++;
                if (extractCalledCount === 1) {
                    throw new Error('Simulated region extraction failure');
                }
                return errorSharp();
            },
        });
        errorSharp.create = (options) => errorSharp();

        const ocr = new TahuOCR(config, mockTahu, errorSharp, mockImageProcessor.processImage, mockPromptGenerator.createOCRPrompt, mockResultParser.parseJSONResult, mockConfig);

        const results = await ocr.extractFromRegions('D:\\poject\\tahu-ocr.js\\examples\\image\\full_color.png', regions);

        assert.strictEqual(results.length, 2);
        assert.ok(results[0].hasOwnProperty('error'));
        assert.ok(results[0].error.includes('Simulated region extraction failure'));
        assert.strictEqual(results[1].rawText, 'Mocked OCR Result');
    });


    console.log('\n--- Test Summary ---');
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);

    if (failedTests > 0) {
        process.exit(1); // Exit with error code if any tests failed
    }
}

runTests();