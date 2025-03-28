
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
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
  }

  static getDerivedStateFromError(error: Error): State {
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
            
            <Button 
              onClick={this.handleReset}
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-50"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {isWorkerError ? "Reload page" : "Try again"}
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
