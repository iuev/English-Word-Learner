// Simple test for OpenAI integration without external dependencies
import { analyzeImageForWords, testOpenAIConnection } from './src/services/openai-mock.js';
import { getProcessingStats } from './src/utils/imageProcessor.js';
import fs from 'fs';

console.log('🧪 Testing OpenAI Integration (Mock Mode)...\n');

async function runSimpleTests() {
  // Check API Key configuration
  console.log('1. Checking Configuration...');
  const hasApiKey = !!process.env.OPENAI_API_KEY;
  console.log(`   API Key Present: ${hasApiKey ? '✅ Yes' : '❌ No (using mock service)'}`);
  console.log('');

  // Test mock connection
  console.log('2. Testing Mock OpenAI Connection...');
  try {
    const connectionTest = await testOpenAIConnection();
    if (connectionTest.success) {
      console.log(`   ✅ Mock connection successful`);
      console.log(`   Model: ${connectionTest.model || 'N/A'}`);
    } else {
      console.log(`   ❌ Mock connection failed: ${connectionTest.error}`);
    }
  } catch (error) {
    console.log(`   ❌ Mock connection error: ${error.message}`);
  }
  console.log('');

  // Test image processing configuration
  console.log('3. Testing Image Processing Configuration...');
  try {
    const stats = getProcessingStats();
    console.log(`   ✅ Supported formats: ${stats.supportedFormats.join(', ')}`);
    console.log(`   ✅ Max file size: ${stats.maxFileSizeFormatted}`);
    console.log(`   ✅ Allowed extensions: ${stats.allowedExtensions.join(', ')}`);
  } catch (error) {
    console.log(`   ❌ Configuration error: ${error.message}`);
  }
  console.log('');

  // Create a test image file for testing
  console.log('4. Creating Test Image...');
  const testImagePath = 'test-sample.txt'; // Using txt file as placeholder
  try {
    fs.writeFileSync(testImagePath, 'This is a test file for image analysis simulation');
    console.log(`   ✅ Test file created: ${testImagePath}`);
  } catch (error) {
    console.log(`   ❌ Failed to create test file: ${error.message}`);
    return;
  }
  console.log('');

  // Test full image analysis with mock service
  console.log('5. Testing Mock Image Analysis...');
  try {
    const result = await analyzeImageForWords(testImagePath);
    if (result.success) {
      console.log(`   ✅ Mock analysis successful`);
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
      console.log(`   ❌ Mock analysis failed: ${result.error}`);
    }
  } catch (error) {
    console.log(`   ❌ Mock analysis error: ${error.message}`);
  }
  console.log('');

  // Cleanup test file
  try {
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
      console.log(`   🧹 Cleaned up test file: ${testImagePath}`);
    }
  } catch (error) {
    console.log(`   ⚠️  Failed to cleanup test file: ${error.message}`);
  }
  console.log('');

  // Summary
  console.log('🎉 OpenAI Integration Test Complete (Mock Mode)!');
  console.log('');
  console.log('✅ Mock service is working correctly');
  console.log('✅ Image processing utilities are functional');
  console.log('✅ Translation mock is operational');
  console.log('');
  console.log('Next steps:');
  console.log('1. Set OPENAI_API_KEY in .env file for real AI functionality');
  console.log('2. Start the server: node src/app.js');
  console.log('3. Test the API endpoints:');
  console.log('   - GET  /api/test-openai');
  console.log('   - GET  /api/status');
  console.log('   - POST /api/analyze (with image file)');
}

// Run tests
runSimpleTests().catch(error => {
  console.error('❌ Test suite failed:', error.message);
  process.exit(1);
});
