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
 * Validates the TahuOCR configuration.
 * @param {TahuOCRConfig} config - The configuration object to validate.
 * @throws {Error} If the configuration is invalid.
 */
export function validateConfig(config) {
  if (!config) {
    throw new Error('Configuration is required');
  }

  if (!config.provider) {
    throw new Error('Provider is required (openrouter, openai, gemini, ollama)');
  }

  if (!['openrouter', 'openai', 'gemini', 'ollama'].includes(config.provider)) {
    throw new Error('Invalid provider. Must be: openrouter, openai, gemini, or ollama');
  }

  if (config.provider !== 'ollama' && !config.apiKey) {
    throw new Error('API key is required for ' + config.provider);
  }
}

/**
 * Gets the default model for a given AI provider.
 * @param {string} provider - The AI provider.
 * @returns {string} The default model name.
 */
export function getDefaultModel(provider) {
  const defaults = {
    openrouter: 'google/gemini-2.0-flash-exp:free',
    openai: 'gpt-4o-mini',
    gemini: 'gemini-2.0-flash-exp',
    ollama: 'llava'
  };
  return defaults[provider];
}

/**
 * Logs messages if debugging is enabled.
 * @param {boolean} debug - Whether debug logging is enabled.
 * @param {...any} args - Arguments to log.
 */
export function log(debug, ...args) {
  if (debug) {
    console.log('[TahuOCR]', ...args);
  }
}