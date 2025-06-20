// Simple API test script
import http from 'http';

const BASE_URL = 'http://localhost:5000';

function makeRequest(path, method = 'GET', data = null) {
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

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing API endpoints...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await makeRequest('/api/health');
    console.log(`   Status: ${healthResponse.statusCode}`);
    console.log(`   Response: ${JSON.stringify(healthResponse.body, null, 2)}\n`);

    // Test root endpoint
    console.log('2. Testing root endpoint...');
    const rootResponse = await makeRequest('/');
    console.log(`   Status: ${rootResponse.statusCode}`);
    console.log(`   Response: ${JSON.stringify(rootResponse.body, null, 2)}\n`);

    // Test 404 endpoint
    console.log('3. Testing 404 endpoint...');
    const notFoundResponse = await makeRequest('/nonexistent');
    console.log(`   Status: ${notFoundResponse.statusCode}`);
    console.log(`   Response: ${JSON.stringify(notFoundResponse.body, null, 2)}\n`);

    console.log('✅ All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the server is running: node src/app-simple.js');
  }
}

runTests();
