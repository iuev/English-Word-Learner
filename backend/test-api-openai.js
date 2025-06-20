// Test OpenAI API endpoints
import http from 'http';

const BASE_URL = 'http://localhost:5000';

function makeRequest(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: jsonBody
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

async function runOpenAITests() {
  console.log('🧪 Testing OpenAI API endpoints...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await makeRequest('/api/health');
    console.log(`   Status: ${healthResponse.statusCode}`);
    console.log(`   Message: ${healthResponse.body.message || 'N/A'}`);
    console.log(`   Version: ${healthResponse.body.version || 'N/A'}\n`);

    // Test OpenAI connection
    console.log('2. Testing OpenAI connection...');
    const openaiResponse = await makeRequest('/api/test-openai');
    console.log(`   Status: ${openaiResponse.statusCode}`);
    console.log(`   Success: ${openaiResponse.body.success || false}`);
    console.log(`   Message: ${openaiResponse.body.message || 'N/A'}`);
    if (openaiResponse.body.details) {
      console.log(`   Model: ${openaiResponse.body.details.model || 'N/A'}`);
    }
    console.log('');

    // Test status endpoint
    console.log('3. Testing status endpoint...');
    const statusResponse = await makeRequest('/api/status');
    console.log(`   Status: ${statusResponse.statusCode}`);
    console.log(`   Success: ${statusResponse.body.success || false}`);
    if (statusResponse.body.status) {
      console.log(`   OpenAI Configured: ${statusResponse.body.status.openai_configured}`);
      console.log(`   Using Mock Service: ${statusResponse.body.status.using_mock_service}`);
      console.log(`   Supported Formats: ${statusResponse.body.status.supported_formats?.join(', ') || 'N/A'}`);
    }
    console.log('');

    // Test analyze endpoint (should return 501)
    console.log('4. Testing analyze endpoint...');
    const analyzeResponse = await makeRequest('/api/analyze', 'POST');
    console.log(`   Status: ${analyzeResponse.statusCode}`);
    console.log(`   Success: ${analyzeResponse.body.success || false}`);
    console.log(`   Message: ${analyzeResponse.body.error || analyzeResponse.body.message || 'N/A'}\n`);

    console.log('✅ All OpenAI API tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the server is running: node src/app-with-openai.js');
  }
}

// Run tests
runOpenAITests();
