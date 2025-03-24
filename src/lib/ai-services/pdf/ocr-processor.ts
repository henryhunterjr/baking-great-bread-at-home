
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
    
    // Create worker with language - this is the correct v6 style
    const worker = await createWorker('eng');
    
    // Set up a progress monitoring interval since v6 doesn't support direct progress events
    let currentProgress = 10;
    const progressInterval = setInterval(() => {
      if (currentProgress < 90) {
        currentProgress += 5;
        if (progressCallback) progressCallback(currentProgress);
      }
    }, 500);
    
    logInfo("OCR: Worker initialized, starting recognition");
    
    // Perform OCR - v6 API accepts both strings and Files directly
    let result;
    try {
      result = await worker.recognize(imageData);
      
      // Clear interval once recognition is complete
      clearInterval(progressInterval);
      
      // Make sure we report 100% when done
      if (progressCallback) progressCallback(100);
    } catch (recognizeError) {
      // Clear interval on error
      clearInterval(progressInterval);
      
      logError('OCR recognition error:', { error: recognizeError });
      
      // If direct recognition fails, try an alternative approach
      if (typeof imageData === 'string') {
        // Create an Image object from the data URL
        const img = new Image();
        img.src = imageData;
        
        // Wait for the image to load
        await new Promise(resolve => {
          img.onload = resolve;
        });
        
        // Try recognition again with the image element
        result = await worker.recognize(img);
      } else {
        throw recognizeError; // Re-throw if we can't handle it
      }
    }
    
    // Clean up the worker
    await worker.terminate();
    
    logInfo("OCR: Text recognition completed");
    
    return result.data.text;
  } catch (error) {
    logError('OCR processing error:', { error });
    throw new Error(`OCR processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
