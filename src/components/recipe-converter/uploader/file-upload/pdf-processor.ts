
import { extractTextFromPDF, ExtractTextResult, CancellableTask } from '@/lib/ai-services/pdf';
import { logError, logInfo } from '@/utils/logger';
import { ProcessingCallbacks, ProcessingTask } from './types';
import { cleanOCRText } from '@/lib/ai-services/text-cleaner';

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
  let processingTask: CancellableTask | null = null;
  let timeoutId: number | null = null;
  
  try {
    logInfo("Processing PDF file:", { filename: file.name, filesize: file.size });
    
    // Validate file size before processing - reduce max size from 15MB to 8MB
    if (file.size > 8 * 1024 * 1024) {
      onError("PDF file is too large (max 8MB). Try using a smaller file or extract just the recipe text and use text input instead.");
      return null;
    }
    
    // Validate file type more strictly
    if (!file.type.toLowerCase().includes('pdf')) {
      onError("Invalid file type. Please upload a valid PDF document.");
      return null;
    }
    
    // Create timeout for user feedback - reduced from 60 seconds to 30 seconds
    timeoutId = window.setTimeout(() => {
      if (!isCancelled) {
        isCancelled = true;
        onError('PDF processing timed out after 30 seconds. Try a smaller file or extract just the recipe text and use text input instead.');
        
        // Try to cancel the processing task if it exists
        if (processingTask && processingTask.cancel) {
          processingTask.cancel();
        }
      }
    }, 30000); // 30-second timeout
    
    // Extract text from the PDF with progress reporting
    const extractResult = await extractTextFromPDF(file, (progress) => {
      if (isCancelled) return;
      logInfo("PDF processing progress:", { progress });
      onProgress(progress);
    });
    
    // Clear the timeout since we finished successfully
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    // If processing was cancelled, don't proceed
    if (isCancelled) return null;
    
    // Handle different types of results
    if (extractResult === null) {
      onError("Failed to extract text from the PDF. The file may be empty or corrupted. Try using text input instead.");
      return null;
    }
    
    // Check if the result is a cancellable task object
    if (typeof extractResult === 'object' && extractResult !== null && 'cancel' in extractResult) {
      processingTask = extractResult as CancellableTask;
      return {
        cancel: () => {
          if (processingTask) processingTask.cancel();
          isCancelled = true;
          // Clear the timeout if it exists
          if (timeoutId !== null) {
            window.clearTimeout(timeoutId);
            timeoutId = null;
          }
        }
      };
    }
    
    // At this point, we know extractResult is a string
    const extractedText = extractResult as string;
    
    logInfo("PDF extraction complete, text length:", { length: extractedText.length });
    
    // Improved empty text detection with better messaging
    if (extractedText.trim().length === 0) {
      onError("No text was found in this PDF. It may contain only images or be scanned. Try uploading an image version instead, or copy the recipe text manually.");
      return null;
    }
    
    // Check if text is potentially incomplete or low quality
    if (extractedText.trim().length < 200) {
      logInfo("PDF extraction returned limited text", { textLength: extractedText.length });
    }
    
    // Clean the extracted text
    const cleanedText = cleanOCRText(extractedText);
    
    // Pass the cleaned text to the callback
    onComplete(cleanedText);
  } catch (err) {
    logError('PDF processing error:', { error: err });
    
    // Clear the timeout if it exists
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    if (!isCancelled) {
      // Provide more specific error messages based on the error type
      if (err instanceof Error) {
        if (err.message.includes('timed out')) {
          onError(`The PDF processing timed out. Try a smaller or simpler PDF, extract just the recipe section, or try pasting the recipe text directly.`);
        } else if (err.message.includes('password')) {
          onError(`This PDF appears to be password protected. Please provide an unprotected PDF document.`);
        } else if (err.message.includes('worker') || err.message.includes('network')) {
          onError(`A network error occurred while processing the PDF. Please check your connection and try again.`);
        } else {
          onError(`Failed to process the PDF: ${err.message}. Please try again with a different file or format.`);
        }
      } else {
        onError(`Failed to process the PDF. Please try again with a different file or format, or try pasting the recipe text directly.`);
      }
    }
  }
  
  return {
    cancel: () => {
      isCancelled = true;
      // Clear the timeout if it exists
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (processingTask) processingTask.cancel();
      logInfo("PDF processing cancelled by user", {});
    }
  };
};
