import React, { useState, useEffect, memo } from 'react';
import { IconButton } from './Button';

const WordCard = ({
  english,
  chinese,
  index,
  isRevealed = false,
  isMastered = false,
  onToggleReveal,
  onToggleMastered,
  animationDelay = 0
}) => {
  const [isFlipped, setIsFlipped] = useState(isRevealed);
  const [showMasteredAnimation, setShowMasteredAnimation] = useState(false);

  // Update flip state when isRevealed prop changes
  useEffect(() => {
    setIsFlipped(isRevealed);
  }, [isRevealed]);

  // Handle mastered animation
  useEffect(() => {
    if (isMastered) {
      setShowMasteredAnimation(true);
      const timer = setTimeout(() => {
        setShowMasteredAnimation(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isMastered]);

  const handleCardClick = () => {
    const newFlippedState = !isFlipped;
    setIsFlipped(newFlippedState);
    if (onToggleReveal) {
      onToggleReveal(index, newFlippedState);
    }
  };

  const handleMasteredClick = (e) => {
    e.stopPropagation(); // Prevent card flip
    if (onToggleMastered) {
      onToggleMastered(index, !isMastered);
    }
  };

  return (
    <div 
      className="fade-in"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="relative">
        {/* Mastered indicator */}
        {isMastered && (
          <div className="absolute -top-2 -right-2 z-10">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}

        {/* Card */}
        <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
          <div className="flip-card-inner">
            {/* Front side - Chinese translation */}
            <div className={`flip-card-front ${isMastered ? 'mastered-card' : ''} ${showMasteredAnimation ? 'mastered-card' : ''}`}>
              <div className="text-center">
                <div className="text-lg font-semibold mb-2">
                  {chinese}
                </div>
                <div className="text-sm opacity-75">
                  点击查看英文
                </div>
              </div>
            </div>

            {/* Back side - English word */}
            <div className={`flip-card-back ${isMastered ? 'mastered-card' : ''} ${showMasteredAnimation ? 'mastered-card' : ''}`}>
              <div className="text-center">
                <div className="text-xl font-bold mb-2">
                  {english}
                </div>
                <div className="text-sm opacity-75">
                  点击隐藏
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center mt-3 space-x-2">
          {/* Mastered toggle button */}
          <IconButton
            variant={isMastered ? 'primary' : 'ghost'}
            size="small"
            onClick={handleMasteredClick}
            className={`button-press ${isMastered ? 'bg-green-600 hover:bg-green-700' : 'hover:bg-green-100 text-green-600'}`}
            icon={
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            }
          />

          {/* Flip button */}
          <IconButton
            variant="ghost"
            size="small"
            onClick={handleCardClick}
            className="button-press hover:bg-blue-100 text-blue-600"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default memo(WordCard);
