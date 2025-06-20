import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLearningHistory, useLearningStats } from '../hooks/useLocalStorage';

// Initial state
const initialState = {
  // UI state
  loading: false,
  error: null,
  
  // Word learning state
  words: [],
  translations: [],
  currentSession: null,
  learningMode: 'hidden', // 'hidden' | 'revealed' | 'mixed'
  
  // Upload state
  uploadedImage: null,
  analysisResult: null,
  
  // User preferences
  preferences: {
    autoReveal: false,
    studyMode: 'flashcard',
    language: 'zh-CN'
  }
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_WORDS: 'SET_WORDS',
  SET_TRANSLATIONS: 'SET_TRANSLATIONS',
  SET_ANALYSIS_RESULT: 'SET_ANALYSIS_RESULT',
  SET_UPLOADED_IMAGE: 'SET_UPLOADED_IMAGE',
  SET_LEARNING_MODE: 'SET_LEARNING_MODE',
  TOGGLE_WORD_VISIBILITY: 'TOGGLE_WORD_VISIBILITY',
  RESET_SESSION: 'RESET_SESSION',
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES'
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case ActionTypes.SET_WORDS:
      return {
        ...state,
        words: action.payload
      };

    case ActionTypes.SET_TRANSLATIONS:
      return {
        ...state,
        translations: action.payload
      };

    case ActionTypes.SET_ANALYSIS_RESULT:
      return {
        ...state,
        analysisResult: action.payload,
        words: action.payload?.words || [],
        translations: action.payload?.translations || [],
        currentSession: {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          wordCount: action.payload?.words?.length || 0
        }
      };

    case ActionTypes.SET_UPLOADED_IMAGE:
      return {
        ...state,
        uploadedImage: action.payload
      };

    case ActionTypes.SET_LEARNING_MODE:
      return {
        ...state,
        learningMode: action.payload
      };

    case ActionTypes.TOGGLE_WORD_VISIBILITY:
      return {
        ...state,
        words: state.words.map((word, index) => 
          index === action.payload 
            ? { ...word, revealed: !word.revealed }
            : word
        )
      };

    case ActionTypes.RESET_SESSION:
      return {
        ...state,
        words: [],
        translations: [],
        analysisResult: null,
        uploadedImage: null,
        currentSession: null,
        error: null
      };

    case ActionTypes.UPDATE_PREFERENCES:
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.payload
        }
      };

    default:
      return state;
  }
}

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('englishLearnerPreferences');
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        dispatch({
          type: ActionTypes.UPDATE_PREFERENCES,
          payload: preferences
        });
      } catch (error) {
        console.error('Failed to load preferences:', error);
      }
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('englishLearnerPreferences', JSON.stringify(state.preferences));
  }, [state.preferences]);

  // Action creators
  const actions = {
    setLoading: (loading) => dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ActionTypes.SET_ERROR, payload: error }),
    clearError: () => dispatch({ type: ActionTypes.CLEAR_ERROR }),
    setWords: (words) => dispatch({ type: ActionTypes.SET_WORDS, payload: words }),
    setTranslations: (translations) => dispatch({ type: ActionTypes.SET_TRANSLATIONS, payload: translations }),
    setAnalysisResult: (result) => dispatch({ type: ActionTypes.SET_ANALYSIS_RESULT, payload: result }),
    setUploadedImage: (image) => dispatch({ type: ActionTypes.SET_UPLOADED_IMAGE, payload: image }),
    setLearningMode: (mode) => dispatch({ type: ActionTypes.SET_LEARNING_MODE, payload: mode }),
    toggleWordVisibility: (index) => dispatch({ type: ActionTypes.TOGGLE_WORD_VISIBILITY, payload: index }),
    resetSession: () => dispatch({ type: ActionTypes.RESET_SESSION }),
    updatePreferences: (preferences) => dispatch({ type: ActionTypes.UPDATE_PREFERENCES, payload: preferences })
  };

  const value = {
    ...state,
    ...actions
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
