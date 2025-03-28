
import { extractTextWithOCR } from '@/lib/ai-services/pdf';
import { logError, logInfo } from '@/utils/logger';
import { ProcessingCallbacks, ProcessingTask } from './types';
import { createThrottledProgressReporter } from '@/lib/ai-services/pdf/ocr/ocr-utils';

// Constants for timeouts
const OCR_TIMEOUT_MS = 240000; // 4 minutes - doubled again from 2 minutes to handle very complex images
const OCR_WARNING_TIME_MS = 30000; // 30 seconds - when to show a warning about processing time

/**
 * Process an image file using OCR with enhanced error handling and progress reporting
 */
export const processImageFile = async (
  file: File, 
  callbacks: ProcessingCallbacks
): Promise<ProcessingTask> => {
  const { onProgress, onComplete, onError } = callbacks;
  let isAborted = false;
  let timeoutId: number | null = null;
  let warningTimeoutId: number | null = null;
  let progressInterval: number | null = null;
  
  // Create a cancellation handler
  const cancelProcessing = () => {
    if (isAborted) return;
    
    isAborted = true;
    logInfo("Image processing cancelled by user");
    
    // Clear all timers
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    if (warningTimeoutId !== null) {
      window.clearTimeout(warningTimeoutId);
      warningTimeoutId = null;
    }
    
    if (progressInterval !== null) {
      window.clearInterval(progressInterval);
      progressInterval = null;
    }
  };
  
  try {
    logInfo("Processing image file", { filename: file.name, fileSize: file.size });
    
    // Check file size - max 15MB (increased from 10MB)
    if (file.size > 15 * 1024 * 1024) {
      onError("Image is too large (max 15MB). Please resize the image or use a different one.");
      return null;
    }
    
    // Validate image type
    if (!file.type.startsWith('image/')) {
      onError("The file is not a valid image. Please upload an image file (JPEG, PNG, etc).");
      return null;
    }
    
    // Set initial progress
    onProgress(10);
    
    // Create a timeout to prevent infinite processing
    timeoutId = window.setTimeout(() => {
      if (!isAborted) {
        cancelProcessing();
        logError('Image processing timed out', { timeout: OCR_TIMEOUT_MS });
        onError("Image processing timed out. Try with a smaller or clearer image, or manually enter the recipe text.");
      }
    }, OCR_TIMEOUT_MS);
    
    // Create a warning timeout to notify user it's taking longer than expected
    warningTimeoutId = window.setTimeout(() => {
      if (!isAborted) {
        logInfo('Image processing warning: taking longer than expected');
        // Provide feedback to user but don't stop processing
        onProgress(Math.min(60, lastProgressUpdate + 5)); // Bump progress a bit to show movement
      }
    }, OCR_WARNING_TIME_MS);
    
    // Track last progress update for throttling
    let lastProgressUpdate = 10;
    
    // Set up a progress interval for better UX during long processing
    progressInterval = window.setInterval(() => {
      if (isAborted) {
        window.clearInterval(progressInterval!);
        progressInterval = null;
        return;
      }
      
      // Increment progress slightly to show activity
      if (lastProgressUpdate < 90) {
        const newProgress = Math.min(lastProgressUpdate + 1, 90);
        lastProgressUpdate = newProgress;
        onProgress(newProgress);
      }
    }, 3000); // Update every 3 seconds
    
    // Create a throttled progress handler to avoid excessive updates
    const throttledProgressHandler = createThrottledProgressReporter(
      (ocrProgress) => {
        if (isAborted) return;
        
        // Map progress from 10-90%
        const mappedProgress = Math.floor(10 + (ocrProgress * 80));
        
        lastProgressUpdate = mappedProgress;
        logInfo("OCR progress:", { progress: mappedProgress });
        onProgress(mappedProgress);
      },
      500 // Throttle to max 2 updates per second
    );
    
    // Extract text from the image
    const extractedText = await extractTextWithOCR(file, throttledProgressHandler);
    
    // Clean up all timers
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    if (warningTimeoutId !== null) {
      window.clearTimeout(warningTimeoutId);
      warningTimeoutId = null;
    }
    
    if (progressInterval !== null) {
      window.clearInterval(progressInterval);
      progressInterval = null;
    }
    
    // Check if the operation was cancelled
    if (isAborted) return null;
    
    logInfo("OCR complete", { textLength: extractedText?.length || 0 });
    
    // Make sure we report 100% when done
    onProgress(100);
    
    // Handle empty text
    if (!extractedText || extractedText.trim().length < 10) {
      onError("Insufficient text found in the image. Please try with a clearer image or a different format.");
      return null;
    }
    
    // Pass the extracted text to the parent
    onComplete(extractedText);
    return null;
    
  } catch (err) {
    if (!isAborted) {
      logError('OCR processing error', { error: err });
      
      // Clear all timers
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
      
      if (warningTimeoutId !== null) {
        window.clearTimeout(warningTimeoutId);
        warningTimeoutId = null;
      }
      
      if (progressInterval !== null) {
        window.clearInterval(progressInterval);
        progressInterval = null;
      }
      
      const errorMessage = err instanceof Error ? err.message : String(err);
      
      // Provide more specific error messages for different failure types
      if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
        onError("OCR processing timed out. Try with a clearer image or enter the recipe text manually.");
      } else if (errorMessage.includes('memory') || errorMessage.includes('out of memory')) {
        onError("Image is too complex to process. Try with a simpler, clearer image or enter the recipe text manually.");
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch failed')) {
        onError("Network error during OCR processing. Please check your connection and try again.");
      } else {
        onError(`Failed to process the image: ${errorMessage}. Please try again with a different image.`);
      }
    }
    
    return null;
  }
  
  // Return a cancellation function
  return {
    cancel: cancelProcessing
  };
};
