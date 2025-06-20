import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import * as mockService from './openai-mock.js';

// Load environment variables
dotenv.config();

// Check if we should use mock service
function shouldUseMockService() {
  const hasApiKey = !!process.env.OPENAI_API_KEY;
  const forceMock = process.env.USE_MOCK_OPENAI === 'true';
  return !hasApiKey || forceMock;
}

// Initialize OpenAI client (only if API key is available)
let openai = null;
function getOpenAIClient() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: 'https://api.openai-ch.top/v1',
    });
  }
  return openai;
}

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
};

// Sleep utility for retries
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Retry wrapper function
async function withRetry(fn, retries = RETRY_CONFIG.maxRetries) {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && (error.status === 429 || error.status >= 500)) {
      const delay = Math.min(
        RETRY_CONFIG.baseDelay * Math.pow(2, RETRY_CONFIG.maxRetries - retries),
        RETRY_CONFIG.maxDelay
      );
      console.log(`Retrying in ${delay}ms... (${retries} retries left)`);
      await sleep(delay);
      return withRetry(fn, retries - 1);
    }
    throw error;
  }
}

// Extract English words from image using GPT-4 Vision
export async function extractWordsFromImage(imagePath) {
  // Use mock service if no API key or forced
  if (shouldUseMockService()) {
    console.log('Using mock OpenAI service for word extraction');
    return await mockService.extractWordsFromImage(imagePath);
  }

  try {
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found: ${imagePath}`);
    }

    // Read image file and convert to base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = getMimeType(imagePath);

    const prompt = `
Please analyze this image and extract all English words you can see. 
Follow these rules:
1. Only extract clear, readable English words
2. Ignore numbers, symbols, and non-English text
3. Return each word only once (no duplicates)
4. Focus on common vocabulary words suitable for learning
5. Exclude very short words (1-2 letters) unless they are common words like "is", "to", "of"

Return the words as a JSON array of strings, like this:
["word1", "word2", "word3"]

If no English words are found, return an empty array: []
`;

    const client = getOpenAIClient();
    if (!client) {
      throw new Error('OpenAI client not initialized');
    }

    const response = await withRetry(async () => {
      return await client.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`,
                  detail: "high"
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.1,
      });
    });

    const content = response.choices[0].message.content;
    
    // Parse JSON response
    try {
      const words = JSON.parse(content);
      if (Array.isArray(words)) {
        // Filter and clean words
        return words
          .filter(word => typeof word === 'string' && word.trim().length > 0)
          .map(word => word.trim().toLowerCase())
          .filter((word, index, arr) => arr.indexOf(word) === index); // Remove duplicates
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', content);
      // Fallback: try to extract words from text response
      const words = extractWordsFromText(content);
      return words;
    }

    return [];
  } catch (error) {
    console.error('Error extracting words from image:', error);
    throw new Error(`Failed to extract words: ${error.message}`);
  }
}

// Translate English words to Chinese
export async function translateWords(words) {
  // Use mock service if no API key or forced
  if (shouldUseMockService()) {
    console.log('Using mock OpenAI service for translation');
    return await mockService.translateWords(words);
  }

  try {
    if (!Array.isArray(words) || words.length === 0) {
      return [];
    }

    const prompt = `
Translate the following English words to Chinese. 
Return the result as a JSON array of objects with this format:
[
  {"english": "word1", "chinese": "中文翻译1"},
  {"english": "word2", "chinese": "中文翻译2"}
]

Words to translate: ${words.join(', ')}

Rules:
1. Provide the most common/basic translation for each word
2. Use simplified Chinese characters
3. For words with multiple meanings, choose the most general one
4. Keep translations concise (1-3 characters when possible)
`;

    const client = getOpenAIClient();
    if (!client) {
      throw new Error('OpenAI client not initialized');
    }

    const response = await withRetry(async () => {
      return await client.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.1,
      });
    });

    const content = response.choices[0].message.content;
    
    try {
      const translations = JSON.parse(content);
      if (Array.isArray(translations)) {
        return translations.filter(item => 
          item && 
          typeof item.english === 'string' && 
          typeof item.chinese === 'string'
        );
      }
    } catch (parseError) {
      console.error('Failed to parse translation response:', content);
    }

    return [];
  } catch (error) {
    console.error('Error translating words:', error);
    throw new Error(`Failed to translate words: ${error.message}`);
  }
}

// Combined function to analyze image and get translations
export async function analyzeImageForWords(imagePath) {
  try {
    console.log(`Analyzing image: ${imagePath}`);
    
    // Step 1: Extract words from image
    const words = await extractWordsFromImage(imagePath);
    console.log(`Extracted ${words.length} words:`, words);
    
    if (words.length === 0) {
      return {
        success: true,
        message: 'No English words found in the image',
        words: [],
        translations: []
      };
    }
    
    // Step 2: Translate words
    const translations = await translateWords(words);
    console.log(`Translated ${translations.length} words`);
    
    return {
      success: true,
      message: `Successfully analyzed image and found ${words.length} words`,
      words: words,
      translations: translations,
      count: words.length
    };
    
  } catch (error) {
    console.error('Error in analyzeImageForWords:', error);
    return {
      success: false,
      error: error.message,
      words: [],
      translations: []
    };
  }
}

// Helper function to get MIME type from file extension
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    default:
      return 'image/jpeg';
  }
}

// Helper function to extract words from text (fallback)
function extractWordsFromText(text) {
  const words = text.match(/\b[a-zA-Z]{2,}\b/g) || [];
  return words
    .map(word => word.toLowerCase())
    .filter((word, index, arr) => arr.indexOf(word) === index)
    .slice(0, 20); // Limit to 20 words
}

// Test function to check API connectivity
export async function testOpenAIConnection() {
  // Use mock service if no API key or forced
  if (shouldUseMockService()) {
    console.log('Using mock OpenAI service for connection test');
    return await mockService.testOpenAIConnection();
  }

  try {
    const client = getOpenAIClient();
    if (!client) {
      throw new Error('OpenAI client not initialized');
    }

    const response = await withRetry(async () => {
      return await client.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [{ role: "user", content: "Hello, this is a test." }],
        max_tokens: 10,
      });
    });
    
    return {
      success: true,
      message: 'OpenAI API connection successful',
      model: response.model
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
