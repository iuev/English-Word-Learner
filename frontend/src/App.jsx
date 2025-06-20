import React, { Suspense } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Button from './components/Button';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';
import UploadComponent from './components/UploadComponent';
import WordList from './components/WordList';
import { PerformanceErrorBoundary } from './components/PerformanceErrorBoundary';

// Main content component that uses app context
const AppContent = () => {
  const { analysisResult, uploadedImage } = useApp();

  // Show results if analysis is complete
  if (analysisResult && analysisResult.translations && analysisResult.translations.length > 0) {
    return <WordList />;
  }

  // Show upload interface
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          用AI学习英语单词
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          上传包含英文文本的图片，让AI帮助您学习新词汇
        </p>
      </div>

      {/* Upload Component */}
      <div className="mb-12">
        <UploadComponent />
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">AI图像识别</h3>
          <p className="text-gray-600">先进的AI技术高精度提取图片中的英语单词</p>
        </div>

        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">即时翻译</h3>
          <p className="text-gray-600">为所有识别的英语单词提供即时中文翻译</p>
        </div>

        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">互动学习</h3>
          <p className="text-gray-600">通过卡片式学习模式练习，提高词汇记忆效果</p>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <PerformanceErrorBoundary>
      <AppProvider>
        <Layout>
          <Suspense fallback={<Loading text="正在加载应用..." size="large" />}>
            <AppContent />
          </Suspense>
        </Layout>
      </AppProvider>
    </PerformanceErrorBoundary>
  );
}

export default App;
