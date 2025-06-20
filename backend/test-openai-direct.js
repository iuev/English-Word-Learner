import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🧪 Direct OpenAI API Test...\n');

// Check environment variables
console.log('Environment Variables:');
console.log(`- OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? 'Present' : 'Missing'}`);
console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`);
console.log('');

if (!process.env.OPENAI_API_KEY) {
  console.log('❌ OPENAI_API_KEY is missing. Please set it in .env file.');
  process.exit(1);
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai-ch.top/v1',
});

console.log('OpenAI Client Configuration:');
console.log(`- Base URL: https://api.openai-ch.top/v1`);
console.log(`- Model: gpt-4.1-mini`);
console.log('');

// Test API connection
async function testConnection() {
  try {
    console.log('Testing OpenAI API connection...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: "Hello, this is a test." }],
      max_tokens: 10,
    });
    
    console.log('✅ OpenAI API connection successful!');
    console.log(`- Model: ${response.model}`);
    console.log(`- Response: ${response.choices[0].message.content}`);
    console.log(`- Usage: ${JSON.stringify(response.usage)}`);
    
  } catch (error) {
    console.log('❌ OpenAI API connection failed:');
    console.log(`- Error: ${error.message}`);
    console.log(`- Status: ${error.status || 'N/A'}`);
    console.log(`- Code: ${error.code || 'N/A'}`);
    
    if (error.response) {
      console.log(`- Response Status: ${error.response.status}`);
      console.log(`- Response Data: ${JSON.stringify(error.response.data)}`);
    }
  }
}

testConnection();
