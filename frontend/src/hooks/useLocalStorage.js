import { useState, useEffect } from 'react';

// Custom hook for localStorage with JSON serialization
export const useLocalStorage = (key, initialValue) => {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Remove item from localStorage
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};

// Hook for learning session history
export const useLearningHistory = () => {
  const [history, setHistory, removeHistory] = useLocalStorage('learningHistory', []);

  const addSession = (session) => {
    const newSession = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...session
    };
    
    setHistory(prev => [newSession, ...prev.slice(0, 9)]); // Keep last 10 sessions
  };

  const clearHistory = () => {
    removeHistory();
  };

  const getSessionById = (id) => {
    return history.find(session => session.id === id);
  };

  return {
    history,
    addSession,
    clearHistory,
    getSessionById
  };
};

// Hook for user preferences
export const useUserPreferences = () => {
  const [preferences, setPreferences] = useLocalStorage('userPreferences', {
    autoReveal: false,
    studyMode: 'flashcard',
    language: 'zh-CN',
    animationsEnabled: true,
    soundEnabled: false,
    theme: 'light'
  });

  const updatePreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetPreferences = () => {
    setPreferences({
      autoReveal: false,
      studyMode: 'flashcard',
      language: 'zh-CN',
      animationsEnabled: true,
      soundEnabled: false,
      theme: 'light'
    });
  };

  return {
    preferences,
    updatePreference,
    resetPreferences
  };
};

// Hook for learning statistics
export const useLearningStats = () => {
  const [stats, setStats] = useLocalStorage('learningStats', {
    totalSessions: 0,
    totalWords: 0,
    totalMastered: 0,
    averageAccuracy: 0,
    streakDays: 0,
    lastStudyDate: null
  });

  const updateStats = (sessionData) => {
    setStats(prev => {
      const today = new Date().toDateString();
      const lastStudy = prev.lastStudyDate ? new Date(prev.lastStudyDate).toDateString() : null;
      
      // Calculate streak
      let newStreak = prev.streakDays;
      if (lastStudy !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastStudy === yesterday.toDateString()) {
          newStreak += 1;
        } else if (lastStudy !== today) {
          newStreak = 1;
        }
      }

      const newTotalWords = prev.totalWords + sessionData.totalWords;
      const newTotalMastered = prev.totalMastered + sessionData.masteredWords;
      
      return {
        totalSessions: prev.totalSessions + 1,
        totalWords: newTotalWords,
        totalMastered: newTotalMastered,
        averageAccuracy: newTotalWords > 0 ? (newTotalMastered / newTotalWords) * 100 : 0,
        streakDays: newStreak,
        lastStudyDate: new Date().toISOString()
      };
    });
  };

  const resetStats = () => {
    setStats({
      totalSessions: 0,
      totalWords: 0,
      totalMastered: 0,
      averageAccuracy: 0,
      streakDays: 0,
      lastStudyDate: null
    });
  };

  return {
    stats,
    updateStats,
    resetStats
  };
};

export default useLocalStorage;
