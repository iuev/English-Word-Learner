// File validation utilities

// Supported file types
export const SUPPORTED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif']
};

// Maximum file size (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Validate file type
export const validateFileType = (file) => {
  const supportedTypes = Object.keys(SUPPORTED_TYPES);
  
  if (!supportedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `不支持的文件类型：${file.type}。支持的类型：${supportedTypes.join(', ')}`
    };
  }
  
  return { isValid: true };
};

// Validate file size
export const validateFileSize = (file) => {
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `文件大小 (${formatFileSize(file.size)}) 超过最大允许大小 (${formatFileSize(MAX_FILE_SIZE)})`
    };
  }
  
  return { isValid: true };
};

// Validate file extension
export const validateFileExtension = (file) => {
  const fileName = file.name.toLowerCase();
  const allowedExtensions = Object.values(SUPPORTED_TYPES).flat();
  
  const hasValidExtension = allowedExtensions.some(ext => 
    fileName.endsWith(ext.toLowerCase())
  );
  
  if (!hasValidExtension) {
    return {
      isValid: false,
      error: `无效的文件扩展名。支持的扩展名：${allowedExtensions.join(', ')}`
    };
  }
  
  return { isValid: true };
};

// Comprehensive file validation
export const validateFile = (file) => {
  const errors = [];
  
  // Check if file exists
  if (!file) {
    return {
      isValid: false,
      errors: ['未提供文件']
    };
  }
  
  // Validate file type
  const typeValidation = validateFileType(file);
  if (!typeValidation.isValid) {
    errors.push(typeValidation.error);
  }
  
  // Validate file size
  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.isValid) {
    errors.push(sizeValidation.error);
  }
  
  // Validate file extension
  const extensionValidation = validateFileExtension(file);
  if (!extensionValidation.isValid) {
    errors.push(extensionValidation.error);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Format file size in human readable format
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get file extension
export const getFileExtension = (fileName) => {
  return fileName.slice((fileName.lastIndexOf('.') - 1 >>> 0) + 2);
};

// Check if file is an image
export const isImageFile = (file) => {
  return file.type.startsWith('image/');
};

// Create file preview URL
export const createFilePreview = (file) => {
  if (!isImageFile(file)) {
    return null;
  }
  
  return URL.createObjectURL(file);
};

// Clean up file preview URL
export const cleanupFilePreview = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

// Get file metadata
export const getFileMetadata = (file) => {
  return {
    name: file.name,
    size: file.size,
    sizeFormatted: formatFileSize(file.size),
    type: file.type,
    extension: getFileExtension(file.name),
    lastModified: new Date(file.lastModified),
    isImage: isImageFile(file)
  };
};

// Validate multiple files
export const validateFiles = (files) => {
  const results = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const validation = validateFile(file);
    
    results.push({
      file,
      ...validation,
      metadata: getFileMetadata(file)
    });
  }
  
  return results;
};

// File validation configuration
export const getValidationConfig = () => {
  return {
    supportedTypes: SUPPORTED_TYPES,
    maxFileSize: MAX_FILE_SIZE,
    maxFileSizeFormatted: formatFileSize(MAX_FILE_SIZE),
    allowedExtensions: Object.values(SUPPORTED_TYPES).flat()
  };
};
