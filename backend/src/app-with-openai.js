// Server with OpenAI integration (using mock service)
import http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';
import { analyzeImageForWords, testOpenAIConnection } from './services/openai-mock.js';

const PORT = 5000;

// Simple CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

// Simple JSON response helper
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    ...corsHeaders
  });
  res.end(JSON.stringify(data, null, 2));
}

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }

  // Health check endpoint
  if (pathname === '/api/health' && method === 'GET') {
    sendJSON(res, 200, {
      status: 'OK',
      message: 'English Word Learner API is running (With OpenAI Mock)',
      timestamp: new Date().toISOString(),
      version: '1.0.0-openai-mock'
    });
    return;
  }

  // Test OpenAI endpoint
  if (pathname === '/api/test-openai' && method === 'GET') {
    try {
      const testResult = await testOpenAIConnection();
      
      if (testResult.success) {
        sendJSON(res, 200, {
          success: true,
          message: 'OpenAI API connection test successful (Mock)',
          details: testResult,
          timestamp: new Date().toISOString()
        });
      } else {
        sendJSON(res, 500, {
          success: false,
          error: 'OpenAI API connection test failed (Mock)',
          details: testResult.error,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      sendJSON(res, 500, {
        success: false,
        error: 'Failed to test OpenAI connection (Mock)',
        details: error.message,
        timestamp: new Date().toISOString()
      });
    }
    return;
  }

  // Status endpoint
  if (pathname === '/api/status' && method === 'GET') {
    const hasApiKey = !!process.env.OPENAI_API_KEY;
    
    sendJSON(res, 200, {
      success: true,
      message: 'Analysis service status',
      status: {
        openai_configured: hasApiKey,
        api_key_present: hasApiKey,
        using_mock_service: !hasApiKey,
        supported_formats: ['image/jpeg', 'image/png', 'image/gif'],
        max_file_size: '10MB',
        features: {
          word_extraction: true,
          translation: true,
          batch_processing: false,
          real_ai: hasApiKey
        }
      },
      endpoints: {
        analyze: 'POST /api/analyze (not implemented in simple mode)',
        test: 'GET /api/test-openai',
        status: 'GET /api/status',
        health: 'GET /api/health'
      },
      timestamp: new Date().toISOString()
    });
    return;
  }

  // Root endpoint
  if (pathname === '/' && method === 'GET') {
    sendJSON(res, 200, {
      message: 'English Word Learner API (With OpenAI Mock)',
      version: '1.0.0-openai-mock',
      endpoints: {
        health: '/api/health',
        test_openai: '/api/test-openai',
        status: '/api/status',
        analyze: '/api/analyze (requires full dependencies)'
      }
    });
    return;
  }

  // Analyze endpoint placeholder
  if (pathname === '/api/analyze' && method === 'POST') {
    sendJSON(res, 501, {
      success: false,
      error: 'Analyze functionality requires full dependencies and file upload middleware.',
      message: 'Please install npm packages and use the full server (node src/app.js)',
      mock_available: true,
      note: 'Mock analysis can be tested with the test script: node test-openai-simple.js'
    });
    return;
  }

  // 404 handler
  sendJSON(res, 404, {
    success: false,
    error: 'Endpoint not found',
    path: pathname,
    available_endpoints: [
      'GET /',
      'GET /api/health',
      'GET /api/test-openai',
      'GET /api/status'
    ]
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server with OpenAI Mock is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🤖 Test OpenAI: http://localhost:${PORT}/api/test-openai`);
  console.log(`📋 Status: http://localhost:${PORT}/api/status`);
  console.log(`⚠️  Note: This includes OpenAI mock service. Install npm dependencies for full functionality.`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
