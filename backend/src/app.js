import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import analyzeRoutes from './routes/analyze.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// API routes
app.use('/api', apiRoutes);
app.use('/api', analyzeRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'English Word Learner API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      upload: '/api/upload',
      analyze: '/api/analyze',
      test_openai: '/api/test-openai',
      status: '/api/status'
    }
  });
});

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);

  res.status(error.status || 500).json({
    success: false,
    error: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📁 Upload endpoint: http://localhost:${PORT}/api/upload`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

  // OpenAI configuration status
  const hasApiKey = !!process.env.OPENAI_API_KEY;
  console.log(`🤖 OpenAI API Key: ${hasApiKey ? '✅ Configured' : '❌ Missing'}`);
  if (hasApiKey) {
    console.log(`🔗 OpenAI Endpoint: https://api.openai-ch.top/v1`);
    console.log(`🎯 Model: gpt-4.1-mini`);
  } else {
    console.log(`🔄 Using Mock Service for development`);
  }
});
