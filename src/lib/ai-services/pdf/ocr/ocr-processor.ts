
import { logError, logInfo } from '@/utils/logger';
import { cleanImageOCRText } from '@/lib/ai-services/text-cleaner';
import { ProcessingErrorType, ProcessingError } from '../types';

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
 * @returns The extracted text
 */
export const extractTextWithOCR = async (
  imageFile: File | Blob,
  progressCallback?: (progress: number) => void
): Promise<string> => {
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
    
    // Create a worker with progress tracking
    const worker = await createWorker({
      logger: (m) => {
        if (progressCallback && m.status === 'recognizing text') {
          // Scale progress to 20-90% range
          const scaledProgress = 0.2 + (m.progress * 0.7);
          progressCallback(scaledProgress);
        }
      },
    });
    
    // Load image and recognize text
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    
    // Convert File/Blob to URL
    const imageUrl = URL.createObjectURL(imageFile);
    
    const { data } = await worker.recognize(imageUrl);
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
