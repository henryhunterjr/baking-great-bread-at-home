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
  
  // Create a cancel token
  let isCancelled = false;
  let processingTask: { cancel: () => void } | null = null;
  let timeoutId: number | null = null;
  
  try {
    logInfo("Starting PDF processing", { filename: file.name, filesize: file.size });
    
    // Validate file size before processing
    const maxSize = MAX_PDF_SIZE_MB * 1024 * 1024;
    if (file.size > maxSize) {
      onError(`PDF file is too large (max ${MAX_PDF_SIZE_MB}MB). Try using a smaller file or extract just the recipe text and use text input instead.`);
      return null;
    }
    
    // Initial progress update
    onProgress(10);
    
    // Create timeout with periodic progress updates to prevent UI freezing
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
    
    // Set timeout for overall process
    timeoutId = window.setTimeout(() => {
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
    }, PDF_TIMEOUT_MS);
    
    // Extract text from the PDF with throttled progress reporting
    const extractResult = await extractTextFromPDF(file, (progress) => {
      if (isCancelled) return;
      
      // Update progress but don't clear the interval yet
      currentProgress = Math.min(Math.round(progress * 100), 98);
      onProgress(currentProgress); // Cap at 98% until complete
      lastProgressUpdate = Date.now();
    });
    
    // Clear the timeout and interval since we finished successfully
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
    window.clearInterval(progressIntervalId);
    window.clearTimeout(warningTimeoutId);
    
    // If processing was cancelled, don't proceed
    if (isCancelled) return null;
    
    // Handle different types of results
    if (extractResult === null || extractResult === undefined) {
      onError("Failed to extract text from the PDF. The file may be empty or corrupted. Try uploading an image version instead or use text input.");
      return null;
    }
    
    // Check if the result is a cancellable task object with a type guard
    if (extractResult !== null && 
        typeof extractResult === 'object' && 
        'cancel' in extractResult && 
        typeof extractResult.cancel === 'function') {
      
      // Safely assign processingTask and return cancellable task
      processingTask = extractResult as { cancel: () => void };
      return {
        cancel: () => {
          if (processingTask && processingTask.cancel) {
            processingTask.cancel();
          }
          isCancelled = true;
          if (timeoutId !== null) {
            window.clearTimeout(timeoutId);
            timeoutId = null;
          }
          window.clearInterval(progressIntervalId);
          window.clearTimeout(warningTimeoutId);
          logInfo("PDF processing cancelled by user");
        }
      };
    }
    
    // At this point, we know extractResult is a string
    const extractedText = extractResult as string;
    
    // Final progress
    onProgress(100);
    
    logInfo("PDF extraction complete", { textLength: extractedText.length });
    
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
  } catch (err) {
    logError('PDF processing error:', { error: err });
    
    // Clear the timeout if it exists
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
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
};
