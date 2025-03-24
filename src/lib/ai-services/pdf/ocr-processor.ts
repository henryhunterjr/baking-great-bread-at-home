
import { createWorker } from 'tesseract.js';
import { logError, logInfo } from '@/utils/logger';

/**
 * Extract text from an image using Tesseract OCR
 * Compatible with Tesseract.js v6
 */
export const extractTextWithOCR = async (
  imageData: string | File,
  progressCallback?: (progress: number) => void
): Promise<string> => {
  try {
    // Set initial progress
    if (progressCallback) progressCallback(10);
    
    logInfo("OCR: Initializing Tesseract worker");
    
    // Create worker with language - this is the v6 style
    const worker = await createWorker('eng');
    
    // Set up a progress monitoring interval
    let currentProgress = 10;
    const progressInterval = setInterval(() => {
      if (currentProgress < 90) {
        currentProgress += 5;
        if (progressCallback) progressCallback(currentProgress);
      }
    }, 500);
    
    logInfo("OCR: Worker initialized, starting recognition");
    
    try {
      // Perform OCR - v6 API accepts both strings and Files directly
      const result = await worker.recognize(imageData);
      
      // Clear interval once recognition is complete
      clearInterval(progressInterval);
      
      // Report 100% when done
      if (progressCallback) progressCallback(100);
      
      // Clean up the worker
      await worker.terminate();
      
      logInfo("OCR: Text recognition completed successfully");
      
      return result.data.text;
    } catch (recognizeError) {
      // Clear interval on error
      clearInterval(progressInterval);
      
      logError('OCR recognition error:', recognizeError);
      
      // Clean up the worker
      await worker.terminate();
      
      throw recognizeError;
    }
  } catch (error) {
    logError('OCR processing error:', error);
    throw new Error(`OCR processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
