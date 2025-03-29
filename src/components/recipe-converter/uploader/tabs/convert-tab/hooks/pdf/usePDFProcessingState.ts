
import { useState } from 'react';
import { PDFProcessingResult } from '../types';

export interface PDFProcessingState {
  processing: boolean;
  progress: number;
  result: PDFProcessingResult;
}

/**
 * Hook to manage PDF processing state
 */
export const usePDFProcessingState = (initialState?: Partial<PDFProcessingState>) => {
  const [processingState, setProcessingState] = useState<PDFProcessingState>({
    processing: false,
    progress: 0,
    result: { text: null, error: null },
    ...initialState
  });

  const startProcessing = () => {
    setProcessingState(prevState => ({ 
      ...prevState, 
      processing: true, 
      progress: 0, 
      result: { text: null, error: null } 
    }));
  };

  const updateProgress = (progress: number) => {
    setProcessingState(prevState => ({ 
      ...prevState, 
      progress: Math.round(progress) 
    }));
  };

  const setError = (error: string) => {
    setProcessingState(prevState => ({
      ...prevState,
      processing: false,
      progress: 0,
      result: { text: null, error }
    }));
  };

  const setComplete = (text: string) => {
    setProcessingState(prevState => ({
      ...prevState,
      processing: false,
      progress: 100,
      result: { text, error: null }
    }));
  };

  const stopProcessing = () => {
    setProcessingState(prevState => ({ 
      ...prevState, 
      processing: false 
    }));
  };

  return {
    ...processingState,
    startProcessing,
    updateProgress,
    setError,
    setComplete,
    stopProcessing,
    setProcessingState
  };
};
