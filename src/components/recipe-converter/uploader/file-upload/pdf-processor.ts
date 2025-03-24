
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
  
  try {
    logInfo("Processing PDF file:", { filename: file.name, filesize: file.size });
    
    // Add timeout protection for the entire process
    const extractionPromise = Promise.race([
      // Extract text from the PDF with progress reporting
      extractTextFromPDF(file, (progress) => {
        if (isCancelled) return;
        logInfo("PDF processing progress:", { progress });
        onProgress(progress);
      }),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('PDF processing timed out after 2 minutes')), 120000)
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
      const cancellableTask = extractResult as CancellableTask;
      return {
        cancel: () => {
          cancellableTask.cancel();
          isCancelled = true;
        }
      };
    }
    
    // At this point, we know extractResult is a string
    const extractedText = extractResult as string;
    
    logInfo("PDF extraction complete, text length:", { length: extractedText.length });
    
    if (extractedText.trim().length === 0) {
      onError("No text found in the PDF. Please try with a different file.");
      return null;
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
      onError(`Failed to process the PDF: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again with a different file.`);
    }
  }
  
  return {
    cancel: () => {
      isCancelled = true;
      logInfo("PDF processing cancelled by user", {});
    }
  };
};
