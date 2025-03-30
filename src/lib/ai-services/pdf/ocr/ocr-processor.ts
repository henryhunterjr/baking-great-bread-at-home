
import { logError, logInfo } from '@/utils/logger';
import { cleanImageOCRText } from '@/lib/ai-services/text-cleaner';
import { ProcessingErrorType, ProcessingError, CancellableTask } from '../types';

/**
 * Verify that OCR functionality is available
 * @returns Promise resolving to true if OCR is available, false otherwise
 */
export const verifyOCRAvailability = async (): Promise<boolean> => {
  try {
    // Dynamic import of Tesseract.js
    const { createWorker } = await import('tesseract.js');
    return true;
  } catch (error) {
    logError('OCR functionality not available', { error });
    return false;
  }
};

/**
 * Extract text from an image using OCR
 * @param imageFile The image file to process
 * @param progressCallback Optional callback for progress updates
 * @param options Additional options (like AbortSignal)
 * @returns The extracted text or a cancellable task
 */
export const extractTextWithOCR = async (
  imageFile: File | Blob,
  progressCallback?: (progress: number) => void,
  options?: { signal?: AbortSignal }
): Promise<string | CancellableTask> => {
  try {
    logInfo('Starting OCR text extraction', { 
      fileType: imageFile instanceof File ? imageFile.type : 'Blob',
      fileSize: imageFile.size
    });
    
    // Report initial progress
    if (progressCallback) {
      progressCallback(0.1);
    }
    
    // Dynamic import of Tesseract.js
    const { createWorker } = await import('tesseract.js');
    
    if (progressCallback) {
      progressCallback(0.2);
    }
    
    // Create a worker with the current Tesseract.js API (v6)
    const worker = await createWorker('eng');
    
    // Check if processing was cancelled
    if (options?.signal?.aborted) {
      await worker.terminate();
      throw new ProcessingError("OCR processing was cancelled", ProcessingErrorType.USER_CANCELLED);
    }
    
    // Set up cancellation task
    const cancellableTask: CancellableTask = {
      cancel: async () => {
        try {
          await worker.terminate();
          logInfo('OCR processing cancelled by user');
        } catch (e) {
          logError('Error terminating OCR worker during cancellation', { error: e });
        }
      }
    };
    
    // Convert File/Blob to URL
    const imageUrl = URL.createObjectURL(imageFile);
    
    // Setup progress tracking - compatible with Tesseract.js v6
    // In v6, progress updates come through progress callback
    let lastProgress = 0;
    
    // Check for cancellation again
    if (options?.signal?.aborted) {
      await worker.terminate();
      URL.revokeObjectURL(imageUrl);
      throw new ProcessingError("OCR processing was cancelled", ProcessingErrorType.USER_CANCELLED);
    }
    
    // Define a progress handler function
    const handleProgress = (progress: any) => {
      if (progressCallback && progress.status === 'recognizing text' && 'progress' in progress) {
        // Map progress to range 20% - 90%
        const mappedProgress = 0.2 + (progress.progress * 0.7);
        progressCallback(mappedProgress);
      }
    };
    
    // Recognize text in the image
    // In Tesseract.js v6, the progress callback is passed as the third argument
    const result = await worker.recognize(imageUrl, {});
    
    // Access the recognized text
    const { data } = result;
    
    await worker.terminate();
    
    // Cleanup URL
    URL.revokeObjectURL(imageUrl);
    
    // Report completion
    if (progressCallback) {
      progressCallback(1.0);
    }
    
    // Clean up the extracted text
    const cleanedText = cleanImageOCRText(data.text);
    
    logInfo('OCR text extraction completed', {
      rawTextLength: data.text.length,
      cleanedTextLength: cleanedText.length
    });
    
    return cleanedText;
  } catch (error) {
    logError('OCR text extraction failed', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    
    throw new ProcessingError(
      "OCR text extraction failed: " + (error instanceof Error ? error.message : 'Unknown error'),
      ProcessingErrorType.EXTRACTION_FAILED
    );
  }
};
