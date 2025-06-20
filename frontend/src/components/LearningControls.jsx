import React from 'react';
import Button from './Button';
import { useApp } from '../context/AppContext';

const LearningControls = ({
  totalWords = 0,
  revealedWords = 0,
  masteredWords = 0,
  onRevealAll,
  onHideAll,
  onResetSession,
  onToggleLearningMode
}) => {
  const { learningMode } = useApp();

  const progress = totalWords > 0 ? (masteredWords / totalWords) * 100 : 0;
  const revealProgress = totalWords > 0 ? (revealedWords / totalWords) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      {/* Progress Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900">学习进度</h3>
          <span className="text-sm text-gray-600">
            {masteredWords} / {totalWords} 已掌握
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 progress-bar"
            style={{ 
              width: `${progress}%`,
              '--progress-width': `${progress}%`
            }}
          />
        </div>
        
        {/* Reveal Progress */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>已查看: {revealedWords} / {totalWords}</span>
          <span>{progress.toFixed(1)}% 完成</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {/* Reveal All */}
        <Button
          variant="outline"
          size="small"
          onClick={onRevealAll}
          className="button-press"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
        >
          显示全部
        </Button>

        {/* Hide All */}
        <Button
          variant="outline"
          size="small"
          onClick={onHideAll}
          className="button-press"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
          }
        >
          隐藏全部
        </Button>

        {/* Learning Mode Toggle */}
        <Button
          variant={learningMode === 'revealed' ? 'primary' : 'outline'}
          size="small"
          onClick={onToggleLearningMode}
          className="button-press"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        >
          学习模式
        </Button>

        {/* Reset Session */}
        <Button
          variant="danger"
          size="small"
          onClick={onResetSession}
          className="button-press"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          }
        >
          重新开始
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{totalWords}</div>
          <div className="text-sm text-gray-600">总单词数</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{revealedWords}</div>
          <div className="text-sm text-gray-600">已查看</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{masteredWords}</div>
          <div className="text-sm text-gray-600">已掌握</div>
        </div>
      </div>

      {/* Learning Tips */}
      {progress < 100 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">学习小贴士：</p>
              <p>点击卡片查看英文单词，点击 ✓ 标记已掌握的单词。建议多次复习以加深记忆。</p>
            </div>
          </div>
        </div>
      )}

      {/* Completion Message */}
      {progress === 100 && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium text-green-800">恭喜完成学习！🎉</p>
              <p className="text-sm text-green-700">你已经掌握了所有单词，可以上传新图片继续学习。</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningControls;
