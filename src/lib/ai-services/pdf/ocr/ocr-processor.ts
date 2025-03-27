
import { logInfo, logError } from '@/utils/logger';
import { getOCRWorker, initializeOCR } from './ocr-service';
import { cleanOCRText, fileToDataURL, createProgressReporter } from './ocr-utils';
import { ProgressCallback } from '../types';

/**
 * Function to verify OCR availability
 */
export const verifyOCRAvailability = async (): Promise<boolean> => {
  try {
    return await initializeOCR();
  } catch (error) {
    logError('OCR service unavailable', { error });
    return false;
  }
};

/**
 * Process an image file with OCR to extract text 
 */
export const processImageWithOCR = async (
  imageFile: File | Blob | string,
  progressCallback?: ProgressCallback
): Promise<string> => {
  // Start progress reporting
  if (progressCallback) progressCallback(10);
  
  try {
    // Initialize OCR if not already initialized
    const isOCRReady = await initializeOCR();
    
    const tesseractWorker = getOCRWorker();
    if (!isOCRReady || !tesseractWorker) {
      throw new Error("OCR service failed to initialize");
    }
    
    if (progressCallback) progressCallback(20);
    
    // Convert file to image data URL if it's not already a string
    const imageDataUrl = typeof imageFile === 'string' 
      ? imageFile 
      : await fileToDataURL(imageFile);
    
    if (progressCallback) progressCallback(30);
    
    // Set parameters for text recognition
    await tesseractWorker.setParameters({
      tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,;:\'"-()[]{}!?@#$%^&*+=/<>°℃℉½¼¾⅓⅔ ',
    });
    
    if (progressCallback) progressCallback(40);
    
    // Create a progress reporter that properly handles the Tesseract.js progress object
    const progressThrottler = createProgressReporter((progressData) => {
      if (progressCallback && progressData !== null) {
        // Safely check if the progress data is an object with the required properties
        if (typeof progressData === 'object' && progressData !== null) {
          // Use type guard to check if status and progress properties exist
          if ('status' in progressData && 
              'progress' in progressData && 
              typeof progressData.status === 'string' &&
              progressData.status === 'recognizing text') {
            // Safely convert progress to number
            const progressValue = typeof progressData.progress === 'number' 
              ? progressData.progress 
              : parseFloat(String(progressData.progress)) || 0;
              
            const mappedProgress = Math.round(40 + (progressValue * 50)); // Map to 40-90%
            progressCallback(mappedProgress);
          }
        }
      }
    });
    
    // Recognize text with separate progress tracking to avoid DataCloneError
    const result = await tesseractWorker.recognize(imageDataUrl, {
      logger: progressThrottler
    });
    
    if (progressCallback) progressCallback(90);
    
    // Extract and clean the text
    const extractedText = result.data.text || '';
    const cleanedText = cleanOCRText(extractedText);
    
    if (progressCallback) progressCallback(100);
    
    return cleanedText;
  } catch (error) {
    logError('Error processing image with OCR', { error });
    throw new Error(`OCR processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Export the function with the name that other modules are expecting
export const extractTextWithOCR = processImageWithOCR;
