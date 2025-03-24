
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
  
  try {
    logInfo("Processing image file:", { filename: file.name });
    
    // Set initial progress
    onProgress(10);
    
    try {
      // Add timeout protection to ensure process doesn't hang
      const extractionPromise = Promise.race([
        extractTextWithOCR(file, (progress) => {
          if (!isAborted) {
            onProgress(progress);
          }
        }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('OCR processing timed out')), 60000)
        )
      ]);
      
      const extractedText = await extractionPromise;
      
      // Check if the operation was cancelled
      if (isAborted) return null;
      
      logInfo("OCR complete, extracted text length:", { length: extractedText.length });
      
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
        logError('OCR processing error:', { error: recognizeError });
        onError(`Failed to process the image: ${recognizeError instanceof Error ? recognizeError.message : 'Unknown error'}. Please try with a clearer image.`);
      }
    }
  } catch (err) {
    if (!isAborted) {
      logError('OCR processing error:', { error: err });
      onError("Failed to process the image. Please try again with a different image.");
    }
  }
  
  return {
    cancel: () => {
      isAborted = true;
    }
  };
};
