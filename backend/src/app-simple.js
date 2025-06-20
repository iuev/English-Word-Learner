// Simple server for testing without external dependencies
import http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';

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
  res.end(JSON.stringify(data));
}

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const server = http.createServer((req, res) => {
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
      message: 'English Word Learner API is running (Simple Mode)',
      timestamp: new Date().toISOString(),
      version: '1.0.0-simple'
    });
    return;
  }

  // Root endpoint
  if (pathname === '/' && method === 'GET') {
    sendJSON(res, 200, {
      message: 'English Word Learner API (Simple Mode)',
      version: '1.0.0-simple',
      endpoints: {
        health: '/api/health',
        upload: '/api/upload (not implemented in simple mode)'
      }
    });
    return;
  }

  // Upload endpoint placeholder
  if (pathname === '/api/upload' && method === 'POST') {
    sendJSON(res, 501, {
      success: false,
      error: 'Upload functionality requires full dependencies. Please install npm packages.'
    });
    return;
  }

  // 404 handler
  sendJSON(res, 404, {
    success: false,
    error: 'Endpoint not found',
    path: pathname
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Simple server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`⚠️  Note: This is a simplified version. Install npm dependencies for full functionality.`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
