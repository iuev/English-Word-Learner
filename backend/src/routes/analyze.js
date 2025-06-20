import express from 'express';
import upload from '../middleware/upload.js';
import { analyzeImageForWords, testOpenAIConnection } from '../services/openai.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Analyze image endpoint - combines upload and analysis
router.post('/analyze', upload.single('image'), async (req, res) => {
  let uploadedFilePath = null;
  
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file uploaded',
        message: 'Please upload an image file (JPEG, PNG, or GIF)'
      });
    }

    uploadedFilePath = req.file.path;
    console.log(`Processing uploaded file: ${uploadedFilePath}`);

    // Analyze the image for English words
    const analysisResult = await analyzeImageForWords(uploadedFilePath);

    // Clean up uploaded file after processing
    try {
      if (fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
        console.log(`Cleaned up temporary file: ${uploadedFilePath}`);
      }
    } catch (cleanupError) {
      console.warn(`Failed to cleanup file ${uploadedFilePath}:`, cleanupError.message);
    }

    // Return analysis results
    if (analysisResult.success) {
      res.json({
        success: true,
        message: analysisResult.message,
        data: {
          words: analysisResult.words,
          translations: analysisResult.translations,
          count: analysisResult.count || 0
        },
        file: {
          originalname: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype
        },
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Analysis failed',
        details: analysisResult.error,
        file: {
          originalname: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      });
    }

  } catch (error) {
    console.error('Error in analyze endpoint:', error);

    // Clean up uploaded file on error
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      try {
        fs.unlinkSync(uploadedFilePath);
        console.log(`Cleaned up file after error: ${uploadedFilePath}`);
      } catch (cleanupError) {
        console.warn(`Failed to cleanup file after error:`, cleanupError.message);
      }
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error during analysis',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Test OpenAI connection endpoint
router.get('/test-openai', async (req, res) => {
  try {
    const testResult = await testOpenAIConnection();
    
    if (testResult.success) {
      res.json({
        success: true,
        message: 'OpenAI API connection test successful',
        details: testResult,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'OpenAI API connection test failed',
        details: testResult.error,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to test OpenAI connection',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get API status and configuration
router.get('/status', (req, res) => {
  const hasApiKey = !!process.env.OPENAI_API_KEY;
  
  res.json({
    success: true,
    message: 'Analysis service status',
    status: {
      openai_configured: hasApiKey,
      api_key_present: hasApiKey,
      supported_formats: ['image/jpeg', 'image/png', 'image/gif'],
      max_file_size: '10MB',
      features: {
        word_extraction: true,
        translation: true,
        batch_processing: false
      }
    },
    endpoints: {
      analyze: 'POST /api/analyze',
      test: 'GET /api/test-openai',
      status: 'GET /api/status'
    },
    timestamp: new Date().toISOString()
  });
});

export default router;
