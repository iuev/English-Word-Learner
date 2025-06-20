import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import WordCard from './WordCard';
import LearningControls from './LearningControls';
import Button from './Button';

const WordList = () => {
  const {
    analysisResult,
    learningMode,
    setLearningMode,
    resetSession
  } = useApp();

  // Local state for word learning progress
  const [wordStates, setWordStates] = useState([]);

  // Initialize word states when analysis result changes
  useEffect(() => {
    if (analysisResult && analysisResult.translations) {
      const initialStates = analysisResult.translations.map(() => ({
        isRevealed: learningMode === 'revealed',
        isMastered: false
      }));
      setWordStates(initialStates);
    }
  }, [analysisResult, learningMode]);

  // Handle individual word reveal toggle
  const handleToggleReveal = (index, isRevealed) => {
    setWordStates(prev => prev.map((state, i) => 
      i === index ? { ...state, isRevealed } : state
    ));
  };

  // Handle individual word mastered toggle
  const handleToggleMastered = (index, isMastered) => {
    setWordStates(prev => prev.map((state, i) => 
      i === index ? { ...state, isMastered } : state
    ));
  };

  // Reveal all words
  const handleRevealAll = () => {
    setWordStates(prev => prev.map(state => ({ ...state, isRevealed: true })));
    setLearningMode('revealed');
  };

  // Hide all words
  const handleHideAll = () => {
    setWordStates(prev => prev.map(state => ({ ...state, isRevealed: false })));
    setLearningMode('hidden');
  };

  // Toggle learning mode
  const handleToggleLearningMode = () => {
    const newMode = learningMode === 'hidden' ? 'revealed' : 'hidden';
    setLearningMode(newMode);
    
    // Update all word states based on new mode
    setWordStates(prev => prev.map(state => ({
      ...state,
      isRevealed: newMode === 'revealed'
    })));
  };

  // Reset learning session
  const handleResetSession = () => {
    if (window.confirm('确定要重新开始学习吗？这将清除当前的学习进度。')) {
      resetSession();
    }
  };

  // Calculate statistics
  const totalWords = wordStates.length;
  const revealedWords = wordStates.filter(state => state.isRevealed).length;
  const masteredWords = wordStates.filter(state => state.isMastered).length;

  // Don't render if no analysis result
  if (!analysisResult || !analysisResult.translations || analysisResult.translations.length === 0) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          开始学习单词 📚
        </h2>
        <p className="text-lg text-gray-600">
          从图片中识别出 {totalWords} 个英语单词，点击卡片查看英文
        </p>
      </div>

      {/* Learning Controls */}
      <LearningControls
        totalWords={totalWords}
        revealedWords={revealedWords}
        masteredWords={masteredWords}
        onRevealAll={handleRevealAll}
        onHideAll={handleHideAll}
        onResetSession={handleResetSession}
        onToggleLearningMode={handleToggleLearningMode}
      />

      {/* Word Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {analysisResult.translations.map((translation, index) => (
          <WordCard
            key={`${translation.english}-${index}`}
            english={translation.english}
            chinese={translation.chinese}
            index={index}
            isRevealed={wordStates[index]?.isRevealed || false}
            isMastered={wordStates[index]?.isMastered || false}
            onToggleReveal={handleToggleReveal}
            onToggleMastered={handleToggleMastered}
            animationDelay={index * 100} // Stagger animation
          />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          variant="outline"
          onClick={handleResetSession}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          }
        >
          上传新图片
        </Button>
        
        {masteredWords === totalWords && (
          <Button
            variant="success"
            className="bounce-animation"
            icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            }
          >
            学习完成！
          </Button>
        )}
      </div>

      {/* Learning Tips */}
      {masteredWords < totalWords && (
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">学习建议 💡</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-start">
              <span className="text-blue-600 mr-2">1.</span>
              <span>先看中文翻译，尝试回忆对应的英文单词</span>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 mr-2">2.</span>
              <span>点击卡片查看英文，检验自己的记忆</span>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 mr-2">3.</span>
              <span>掌握的单词点击 ✓ 标记，便于跟踪进度</span>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 mr-2">4.</span>
              <span>多次复习未掌握的单词，加深印象</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordList;
