
import { createWorker } from 'tesseract.js';
import { logError, logInfo } from '@/utils/logger';

/**
 * Extract text from an image using Tesseract OCR
 * Compatible with Tesseract.js v4
 */
export const extractTextWithOCR = async (
  imageData: string | File,
  progressCallback?: (progress: number) => void
): Promise<string> => {
  try {
    // Set initial progress
    if (progressCallback) progressCallback(10);
    
    logInfo("OCR: Initializing Tesseract worker");
    
    // Create worker using the new createWorker API in v4
    const worker = await createWorker('eng');
    
    logInfo("OCR: Worker initialized, starting recognition");
    
    // Set up manual progress reporting since v4 doesn't have progress handlers
    let lastProgress = 10;
    const progressInterval = setInterval(() => {
      if (lastProgress < 95) {
        lastProgress += 5;
        if (progressCallback) progressCallback(lastProgress);
      }
    }, 1000);
    
    // Perform OCR
    let result;
    if (typeof imageData === 'string') {
      // If imageData is a string (data URL), use it directly
      result = await worker.recognize(imageData);
    } else {
      // If imageData is a File, use it directly
      result = await worker.recognize(imageData);
    }
    
    // Clean up progress interval
    clearInterval(progressInterval);
    
    // Make sure we report 100% when done
    if (progressCallback) progressCallback(100);
    
    // Clean up the worker
    await worker.terminate();
    
    logInfo("OCR: Text recognition completed");
    
    return result.data.text;
  } catch (error) {
    logError('OCR processing error:', { error });
    throw new Error(`OCR processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
