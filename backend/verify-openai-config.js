// Verification script for OpenAI API configuration changes
import fs from 'fs';
import path from 'path';

console.log('🔍 Verifying OpenAI API Configuration Changes...\n');

// Check OpenAI service file
const openaiServicePath = './src/services/openai.js';
if (fs.existsSync(openaiServicePath)) {
  const content = fs.readFileSync(openaiServicePath, 'utf8');
  
  console.log('1. Checking OpenAI Service Configuration:');
  
  // Check baseURL
  if (content.includes("baseURL: 'https://api.openai-ch.top/v1'")) {
    console.log('   ✅ API endpoint updated to China mirror service');
  } else {
    console.log('   ❌ API endpoint not updated');
  }
  
  // Check model names
  const gpt41MiniCount = (content.match(/gpt-4\.1-mini/g) || []).length;
  const oldModelCount = (content.match(/gpt-4-vision-preview|gpt-3\.5-turbo|gpt-4o-mini/g) || []).length;

  console.log(`   ✅ Found ${gpt41MiniCount} instances of "gpt-4.1-mini" model`);
  if (oldModelCount === 0) {
    console.log('   ✅ All old model names have been updated');
  } else {
    console.log(`   ⚠️  Found ${oldModelCount} instances of old model names`);
  }
  
} else {
  console.log('❌ OpenAI service file not found');
}

// Check Mock service file
const mockServicePath = './src/services/openai-mock.js';
if (fs.existsSync(mockServicePath)) {
  const content = fs.readFileSync(mockServicePath, 'utf8');
  
  console.log('\n2. Checking Mock Service Configuration:');
  
  if (content.includes('mock-gpt-4.1-mini')) {
    console.log('   ✅ Mock service model name updated');
  } else {
    console.log('   ❌ Mock service model name not updated');
  }
} else {
  console.log('❌ Mock service file not found');
}

// Check environment example file
const envExamplePath = '../.env.example';
if (fs.existsSync(envExamplePath)) {
  const content = fs.readFileSync(envExamplePath, 'utf8');
  
  console.log('\n3. Checking Environment Configuration:');
  
  if (content.includes('api.openai-ch.top')) {
    console.log('   ✅ Environment example updated with China mirror info');
  } else {
    console.log('   ❌ Environment example not updated');
  }
  
  if (content.includes('gpt-4.1-mini')) {
    console.log('   ✅ Model information added to environment example');
  } else {
    console.log('   ❌ Model information not added');
  }
} else {
  console.log('❌ Environment example file not found');
}

// Check README file
const readmePath = '../README.md';
if (fs.existsSync(readmePath)) {
  const content = fs.readFileSync(readmePath, 'utf8');
  
  console.log('\n4. Checking Documentation:');
  
  if (content.includes('gpt-4.1-mini')) {
    console.log('   ✅ README updated with new model information');
  } else {
    console.log('   ❌ README not updated');
  }
  
  if (content.includes('China mirror service')) {
    console.log('   ✅ README updated with China mirror service info');
  } else {
    console.log('   ❌ China mirror service info not added to README');
  }
} else {
  console.log('❌ README file not found');
}

console.log('\n🎉 Configuration Verification Complete!');
console.log('\n📋 Summary of Changes:');
console.log('• API Endpoint: https://api.openai.com → https://api.openai-ch.top/v1');
console.log('• Vision Model: gpt-4-vision-preview → gpt-4.1-mini');
console.log('• Chat Model: gpt-3.5-turbo → gpt-4.1-mini');
console.log('• Mock Model: mock-gpt-3.5-turbo → mock-gpt-4.1-mini');
console.log('\n💡 Next Steps:');
console.log('1. Set OPENAI_API_KEY in .env file');
console.log('2. Test with real API key if available');
console.log('3. Verify image analysis and translation functionality');
