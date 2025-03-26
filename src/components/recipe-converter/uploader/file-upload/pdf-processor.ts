
import { extractTextFromPDF, ExtractTextResult, CancellableTask } from '@/lib/ai-services/pdf';
import { logError, logInfo } from '@/utils/logger';
import { ProcessingCallbacks, ProcessingTask } from './types';

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
  
  try {
    logInfo("Processing PDF file:", { filename: file.name, filesize: file.size });
    
    // Validate file size before processing
    if (file.size > 15 * 1024 * 1024) { // 15MB limit
      onError("PDF file is too large (max 15MB). Try using a smaller file or text input.");
      return null;
    }
    
    // Validate file type more strictly
    if (!file.type.toLowerCase().includes('pdf')) {
      onError("Invalid file type. Please upload a valid PDF document.");
      return null;
    }
    
    // Add timeout protection for the entire process
    const extractionPromise = Promise.race([
      // Extract text from the PDF with progress reporting
      extractTextFromPDF(file, (progress) => {
        if (isCancelled) return;
        logInfo("PDF processing progress:", { progress });
        onProgress(progress);
      }),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('PDF processing timed out after 90 seconds')), 90000) // Reduced from 120 seconds
      )
    ]);
    
    const extractResult = await extractionPromise;
    
    // If processing was cancelled, don't proceed
    if (isCancelled) return null;
    
    // Handle different types of results
    if (extractResult === null) {
      onError("Failed to extract text from the PDF. The file may be empty or corrupted.");
      return null;
    }
    
    // Check if the result is a cancellable task object
    if (typeof extractResult === 'object' && extractResult !== null && 'cancel' in extractResult) {
      processingTask = extractResult as CancellableTask;
      return {
        cancel: () => {
          if (processingTask) processingTask.cancel();
          isCancelled = true;
        }
      };
    }
    
    // At this point, we know extractResult is a string
    const extractedText = extractResult as string;
    
    logInfo("PDF extraction complete, text length:", { length: extractedText.length });
    
    // Improved empty text detection with better messaging
    if (extractedText.trim().length === 0) {
      onError("No text was found in this PDF. It may contain only images or be scanned. Try uploading an image version instead.");
      return null;
    }
    
    // Check if text is potentially incomplete or low quality
    if (extractedText.trim().length < 200) {
      logInfo("PDF extraction returned limited text", { textLength: extractedText.length });
    }
    
    // Clean the extracted text
    const cleanedText = extractedText.replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]+/g, ' ')
      .trim();
    
    // Pass the cleaned text to the callback
    onComplete(cleanedText);
  } catch (err) {
    logError('PDF processing error:', { error: err });
    
    if (!isCancelled) {
      // Provide more specific error messages based on the error type
      if (err instanceof Error) {
        if (err.message.includes('timed out')) {
          onError(`The PDF processing timed out. Try a smaller or simpler PDF, or try pasting the recipe text directly.`);
        } else if (err.message.includes('password')) {
          onError(`This PDF appears to be password protected. Please provide an unprotected PDF document.`);
        } else if (err.message.includes('worker') || err.message.includes('network')) {
          onError(`A network error occurred while processing the PDF. Please check your connection and try again.`);
        } else {
          onError(`Failed to process the PDF: ${err.message}. Please try again with a different file.`);
        }
      } else {
        onError(`Failed to process the PDF. Please try again with a different file or format.`);
      }
    }
  }
  
  return {
    cancel: () => {
      isCancelled = true;
      if (processingTask) processingTask.cancel();
      logInfo("PDF processing cancelled by user", {});
    }
  };
};
