
import { useCallback } from 'react';
import { logError, logInfo } from '@/utils/logger';
import { PDFProcessingCallbacks } from '../types';
import { usePDFProcessingState } from './usePDFProcessingState';
import { processPDFWithTimeout, processPDFText } from './pdfProcessingUtils';

/**
 * Hook for PDF processing with state management
 */
export const usePDFProcessing = (
  file: File | null,
  callbacks: PDFProcessingCallbacks = {}
) => {
  const { 
    processing, 
    progress, 
    result,
    startProcessing,
    updateProgress,
    setError,
    setComplete,
    stopProcessing
  } = usePDFProcessingState();

  const { onProgress, onComplete, onError } = callbacks;

  const processPDF = useCallback(async () => {
    if (!file) {
      console.warn("No file to process.");
      return;
    }

    startProcessing();
    const progressCallback = (progress: number) => {
      updateProgress(progress);
      onProgress?.(progress);
    };

    const handleError = (error: string) => {
      logError("PDF processing error:", { error });
      setError(error);
      onError?.(error);
    };

    try {
      logInfo("Starting PDF processing", { filename: file.name, filesize: file.size });
      
      const extractResult = await processPDFWithTimeout(file, progressCallback);
      
      // Handle different types of results
      if (extractResult === null || extractResult === undefined) {
        handleError("Failed to extract text from the PDF. The file may be empty or corrupted.");
        return;
      }
      
      // Check if the result is a cancellable task
      if (typeof extractResult === 'object' && extractResult !== null && 'cancel' in extractResult) {
        // Store the cancellable task reference for later use
        return;
      }
      
      // At this point, we know extractResult is a string
      const extractedText = extractResult as string;
      
      try {
        const cleanedText = processPDFText(extractedText);
        
        setComplete(cleanedText);
        logInfo("PDF extraction complete", { textLength: cleanedText.length });
        onComplete?.({ text: cleanedText, error: null });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred processing the PDF text";
        handleError(errorMessage);
      }

    } catch (error: any) {
      handleError(error.message || "An unexpected error occurred during PDF processing.");
    } finally {
      stopProcessing();
    }
  }, [file, onProgress, onComplete, onError, startProcessing, updateProgress, setError, setComplete, stopProcessing]);

  return {
    processing,
    progress,
    result,
    processPDF,
  };
};
