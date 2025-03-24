
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
    
    // Create worker using the createWorker API in v6
    // Note: In v6, the first parameter is the language
    const worker = await createWorker('eng', {
      // Optional configuration for worker
      logger: m => {
        // Map Tesseract's internal progress to our progress callback
        if (progressCallback && m.status === 'recognizing text') {
          const p = Math.round(m.progress * 70) + 20; // Map to 20-90% range
          progressCallback(p);
        }
      }
    });
    
    logInfo("OCR: Worker initialized, starting recognition");
    
    // Perform OCR - v6 API accepts both strings and Files directly
    let result;
    try {
      result = await worker.recognize(imageData);
    } catch (recognizeError) {
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
