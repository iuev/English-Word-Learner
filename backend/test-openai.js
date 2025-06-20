// Test script for OpenAI integration
import { testOpenAIConnection, extractWordsFromImage, translateWords, analyzeImageForWords } from './src/services/openai.js';
import { getProcessingStats } from './src/utils/imageProcessor.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

console.log('🧪 Testing OpenAI Integration...\n');

async function runTests() {
  // Check if API key is configured
  console.log('1. Checking API Key Configuration...');
  const hasApiKey = !!process.env.OPENAI_API_KEY;
  console.log(`   API Key Present: ${hasApiKey ? '✅ Yes' : '❌ No'}`);
  
  if (!hasApiKey) {
    console.log('   ⚠️  Please set OPENAI_API_KEY in your .env file');
    console.log('   Example: OPENAI_API_KEY=sk-your-api-key-here\n');
    return;
  }
  console.log('');

  // Test OpenAI connection
  console.log('2. Testing OpenAI Connection...');
  try {
    const connectionTest = await testOpenAIConnection();
    if (connectionTest.success) {
      console.log(`   ✅ Connection successful`);
      console.log(`   Model: ${connectionTest.model || 'N/A'}`);
    } else {
      console.log(`   ❌ Connection failed: ${connectionTest.error}`);
      return;
    }
  } catch (error) {
    console.log(`   ❌ Connection error: ${error.message}`);
    return;
  }
  console.log('');

  // Test word translation (without image)
  console.log('3. Testing Word Translation...');
  try {
    const testWords = ['hello', 'world', 'computer', 'learning'];
    console.log(`   Testing words: ${testWords.join(', ')}`);
    
    const translations = await translateWords(testWords);
    console.log(`   ✅ Translation successful`);
    console.log(`   Results:`);
    translations.forEach(item => {
      console.log(`     ${item.english} → ${item.chinese}`);
    });
  } catch (error) {
    console.log(`   ❌ Translation failed: ${error.message}`);
  }
  console.log('');

  // Test image processing capabilities
  console.log('4. Testing Image Processing Configuration...');
  const stats = getProcessingStats();
  console.log(`   ✅ Supported formats: ${stats.supportedFormats.join(', ')}`);
  console.log(`   ✅ Max file size: ${stats.maxFileSizeFormatted}`);
  console.log(`   ✅ Allowed extensions: ${stats.allowedExtensions.join(', ')}`);
  console.log('');

  // Check for test images
  console.log('5. Checking for Test Images...');
  const testImagePaths = [
    'test-image.jpg',
    'test-image.png',
    'uploads/test.jpg',
    'uploads/test.png'
  ];
  
  let testImageFound = null;
  for (const imagePath of testImagePaths) {
    if (fs.existsSync(imagePath)) {
      testImageFound = imagePath;
      break;
    }
  }
  
  if (testImageFound) {
    console.log(`   ✅ Test image found: ${testImageFound}`);
    console.log('');
    
    // Test full image analysis
    console.log('6. Testing Full Image Analysis...');
    try {
      const result = await analyzeImageForWords(testImageFound);
      if (result.success) {
        console.log(`   ✅ Analysis successful`);
        console.log(`   Message: ${result.message}`);
        console.log(`   Words found: ${result.words?.length || 0}`);
        if (result.words && result.words.length > 0) {
          console.log(`   Words: ${result.words.join(', ')}`);
        }
        if (result.translations && result.translations.length > 0) {
          console.log(`   Translations:`);
          result.translations.forEach(item => {
            console.log(`     ${item.english} → ${item.chinese}`);
          });
        }
      } else {
        console.log(`   ❌ Analysis failed: ${result.error}`);
      }
    } catch (error) {
      console.log(`   ❌ Analysis error: ${error.message}`);
    }
  } else {
    console.log(`   ⚠️  No test image found`);
    console.log(`   To test image analysis, place a test image in one of these locations:`);
    testImagePaths.forEach(path => console.log(`     - ${path}`));
  }
  console.log('');

  // Summary
  console.log('🎉 OpenAI Integration Test Complete!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Start the server: node src/app.js');
  console.log('2. Test the API endpoints:');
  console.log('   - GET  /api/test-openai');
  console.log('   - GET  /api/status');
  console.log('   - POST /api/analyze (with image file)');
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test suite failed:', error.message);
  process.exit(1);
});
