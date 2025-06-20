import React, { useState, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { analyzeImage } from '../services/api';
import { validateFile, createFilePreview, cleanupFilePreview, formatFileSize } from '../utils/fileValidator';
import { compressImage, debounce } from '../utils/performance';
import Button from './Button';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';

const UploadComponent = () => {
  const {
    setLoading,
    setError,
    clearError,
    setAnalysisResult,
    setUploadedImage,
    loading,
    error
  } = useApp();

  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = useCallback((file) => {
    // Clear previous error
    clearError();
    
    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }

    // Clean up previous preview
    if (previewUrl) {
      cleanupFilePreview(previewUrl);
    }

    // Create new preview
    const newPreviewUrl = createFilePreview(file);
    setPreviewUrl(newPreviewUrl);
    setSelectedFile(file);
    setUploadedImage({
      file,
      preview: newPreviewUrl,
      name: file.name,
      size: formatFileSize(file.size)
    });
  }, [clearError, setError, setUploadedImage, previewUrl]);

  // Handle file input change
  const handleFileInputChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
      e.dataTransfer.clearData();
    }
  }, [handleFileSelect]);

  // Trigger file input click
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Handle upload and analysis
  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) {
      setError('请先选择一个文件');
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);
      clearError();

      // Call analyze API with progress callback
      const result = await analyzeImage(selectedFile, (progress) => {
        setUploadProgress(progress);
      });

      // Set analysis result
      setAnalysisResult(result.data);
      
      console.log('Analysis completed:', result);
    } catch (error) {
      console.error('Upload and analysis failed:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // Clear selection
  const clearSelection = () => {
    if (previewUrl) {
      cleanupFilePreview(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
    setUploadedImage(null);
    setUploadProgress(0);
    clearError();
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : selectedFile
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {loading ? (
          <Loading
            text={`${uploadProgress > 0 ? `上传中... ${uploadProgress}%` : '正在分析图片...'}`}
            size="large"
          />
        ) : selectedFile ? (
          // File selected state
          <div className="space-y-4">
            {previewUrl && (
              <div className="flex justify-center">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-48 max-w-full rounded-lg shadow-md"
                />
              </div>
            )}
            <div>
              <p className="text-lg font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button
                variant="primary"
                onClick={handleUploadAndAnalyze}
                disabled={loading}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              >
                分析图片
              </Button>
              <Button
                variant="outline"
                onClick={clearSelection}
                disabled={loading}
              >
                清除
              </Button>
            </div>
          </div>
        ) : (
          // Default upload state
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                上传包含英文文本的图片
              </h3>
              <p className="text-gray-600 mb-4">
                拖拽图片到此处，或点击选择文件
              </p>
              <Button
                variant="primary"
                onClick={openFileDialog}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                }
              >
                选择文件
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              <p>支持格式：JPG、PNG、GIF</p>
              <p>最大大小：10MB</p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4">
          <ErrorMessage
            error={error}
            onDismiss={clearError}
            onRetry={selectedFile ? handleUploadAndAnalyze : null}
          />
        </div>
      )}

      {/* Upload Progress */}
      {loading && uploadProgress > 0 && (
        <div className="mt-4">
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1 text-center">
            已上传 {uploadProgress}%
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadComponent;
