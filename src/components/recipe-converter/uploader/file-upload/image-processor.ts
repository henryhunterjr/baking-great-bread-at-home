
import { extractTextWithOCR } from '@/lib/ai-services/pdf';
import { logError, logInfo } from '@/utils/logger';
import { ProcessingCallbacks, ProcessingTask } from './types';

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
    
    // Set initial progress
    onProgress(10);
    
    // Create a timeout to prevent infinite processing
    timeoutId = window.setTimeout(() => {
      if (!isAborted) {
        isAborted = true;
        logError('Image processing timed out after 40 seconds', {});
        onError("Image processing timed out after 40 seconds. Try with a smaller or clearer image, or manually enter the recipe text.");
      }
    }, 40000); // 40 second timeout (reduced from 60)
    
    try {
      // Make sure the OCR processing has a progress callback that can't be cloned (fixes Worker error)
      const ocrProgressCallback = (ocrProgress: number) => {
        if (isAborted) return;
        
        // Map progress from 10-90%
        const mappedProgress = Math.floor(10 + (ocrProgress * 80));
        onProgress(mappedProgress);
      };
      
      // Extract text from the image
      const extractedText = await extractTextWithOCR(file, ocrProgressCallback);
      
      // Check if the operation was cancelled
      if (isAborted) return null;
      
      // Clear the timeout since we finished successfully
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
      
      logInfo("OCR complete", { textLength: extractedText.length });
      
      // Make sure we report 100% when done
      onProgress(100);
      
      // Pass the extracted text to the parent
      if (extractedText.trim().length > 0) {
        onComplete(extractedText);
      } else {
        onError("No text found in the image. Please try with a clearer image or a different format.");
      }
    } catch (recognizeError) {
      if (!isAborted) {
        logError('OCR processing error', { error: recognizeError });
        onError(`Failed to process the image: ${recognizeError instanceof Error ? recognizeError.message : 'Unknown error'}. Please try with a clearer image.`);
      }
    }
  } catch (err) {
    if (!isAborted) {
      logError('OCR processing error', { error: err });
      onError("Failed to process the image. Please try again with a different image.");
    }
  }
  
  return {
    cancel: () => {
      isAborted = true;
      // Clear the timeout if it exists
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
      logInfo("Image processing cancelled by user", {});
    }
  };
};
