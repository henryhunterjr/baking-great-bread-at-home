
import { logError, logInfo } from '@/utils/logger';
import { processPDFWithTimeout, processPDFText } from './pdfProcessingUtils';

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
