
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
    // In v6, createWorker accepts language as first param, options as second
    const worker = await createWorker('eng');
    
    logInfo("OCR: Worker initialized, starting recognition");
    
    // Set up a progress monitoring for OCR
    let lastProgress = 10;
    const progressInterval = setInterval(() => {
      if (progressCallback && lastProgress < 90) {
        lastProgress += 5;
        progressCallback(lastProgress);
      }
    }, 800);
    
    try {
      // Set a timeout to prevent OCR from hanging
      const recognitionPromise = Promise.race([
        worker.recognize(imageData),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('OCR processing timed out')), 60000)
        )
      ]);
      
      // Perform OCR - v6 API accepts both strings and Files directly
      const result = await recognitionPromise as Awaited<ReturnType<typeof worker.recognize>>;
      
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
