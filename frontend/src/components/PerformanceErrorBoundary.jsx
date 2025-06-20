import React from 'react';

// Error boundary for performance monitoring
export class PerformanceErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Performance Error Boundary caught an error:', error, errorInfo);
    
    // Log performance metrics when error occurs
    if (window.performance && window.performance.getEntriesByType) {
      const navigationEntries = window.performance.getEntriesByType('navigation');
      const resourceEntries = window.performance.getEntriesByType('resource');
      
      console.log('Navigation Performance:', navigationEntries);
      console.log('Resource Performance:', resourceEntries);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold text-red-600 mb-2">出现了问题</h2>
          <p className="text-gray-600">请刷新页面重试。</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PerformanceErrorBoundary;
