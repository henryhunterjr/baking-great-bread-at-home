
import { useState, useRef, useEffect } from 'react';
import { logError, logInfo } from '@/utils/logger';
import { useToast } from '@/hooks/use-toast';
import { PDFProcessingCallbacks, PDFProcessingResult } from '../types';
import { processPDFWithTimeout, processPDFText } from './pdfProcessingUtils';

/**
 * Custom hook for handling PDF file processing
 * Provides state management and processing function for PDF extraction
 */
export const usePDFProcessing = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Reference to cancellable task
  const processingTask = useRef<{ cancel: () => void } | null>(null);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (processingTask.current) {
        processingTask.current.cancel();
      }
    };
  }, []);
  
  /**
   * Process a PDF file with progress tracking and error handling
   */
  const processPDF = async (
    file: File,
    callbacks: PDFProcessingCallbacks
  ) => {
    const { onComplete, onError } = callbacks;
    
    // Reset state
    setIsProcessing(true);
    setProgress(0);
    setExtractedText(null);
    setError(null);
    
    try {
      logInfo("Starting PDF processing", { filename: file.name, filesize: file.size });
      
      // Use our enhanced PDF processing function
      const result = await processPDFWithTimeout(
        file,
        (newProgress) => {
          setProgress(Math.min(Math.round(newProgress * 100), 99));
        },
        600000  // 10 minutes timeout
      );
      
      // Handle different types of results
      if (typeof result === 'string') {
        // Process the extracted text
        const processedText = processPDFText(result);
        setExtractedText(processedText);
        setProgress(100);
        
        // Call the completion callback
        if (onComplete) {
          // Create a proper PDFProcessingResult object instead of passing just the string
          onComplete({
            text: processedText,
            error: null
          });
        }
        
        return {
          text: processedText,
          success: true
        };
      } else if (result && typeof result === 'object' && 'cancel' in result) {
        // Store the cancellable task
        processingTask.current = result;
        
        // Return the cancellable task
        return {
          text: null,
          success: false,
          cancel: result.cancel
        };
      } else {
        // Handle empty or unexpected result
        throw new Error("Failed to extract text from PDF.");
      }
    } catch (err) {
      // Log and handle errors
      logError("PDF Processing Error:", { error: err });
      
      let errorMessage = "Failed to process PDF file.";
      
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      // Call the error callback
      if (onError) {
        onError(errorMessage);
      }
      
      // Toast notification for user
      toast({
        variant: "destructive",
        title: "PDF Processing Error",
        description: errorMessage,
      });
      
      return {
        text: null,
        success: false,
        error: errorMessage
      };
    } finally {
      setIsProcessing(false);
    }
  };
  
  /**
   * Cancel any ongoing processing
   */
  const cancelProcessing = () => {
    if (processingTask.current) {
      processingTask.current.cancel();
      processingTask.current = null;
      setIsProcessing(false);
      return true;
    }
    return false;
  };
  
  return {
    isProcessing,
    progress,
    extractedText,
    error,
    processPDF,
    cancelProcessing
  };
};
