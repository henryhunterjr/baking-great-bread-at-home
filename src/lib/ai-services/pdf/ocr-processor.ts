
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
    const worker = await createWorker('eng', {
      logger: m => {
        if (m.status === 'recognizing text') {
          const p = Math.floor(m.progress * 100);
          if (progressCallback && p > 10) progressCallback(Math.min(p, 90));
        }
      },
      errorHandler: err => logError('OCR internal error:', err)
    });
    
    logInfo("OCR: Worker initialized, starting recognition");
    
    // Set up a progress monitoring for OCR
    let lastProgress = 10;
    const progressInterval = setInterval(() => {
      if (progressCallback && lastProgress < 90) {
        lastProgress += 2;
        progressCallback(lastProgress);
      }
    }, 1000);
    
    try {
      // Use timeout to prevent hanging
      const recognitionPromise = Promise.race([
        worker.recognize(imageData),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('OCR processing timed out after 45 seconds')), 45000)
        )
      ]);
      
      const result = await recognitionPromise;
      
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
