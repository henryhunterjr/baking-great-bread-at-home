
import { extractTextFromPDF } from '@/lib/ai-services/pdf';
import { logError, logInfo } from '@/utils/logger';
import { cleanOCRText } from '@/lib/ai-services/text-cleaner';

/**
 * Process PDF content with timeout handling
 */
export const processPDFWithTimeout = async (
  file: File,
  onProgress?: (progress: number) => void,
  timeoutDuration: number = 120000 // 2 minutes default
): Promise<string | { cancel: () => void } | null> => {
  let timeoutId: NodeJS.Timeout | null = null;
  let cancelled = false;
  
  try {
    logInfo("Processing PDF with timeout", { filename: file.name, filesize: file.size });
    
    // Set a timeout to prevent indefinite processing
    const timeoutPromise = new Promise<null>((_, reject) => {
      timeoutId = setTimeout(() => {
        cancelled = true;
        reject(new Error("PDF processing timed out."));
      }, timeoutDuration);
    });
    
    // Create a progress wrapper that checks for cancellation
    const progressCallback = onProgress ? 
      (progress: number) => {
        if (cancelled) return;
        onProgress(progress);
      } : undefined;
    
    // Race the actual extraction against the timeout
    const extractResult = await Promise.race([
      extractTextFromPDF(file, progressCallback),
      timeoutPromise
    ]);
    
    // Clear the timeout since we're done
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // Check if processing was cancelled
    if (cancelled) return null;
    
    return extractResult;
  } catch (error) {
    logError("Error in PDF processing with timeout", { error });
    
    // Clear the timeout if it exists
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // Rethrow the error for the caller to handle
    throw error;
  }
};

/**
 * Clean and process PDF text after extraction
 */
export const processPDFText = (extractedText: string): string => {
  if (!extractedText || extractedText.trim().length === 0) {
    throw new Error("No text was found in this PDF. It may contain only images or be scanned.");
  }
  
  return cleanOCRText(extractedText);
};
