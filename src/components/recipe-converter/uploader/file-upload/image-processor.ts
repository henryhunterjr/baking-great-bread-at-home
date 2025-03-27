
import { extractTextWithOCR } from '@/lib/ai-services/pdf';
import { logError, logInfo } from '@/utils/logger';
import { ProcessingCallbacks, ProcessingTask } from './types';

// Constants for timeouts
const OCR_TIMEOUT_MS = 60000; // 60 seconds

/**
 * Process an image file using OCR
 */
export const processImageFile = async (
  file: File, 
  callbacks: ProcessingCallbacks
): Promise<ProcessingTask> => {
  const { onProgress, onComplete, onError } = callbacks;
  let isAborted = false;
  let timeoutId: number | null = null;
  
  try {
    logInfo("Processing image file", { filename: file.name, fileSize: file.size });
    
    // Check file size - max 10MB
    if (file.size > 10 * 1024 * 1024) {
      onError("Image is too large (max 10MB). Please resize the image or use a different one.");
      return null;
    }
    
    // Set initial progress
    onProgress(10);
    
    // Create a timeout to prevent infinite processing
    timeoutId = window.setTimeout(() => {
      if (!isAborted) {
        isAborted = true;
        logError('Image processing timed out', { timeout: OCR_TIMEOUT_MS });
        onError("Image processing timed out. Try with a smaller or clearer image, or manually enter the recipe text.");
      }
    }, OCR_TIMEOUT_MS);
    
    // Track last progress update for throttling
    let lastProgressUpdate = 10;
    
    // Create a safe progress handler that throttles updates
    const safeProgressHandler = (ocrProgress: number) => {
      if (isAborted) return;
      
      // Map progress from 10-90%
      const mappedProgress = Math.floor(10 + (ocrProgress * 80));
      
      // Only update if progress has changed significantly (5% or more)
      if (mappedProgress > lastProgressUpdate + 5) {
        lastProgressUpdate = mappedProgress;
        logInfo("OCR progress:", { progress: mappedProgress });
        onProgress(mappedProgress);
      }
    };
    
    // Extract text from the image
    const extractedText = await extractTextWithOCR(file, safeProgressHandler);
    
    // Check if the operation was cancelled
    if (isAborted) return null;
    
    // Clear the timeout since we finished successfully
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    logInfo("OCR complete", { textLength: extractedText?.length || 0 });
    
    // Make sure we report 100% when done
    onProgress(100);
    
    // Handle empty text
    if (!extractedText || extractedText.trim().length === 0) {
      onError("No text found in the image. Please try with a clearer image or a different format.");
      return null;
    }
    
    // Pass the extracted text to the parent
    onComplete(extractedText);
    return null;
    
  } catch (err) {
    if (!isAborted) {
      logError('OCR processing error', { error: err });
      
      // Clear the timeout
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
      
      const errorMessage = err instanceof Error ? err.message : String(err);
      
      if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
        onError("OCR processing timed out. Try with a clearer image or enter the recipe text manually.");
      } else if (errorMessage.includes('memory') || errorMessage.includes('out of memory')) {
        onError("Image is too complex to process. Try with a simpler, clearer image or enter the recipe text manually.");
      } else {
        onError(`Failed to process the image: ${errorMessage}. Please try again with a different image.`);
      }
    }
    
    return null;
  }
  
  // Return a cancellation function
  return {
    cancel: () => {
      isAborted = true;
      // Clear the timeout if it exists
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
      logInfo("Image processing cancelled by user");
    }
  };
};
