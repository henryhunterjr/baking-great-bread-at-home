
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
    
    // Create worker with language - using v6 compatible API
    const worker = await createWorker('eng');
    
    logInfo("OCR: Worker initialized, starting recognition");
    
    // Process the input data based on its type
    let dataToProcess: string | File = imageData;
    
    // Set up a progress monitoring for OCR
    let lastProgress = 10;
    const progressInterval = setInterval(() => {
      if (progressCallback && lastProgress < 90) {
        lastProgress += 5;
        progressCallback(lastProgress);
      }
    }, 800);
    
    try {
      // Tesseract v6 API can handle both strings and Files directly
      const result = await worker.recognize(dataToProcess);
      
      // Clear interval once recognition is complete
      clearInterval(progressInterval);
      
      // Report 100% when done
      if (progressCallback) progressCallback(100);
      
      // Clean up the worker
      await worker.terminate();
      
      logInfo("OCR: Text recognition completed successfully");
      
      // Check if there's actual text content
      if (!result.data.text || result.data.text.trim().length === 0) {
        throw new Error("No text could be extracted from the image");
      }
      
      return result.data.text;
    } catch (recognizeError) {
      // Clear interval on error
      clearInterval(progressInterval);
      
      // Clean up the worker
      await worker.terminate();
      
      logError('OCR recognition error:', recognizeError);
      throw recognizeError;
    }
  } catch (error) {
    logError('OCR processing error:', error);
    throw new Error(`OCR processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
