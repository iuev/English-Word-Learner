// Mock OpenAI service for testing without API key
import fs from 'fs';
import path from 'path';

// Mock word extraction from image
export async function extractWordsFromImage(imagePath) {
  try {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found: ${imagePath}`);
    }

    // Mock extracted words based on filename or return sample words
    const filename = path.basename(imagePath).toLowerCase();
    let mockWords = [];
    
    if (filename.includes('hello')) {
      mockWords = ['hello', 'world', 'welcome'];
    } else if (filename.includes('test')) {
      mockWords = ['test', 'sample', 'image', 'text'];
    } else {
      // Default mock words for any image
      mockWords = ['computer', 'learning', 'english', 'study', 'language', 'education'];
    }
    
    console.log(`Mock: Extracted ${mockWords.length} words from ${filename}`);
    return mockWords;
    
  } catch (error) {
    console.error('Mock: Error extracting words from image:', error);
    throw new Error(`Mock: Failed to extract words: ${error.message}`);
  }
}

// Mock word translation
export async function translateWords(words) {
  try {
    if (!Array.isArray(words) || words.length === 0) {
      return [];
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock translations
    const mockTranslations = {
      'hello': '你好',
      'world': '世界',
      'welcome': '欢迎',
      'test': '测试',
      'sample': '样本',
      'image': '图片',
      'text': '文本',
      'computer': '电脑',
      'learning': '学习',
      'english': '英语',
      'study': '学习',
      'language': '语言',
      'education': '教育',
      'book': '书',
      'read': '读',
      'write': '写',
      'speak': '说',
      'listen': '听'
    };

    const translations = words.map(word => ({
      english: word,
      chinese: mockTranslations[word.toLowerCase()] || '未知'
    }));

    console.log(`Mock: Translated ${translations.length} words`);
    return translations;
    
  } catch (error) {
    console.error('Mock: Error translating words:', error);
    throw new Error(`Mock: Failed to translate words: ${error.message}`);
  }
}

// Mock combined analysis function
export async function analyzeImageForWords(imagePath) {
  try {
    console.log(`Mock: Analyzing image: ${imagePath}`);
    
    // Step 1: Extract words from image
    const words = await extractWordsFromImage(imagePath);
    console.log(`Mock: Extracted ${words.length} words:`, words);
    
    if (words.length === 0) {
      return {
        success: true,
        message: 'Mock: No English words found in the image',
        words: [],
        translations: []
      };
    }
    
    // Step 2: Translate words
    const translations = await translateWords(words);
    console.log(`Mock: Translated ${translations.length} words`);
    
    return {
      success: true,
      message: `Mock: Successfully analyzed image and found ${words.length} words`,
      words: words,
      translations: translations,
      count: words.length
    };
    
  } catch (error) {
    console.error('Mock: Error in analyzeImageForWords:', error);
    return {
      success: false,
      error: `Mock: ${error.message}`,
      words: [],
      translations: []
    };
  }
}

// Mock OpenAI connection test
export async function testOpenAIConnection() {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      message: 'Mock: OpenAI API connection successful (simulated)',
      model: 'mock-gpt-4.1-mini'
    };
  } catch (error) {
    return {
      success: false,
      error: `Mock: ${error.message}`
    };
  }
}

// Check if we should use mock service
export function shouldUseMockService() {
  const hasApiKey = !!process.env.OPENAI_API_KEY;
  const forceMock = process.env.USE_MOCK_OPENAI === 'true';
  
  return !hasApiKey || forceMock;
}

// Get service status
export function getMockServiceStatus() {
  return {
    isMock: true,
    reason: !process.env.OPENAI_API_KEY ? 'No API key configured' : 'Mock mode enabled',
    capabilities: {
      word_extraction: true,
      translation: true,
      real_ai: false
    },
    note: 'This is a mock service for testing. Set OPENAI_API_KEY for real AI functionality.'
  };
}
