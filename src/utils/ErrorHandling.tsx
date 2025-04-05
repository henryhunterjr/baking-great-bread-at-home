
import React, { Component, ErrorInfo, ReactNode, createContext, useContext, useState } from 'react';
import { logError } from '@/utils/logger';

// Types
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ErrorDetails {
  message: string;
  code?: string;
  severity: ErrorSeverity;
  component?: string;
  timestamp: number;
  data?: any;
}

// Context
interface ErrorContextType {
  errors: ErrorDetails[];
  addError: (error: Error | string, options?: {
    code?: string;
    severity?: ErrorSeverity;
    component?: string;
    data?: any;
  }) => void;
  clearErrors: () => void;
  hasErrors: boolean;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

// Provider component
export function ErrorProvider({ children }: { children: ReactNode }) {
  const [errors, setErrors] = useState<ErrorDetails[]>([]);
  
  const addError = (error: Error | string, options: {
    code?: string;
    severity?: ErrorSeverity;
    component?: string;
    data?: any;
  } = {}) => {
    const errorDetails: ErrorDetails = {
      message: typeof error === 'string' ? error : error.message,
      code: options.code || 'UNKNOWN',
      severity: options.severity || 'medium',
      component: options.component,
      timestamp: Date.now(),
      data: options.data
    };
    
    // Add to state
    setErrors(prev => [errorDetails, ...prev].slice(0, 50)); // Keep last 50 errors
    
    // Log to console using the app's logger
    logError(`[${errorDetails.code}] ${errorDetails.message}`, options.data || {});
    
    // Store in localStorage for persistence
    try {
      const storedErrors = JSON.parse(localStorage.getItem('error_log') || '[]');
      const updatedErrors = [errorDetails, ...storedErrors].slice(0, 50);
      localStorage.setItem('error_log', JSON.stringify(updatedErrors));
    } catch (e) {
      console.error('Failed to store error in localStorage:', e);
    }
    
    // For critical errors, you might want to send to a monitoring service
    if (errorDetails.severity === 'critical') {
      // e.g., sendToMonitoringService(errorDetails);
    }
  };
  
  const clearErrors = () => {
    setErrors([]);
    localStorage.removeItem('error_log');
  };
  
  return (
    <ErrorContext.Provider value={{
      errors,
      addError,
      clearErrors,
      hasErrors: errors.length > 0
    }}>
      {children}
    </ErrorContext.Provider>
  );
}

// Hook
export function useErrorHandling() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorHandling must be used within an ErrorProvider');
  }
  return context;
}

// Error toast notification component
export const ErrorToast: React.FC = () => {
  const { errors, clearErrors } = useErrorHandling();
  
  if (errors.length === 0) return null;
  
  // Only show the most recent error
  const latestError = errors[0];
  
  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-md p-4 bg-destructive/90 text-destructive-foreground rounded-lg shadow-lg animate-in slide-in-from-right">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">
            {latestError.code ? `[${latestError.code}] ` : ''}Error
          </h3>
          <p className="mt-1">{latestError.message}</p>
          {errors.length > 1 && (
            <p className="mt-2 text-sm opacity-80">
              +{errors.length - 1} more {errors.length - 1 === 1 ? 'error' : 'errors'}
            </p>
          )}
        </div>
        <button
          onClick={clearErrors}
          className="ml-4 text-destructive-foreground/90 hover:text-destructive-foreground"
          aria-label="Dismiss error"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
