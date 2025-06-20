// Performance optimization utilities

// Debounce function to limit API calls
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Throttle function to limit function execution frequency
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Image compression utility
export const compressImage = (file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          resolve(new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          }));
        },
        file.type,
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

// Lazy loading utility for images
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  };

  return new IntersectionObserver(callback, { ...defaultOptions, ...options });
};

// Memory cleanup utility
export const cleanupResources = (resources) => {
  resources.forEach(resource => {
    if (typeof resource === 'string' && resource.startsWith('blob:')) {
      URL.revokeObjectURL(resource);
    }
  });
};

// Performance monitoring
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
  }

  start(label) {
    this.metrics.set(label, performance.now());
  }

  end(label) {
    const startTime = this.metrics.get(label);
    if (startTime) {
      const duration = performance.now() - startTime;
      console.log(`Performance [${label}]: ${duration.toFixed(2)}ms`);
      this.metrics.delete(label);
      return duration;
    }
    return null;
  }

  measure(label, fn) {
    this.start(label);
    const result = fn();
    this.end(label);
    return result;
  }

  async measureAsync(label, asyncFn) {
    this.start(label);
    const result = await asyncFn();
    this.end(label);
    return result;
  }
}

// Create global performance monitor instance
export const perfMonitor = new PerformanceMonitor();

// React component performance utilities
// Note: This function requires React to be imported in the consuming component
export const withPerformanceLogging = (WrappedComponent, componentName) => {
  // This will be used in JSX files that import React
  return (props) => {
    // Performance logging logic would be implemented in the consuming component
    console.log(`Rendering component: ${componentName}`);
    return WrappedComponent(props);
  };
};

// Bundle size optimization - dynamic imports
// Note: This should be used in JSX files that import React
export const loadComponent = (importFunc) => {
  // Return the import function for use with React.lazy in JSX files
  return importFunc;
};

// Error boundary is now in a separate JSX file
// Import it from: import { PerformanceErrorBoundary } from '../components/PerformanceErrorBoundary'

// Web Vitals monitoring (optional - requires web-vitals package)
export const measureWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Try to use web-vitals if available, otherwise use basic performance API
    const loadWebVitals = async () => {
      try {
        // Try to import web-vitals package
        const webVitals = await import('web-vitals');
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = webVitals;
        getCLS(onPerfEntry);
        getFID(onPerfEntry);
        getFCP(onPerfEntry);
        getLCP(onPerfEntry);
        getTTFB(onPerfEntry);
      } catch (error) {
        // web-vitals package not available, use basic performance monitoring
        console.log('Web Vitals package not available, using basic performance monitoring');

        // Basic performance monitoring using Performance API
        if ('performance' in window && 'PerformanceObserver' in window) {
          try {
            // Monitor paint metrics
            const paintObserver = new PerformanceObserver((list) => {
              list.getEntries().forEach((entry) => {
                onPerfEntry({
                  name: entry.name,
                  value: entry.startTime,
                  id: 'basic-paint-metric'
                });
              });
            });
            paintObserver.observe({ entryTypes: ['paint'] });

            // Monitor navigation timing
            const navigationObserver = new PerformanceObserver((list) => {
              list.getEntries().forEach((entry) => {
                onPerfEntry({
                  name: 'navigation-timing',
                  value: entry.loadEventEnd - entry.loadEventStart,
                  id: 'basic-navigation-metric'
                });
              });
            });
            navigationObserver.observe({ entryTypes: ['navigation'] });
          } catch (observerError) {
            console.log('Performance Observer not supported');
          }
        }
      }
    };
    loadWebVitals();
  }
};

// Local storage optimization
export const optimizedLocalStorage = {
  setItem: (key, value) => {
    try {
      const serialized = JSON.stringify(value);
      if (serialized.length > 5 * 1024 * 1024) { // 5MB limit
        console.warn(`Large data being stored in localStorage: ${key} (${serialized.length} bytes)`);
      }
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  getItem: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return null;
    }
  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }
};
