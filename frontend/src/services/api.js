import axios from 'axios';

// API base configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API endpoints
export const apiEndpoints = {
  health: '/api/health',
  upload: '/api/upload',
  analyze: '/api/analyze',
  testOpenAI: '/api/test-openai',
  status: '/api/status'
};

// Health check
export const checkHealth = async () => {
  try {
    const response = await api.get(apiEndpoints.health);
    return response.data;
  } catch (error) {
    throw new Error(`健康检查失败：${error.message}`);
  }
};

// Upload file
export const uploadFile = async (file, onProgress = null) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    // Add progress callback if provided
    if (onProgress) {
      config.onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      };
    }

    const response = await api.post(apiEndpoints.upload, formData, config);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message;
    throw new Error(`上传失败：${errorMessage}`);
  }
};

// Analyze image (upload + AI analysis)
export const analyzeImage = async (file, onProgress = null) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 seconds for AI analysis
    };

    // Add progress callback if provided
    if (onProgress) {
      config.onUploadProgress = (progressEvent) => {
        // Upload progress is typically 0-50%, analysis is 50-100%
        const uploadProgress = Math.round(
          (progressEvent.loaded * 50) / progressEvent.total
        );
        onProgress(uploadProgress);
      };
    }

    const response = await api.post(apiEndpoints.analyze, formData, config);
    
    // Complete progress if callback provided
    if (onProgress) {
      onProgress(100);
    }

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message;
    throw new Error(`分析失败：${errorMessage}`);
  }
};

// Test OpenAI connection
export const testOpenAI = async () => {
  try {
    const response = await api.get(apiEndpoints.testOpenAI);
    return response.data;
  } catch (error) {
    throw new Error(`OpenAI测试失败：${error.message}`);
  }
};

// Get API status
export const getApiStatus = async () => {
  try {
    const response = await api.get(apiEndpoints.status);
    return response.data;
  } catch (error) {
    throw new Error(`状态检查失败：${error.message}`);
  }
};

// Generic API call helper
export const apiCall = async (method, endpoint, data = null, config = {}) => {
  try {
    const response = await api({
      method,
      url: endpoint,
      data,
      ...config
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message;
    throw new Error(errorMessage);
  }
};

export default api;
