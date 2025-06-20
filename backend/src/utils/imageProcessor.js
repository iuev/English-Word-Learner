import fs from 'fs';
import path from 'path';

// Supported image formats
export const SUPPORTED_FORMATS = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif']
};

// Maximum file size (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Validate image file
export function validateImageFile(file) {
  const errors = [];

  // Check if file exists
  if (!file) {
    errors.push('No file provided');
    return { isValid: false, errors };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File size (${formatFileSize(file.size)}) exceeds maximum allowed size (${formatFileSize(MAX_FILE_SIZE)})`);
  }

  // Check file type
  if (!Object.keys(SUPPORTED_FORMATS).includes(file.mimetype)) {
    errors.push(`Unsupported file type: ${file.mimetype}. Supported types: ${Object.keys(SUPPORTED_FORMATS).join(', ')}`);
  }

  // Check file extension
  const fileExt = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = Object.values(SUPPORTED_FORMATS).flat();
  if (!allowedExtensions.includes(fileExt)) {
    errors.push(`Unsupported file extension: ${fileExt}. Supported extensions: ${allowedExtensions.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Get image metadata
export function getImageMetadata(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error('File does not exist');
    }

    const stats = fs.statSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const basename = path.basename(filePath);

    return {
      path: filePath,
      filename: basename,
      extension: ext,
      size: stats.size,
      sizeFormatted: formatFileSize(stats.size),
      created: stats.birthtime,
      modified: stats.mtime,
      mimetype: getMimeTypeFromExtension(ext)
    };
  } catch (error) {
    throw new Error(`Failed to get image metadata: ${error.message}`);
  }
}

// Format file size in human readable format
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Get MIME type from file extension
export function getMimeTypeFromExtension(extension) {
  const ext = extension.toLowerCase();
  
  for (const [mimeType, extensions] of Object.entries(SUPPORTED_FORMATS)) {
    if (extensions.includes(ext)) {
      return mimeType;
    }
  }
  
  return 'application/octet-stream';
}

// Check if file is a valid image
export function isValidImageFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }

    const ext = path.extname(filePath).toLowerCase();
    const allowedExtensions = Object.values(SUPPORTED_FORMATS).flat();
    
    return allowedExtensions.includes(ext);
  } catch (error) {
    return false;
  }
}

// Clean up temporary files
export function cleanupTempFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Cleaned up temporary file: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Failed to cleanup file ${filePath}:`, error.message);
    return false;
  }
}

// Create safe filename
export function createSafeFilename(originalName) {
  const ext = path.extname(originalName);
  const basename = path.basename(originalName, ext);
  
  // Remove unsafe characters and limit length
  const safeName = basename
    .replace(/[^a-zA-Z0-9\-_]/g, '_')
    .substring(0, 50);
  
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  
  return `${safeName}_${timestamp}_${random}${ext}`;
}

// Validate image buffer (for base64 images)
export function validateImageBuffer(buffer, originalName = 'unknown') {
  const errors = [];

  if (!Buffer.isBuffer(buffer)) {
    errors.push('Invalid buffer provided');
    return { isValid: false, errors };
  }

  if (buffer.length === 0) {
    errors.push('Empty buffer provided');
    return { isValid: false, errors };
  }

  if (buffer.length > MAX_FILE_SIZE) {
    errors.push(`Buffer size (${formatFileSize(buffer.length)}) exceeds maximum allowed size (${formatFileSize(MAX_FILE_SIZE)})`);
  }

  // Check file signature (magic numbers)
  const signature = buffer.toString('hex', 0, 4).toUpperCase();
  const validSignatures = {
    'FFD8': 'image/jpeg',  // JPEG
    '89504E47': 'image/png',  // PNG
    '47494638': 'image/gif'   // GIF
  };

  let detectedType = null;
  for (const [sig, type] of Object.entries(validSignatures)) {
    if (signature.startsWith(sig)) {
      detectedType = type;
      break;
    }
  }

  if (!detectedType) {
    errors.push('Invalid image format detected');
  }

  return {
    isValid: errors.length === 0,
    errors,
    detectedType,
    size: buffer.length
  };
}

// Image processing statistics
export function getProcessingStats() {
  return {
    supportedFormats: Object.keys(SUPPORTED_FORMATS),
    maxFileSize: MAX_FILE_SIZE,
    maxFileSizeFormatted: formatFileSize(MAX_FILE_SIZE),
    allowedExtensions: Object.values(SUPPORTED_FORMATS).flat()
  };
}
