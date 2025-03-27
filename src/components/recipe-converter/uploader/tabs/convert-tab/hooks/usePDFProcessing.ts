
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { extractTextFromPDF } from '@/lib/ai-services/pdf/pdf-extractor';
import { logInfo, logError } from '@/utils/logger';
import { createThrottledProgressReporter } from '@/lib/ai-services/pdf/ocr/ocr-utils';

// Constants
const PDF_PROCESSING_TIMEOUT = 30000; // 30 seconds

// Extract the processPDF function for direct import
export const processPDF = async (
  file: File,
  onSuccess: (text: string) => void,
  onError: (error: string) => void,
  onProgress?: (progress: number) => void
): Promise<{ cancel: () => void } | null> => {
  try {
    // Create a cancellation flag
    let isCancelled = false;
    let timeoutId: number | null = null;
    
    // Create a timeout to prevent hanging
    timeoutId = window.setTimeout(() => {
      if (!isCancelled) {
        isCancelled = true;
        logError('PDF processing timed out', { timeout: PDF_PROCESSING_TIMEOUT });
        onError("PDF processing timed out. Try a smaller file or try pasting the recipe text directly.");
      }
    }, PDF_PROCESSING_TIMEOUT);
    
    // Progress callback with throttling
    const progressCallback = onProgress ? 
      createThrottledProgressReporter(onProgress, 300) : 
      () => {}; // No-op if no progress callback provided
    
    // Extract text from PDF
    const extractResult = await extractTextFromPDF(file, progressCallback);
    
    // Clear timeout
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    // Check if cancelled
    if (isCancelled) {
      return null;
    }
    
    // Check if the result is null
    if (extractResult === null) {
      logInfo("PDF extraction returned null");
      onError("Failed to extract text from the PDF. The file may be empty or corrupted.");
      return null;
    }
    
    // Check if the result is a cancellable task object
    if (typeof extractResult === 'object' && extractResult !== null && 'cancel' in extractResult) {
      return {
        cancel: () => {
          isCancelled = true;
          if (timeoutId !== null) {
            window.clearTimeout(timeoutId);
            timeoutId = null;
          }
          (extractResult as { cancel: () => void }).cancel();
        }
      };
    }
    
    // If we got text back, use it
    const extractedText = typeof extractResult === 'string' ? extractResult : '';
    
    if (extractedText.trim().length === 0) {
      onError("No text was extracted from the PDF. It might be an image-based PDF or contain no text.");
      return null;
    }
    
    onSuccess(extractedText);
    return null;
    
  } catch (error) {
    logError('PDF processing error:', { error });
    
    let errorMessage = "Failed to extract text from the PDF.";
    
    if (error instanceof Error) {
      errorMessage += ` ${error.message}`;
    }
    
    onError(errorMessage);
    return null;
  }
};

export const usePDFProcessing = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const cancelRef = useRef<(() => void) | null>(null);
  
  const handlePDFProcessing = async (
    file: File,
    onSuccess: (text: string) => void,
    onError: (error: string) => void
  ): Promise<{ cancel: () => void } | null> => {
    try {
      // Clean up any previous processing
      if (cancelRef.current) {
        cancelRef.current();
        cancelRef.current = null;
      }
      
      setIsProcessing(true);
      setProgress(0);
      
      toast({
        title: "Processing PDF",
        description: "Extracting text from your PDF...",
      });
      
      // Process the PDF
      const result = await processPDF(
        file, 
        (text) => {
          setIsProcessing(false);
          setProgress(100);
          onSuccess(text);
          
          toast({
            title: "Text Extracted",
            description: "Successfully extracted text from your PDF.",
          });
        }, 
        (error) => {
          setIsProcessing(false);
          setProgress(0);
          onError(error);
          
          toast({
            variant: "destructive",
            title: "PDF Processing Failed",
            description: error,
          });
        },
        (progress) => {
          setProgress(Math.round(progress * 100));
        }
      );
      
      // Store the cancel function if one was returned
      if (result && typeof result.cancel === 'function') {
        cancelRef.current = result.cancel;
      }
      
      return result;
      
    } catch (error) {
      setIsProcessing(false);
      setProgress(0);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      toast({
        variant: "destructive",
        title: "PDF Processing Error",
        description: errorMessage,
      });
      
      onError(errorMessage);
      return null;
    }
  };
  
  const cancelProcessing = () => {
    if (cancelRef.current) {
      cancelRef.current();
      cancelRef.current = null;
      setIsProcessing(false);
      setProgress(0);
      return true;
    }
    return false;
  };
  
  return {
    isProcessing,
    progress,
    processPDF: handlePDFProcessing,
    cancelProcessing
  };
};
