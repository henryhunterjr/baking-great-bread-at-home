import { extractTextFromPDF } from '@/lib/ai-services/pdf';
import { logError, logInfo } from '@/utils/logger';
import { ProcessingCallbacks, ProcessingTask } from './types';
import { cleanOCRText } from '@/lib/ai-services/text-cleaner';

// Constants for timeouts and limits
const MAX_PDF_SIZE_MB = 20; // Increased from 15MB to 20MB
const PDF_TIMEOUT_MS = 180000; // Increased from 90s to 180s (3 minutes)

/**
 * Process a PDF file and extract its text
 */
export const processPDFFile = async (
  file: File, 
  callbacks: ProcessingCallbacks
): Promise<ProcessingTask> => {
  const { onProgress, onComplete, onError } = callbacks;
  
  // Create tracking variables
  let isCancelled = false;
  let processingTask: { cancel: () => void } | null = null;
  let timeoutId: number | null = null;
  
  try {
    logInfo("Starting PDF processing", { filename: file.name, filesize: file.size });
    
    // Validate file size before processing
    if (!validatePDFSize(file, MAX_PDF_SIZE_MB, onError)) {
      return null;
    }
    
    // Initial progress update
    onProgress(10);
    
    // Set up progress tracking and timeouts
    const { warningTimeoutId, progressIntervalId } = setupProgressTracking(
      onProgress, 
      isCancelled
    );
    
    // Set timeout for overall process
    timeoutId = setupProcessingTimeout(
      PDF_TIMEOUT_MS,
      () => {
        if (!isCancelled) {
          isCancelled = true;
          window.clearInterval(progressIntervalId);
          window.clearTimeout(warningTimeoutId);
          logError('PDF processing timed out', { timeout: PDF_TIMEOUT_MS });
          onError(`PDF processing timed out after ${PDF_TIMEOUT_MS/1000} seconds. The file may be too large or complex. Try a smaller file or extract just the recipe portion.`);
          
          // Try to cancel the processing task if it exists
          if (processingTask && processingTask.cancel) {
            processingTask.cancel();
          }
        }
      }
    );
    
    // Extract text from the PDF with throttled progress reporting
    const extractResult = await extractTextFromPDF(file, (progress) => {
      if (isCancelled) return;
      
      // Update progress but cap at 98% until complete
      const currentProgress = Math.min(Math.round(progress * 100), 98);
      onProgress(currentProgress);
    });
    
    // Clear all timers since we finished or failed
    cleanupTimers(timeoutId, progressIntervalId, warningTimeoutId);
    timeoutId = null;
    
    // If processing was cancelled, don't proceed
    if (isCancelled) return null;
    
    // Process the extraction result based on its type
    return handleExtractionResult(
      extractResult, 
      processingTask, 
      onComplete, 
      onError
    );
  } catch (err) {
    // Handle any errors in the process
    return handleProcessingError(
      err, 
      timeoutId, 
      isCancelled, 
      onError
    );
  }
};

/**
 * Validate PDF file size
 */
function validatePDFSize(
  file: File, 
  maxSizeMB: number, 
  onError: (message: string) => void
): boolean {
  const maxSize = maxSizeMB * 1024 * 1024;
  if (file.size > maxSize) {
    onError(`PDF file is too large (max ${maxSizeMB}MB). Try using a smaller file or extract just the recipe text and use text input instead.`);
    return false;
  }
  return true;
}

/**
 * Set up progress tracking and warning timeouts
 */
function setupProgressTracking(
  onProgress: (progress: number) => void,
  isCancelled: boolean
): { warningTimeoutId: number, progressIntervalId: number } {
  let lastProgressUpdate = Date.now();
  let currentProgress = 10;
  
  // Show a warning after 20 seconds
  const warningTimeoutId = window.setTimeout(() => {
    if (!isCancelled) {
      // Don't use onError here, just log a warning
      logInfo("PDF processing warning: taking longer than expected");
      onProgress(Math.min(currentProgress + 5, 98)); // Increment progress slightly
    }
  }, 20000);
  
  // Periodic progress updates for large files
  const progressIntervalId = window.setInterval(() => {
    if (isCancelled) {
      window.clearInterval(progressIntervalId);
      return;
    }
    
    // Calculate elapsed time
    const elapsedMs = Date.now() - lastProgressUpdate;
    if (elapsedMs > 2000) { // Every 2 seconds
      // Simulate progress to keep user informed during long-running operations
      currentProgress = Math.min(currentProgress + 2, 98); // Cap at 98% until we get actual completion
      onProgress(currentProgress);
      lastProgressUpdate = Date.now();
    }
  }, 2000);
  
  return { warningTimeoutId, progressIntervalId };
}

/**
 * Set up a timeout for the overall processing
 */
function setupProcessingTimeout(
  timeoutMs: number,
  onTimeout: () => void
): number {
  return window.setTimeout(onTimeout, timeoutMs);
}

/**
 * Clean up all timers
 */
function cleanupTimers(
  timeoutId: number | null,
  progressIntervalId: number,
  warningTimeoutId: number
): void {
  if (timeoutId !== null) {
    window.clearTimeout(timeoutId);
  }
  window.clearInterval(progressIntervalId);
  window.clearTimeout(warningTimeoutId);
}

/**
 * Handle the result of text extraction based on its type
 */
function handleExtractionResult(
  extractResult: any,
  processingTask: { cancel: () => void } | null,
  onComplete: (text: string) => void,
  onError: (message: string) => void
): ProcessingTask {
  // Enhanced null and type checking
  if (extractResult === null || extractResult === undefined) {
    onError("Failed to extract text from the PDF. The file may be empty or corrupted.");
    return null;
  }
  
  // Check if the result is a cancellable task with a type guard
  if (typeof extractResult === 'object' && extractResult !== null && 'cancel' in extractResult) {
    // Create a type-safe cancellable task object
    processingTask = {
      cancel: (extractResult as { cancel: () => void }).cancel
    };
    
    return {
      cancel: () => {
        if (processingTask && processingTask.cancel) {
          processingTask.cancel();
        }
        logInfo("PDF processing cancelled by user");
      }
    };
  }
  
  // At this point, we know extractResult is a string
  const extractedText = extractResult as string;
  
  // Better empty text detection with improved messaging
  if (!extractedText || extractedText.trim().length === 0) {
    onError("No text was found in this PDF. It may contain only images or be scanned. Try uploading an image version instead, or copy the recipe text manually.");
    return null;
  }
  
  // Process and clean the extracted text
  const cleanedText = cleanOCRText(extractedText);
  
  // Pass the cleaned text to the callback
  onComplete(cleanedText);
  return null;
}

/**
 * Handle errors that occur during processing
 */
function handleProcessingError(
  err: unknown,
  timeoutId: number | null,
  isCancelled: boolean,
  onError: (message: string) => void
): ProcessingTask {
  logError('PDF processing error:', { error: err });
  
  // Clear the timeout if it exists
  if (timeoutId !== null) {
    window.clearTimeout(timeoutId);
  }
  
  if (!isCancelled) {
    // Provide more specific error messages based on the error type
    const errorMessage = err instanceof Error ? err.message : String(err);
    
    if (errorMessage.includes('timed out') || errorMessage.includes('timeout')) {
      onError(`The PDF processing timed out. Try a smaller or simpler PDF, extract just the recipe section, or try pasting the recipe text directly.`);
    } else if (errorMessage.includes('password')) {
      onError(`This PDF appears to be password protected. Please provide an unprotected PDF document.`);
    } else if (errorMessage.includes('worker') || errorMessage.includes('network')) {
      onError(`A network error occurred while processing the PDF. Please check your connection and try again.`);
    } else if (errorMessage.includes('postMessage') || errorMessage.includes('cloned')) {
      onError(`There was a technical error processing your PDF. Please try using a different method like pasting the text directly.`);
    } else {
      onError(`Failed to process the PDF: ${errorMessage}. Please try again with a different file or format.`);
    }
  }
  
  return null;
}
