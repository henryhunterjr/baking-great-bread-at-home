
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onReset?: () => void; // Add optional onReset prop
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
    
    // Log for debugging
    console.log('ErrorBoundary initialized');
  }

  static getDerivedStateFromError(error: Error): State {
    console.log('ErrorBoundary caught an error:', error.message);
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    
    // Call the onReset prop if provided
    if (this.props.onReset) {
      this.props.onReset();
    }
    
    // Try to reload the page if we're stuck with a critical error
    if (this.state.error?.message?.includes('worker') || 
        this.state.error?.message?.includes('importScripts')) {
      window.location.reload();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      const isWorkerError = this.state.error?.message?.includes('worker') || 
                          this.state.error?.message?.includes('importScripts');

      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-lg mx-auto text-center">
            <h2 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-4">Something went wrong</h2>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {isWorkerError 
                ? "There was a problem loading the required processing tools. This could be due to network issues or missing resources."
                : "We're sorry, but something unexpected happened."}
            </p>
            
            <button 
              onClick={this.handleReset}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              {isWorkerError ? "Reload page" : "Try again"}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
