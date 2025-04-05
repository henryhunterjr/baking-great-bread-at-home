
import { logError, logInfo } from '@/utils/logger';
import { executeWithTimeout } from './core/timeout-handler';
import { processLargePDFInChunks } from './core/chunked-processor';
import { processPDFText } from './core/text-processor';
import { extractTextFromPDF } from '@/lib/ai-services/pdf';

/**
 * Process PDF content with timeout handling
 */
export const processPDFWithTimeout = async (
  file: File,
  onProgress?: (progress: number) => void,
  timeoutDuration: number = 600000 // 10 minutes default
): Promise<string | { cancel: () => void } | null> => {
  try {
    logInfo("Processing PDF with timeout", { 
      filename: file.name, 
      filesize: file.size, 
      timeout: timeoutDuration 
    });
    
    // For large files, adjust the timeout or try alternate processing method
    if (file.size > 5 * 1024 * 1024) { // If larger than 5MB
      logInfo("Large PDF detected, using chunked processing method", { fileSize: file.size });
      
      // Use a different processing method for large PDFs
      try {
        // Process the PDF in chunks to avoid memory issues
        return await executeWithTimeout(
          (progressCallback) => processLargePDFInChunks(file, progressCallback),
          timeoutDuration,
          onProgress
        );
      } catch (chunkError) {
        logError("Chunked processing failed, falling back to standard method", { error: chunkError });
        // Fall back to standard processing
      }
    }
    
    // Standard processing for smaller PDFs
    return await executeWithTimeout(
      (progressCallback) => extractTextFromPDF(file, progressCallback),
      timeoutDuration,
      onProgress
    );
  } catch (error) {
    logError("Error in PDF processing with timeout", { error });
    throw error;
  }
};

/**
 * Standalone PDF processing function
 */
export const processPDF = async (
  file: File,
  onComplete: (text: string) => void,
  onError: (error: string) => void
) => {
  try {
    logInfo("Processing PDF directly", { filename: file.name, filesize: file.size });
    
    const progressCallback = (progress: number) => {
      // Just track progress, no state to update here
    };
    
    const extractResult = await processPDFWithTimeout(file, progressCallback);
    
    // Handle different types of results
    if (extractResult === null || extractResult === undefined) {
      onError("Failed to extract text from the PDF. The file may be empty or corrupted.");
      return null;
    }
    
    // Check if the result is a cancellable task
    if (typeof extractResult === 'object' && extractResult !== null && 'cancel' in extractResult) {
      // Return the cancellable task
      return extractResult;
    }
    
    // At this point, we know extractResult is a string
    const extractedText = extractResult as string;
    
    try {
      const cleanedText = processPDFText(extractedText);
      onComplete(cleanedText);
      
      return {
        cancel: () => {
          // This is just a placeholder since the process is already complete
          logInfo("PDF extraction already complete, nothing to cancel");
        }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred processing the PDF text";
      onError(errorMessage);
      return null;
    }
  } catch (error: any) {
    onError(error.message || "An unexpected error occurred during PDF processing.");
    return null;
  }
};
