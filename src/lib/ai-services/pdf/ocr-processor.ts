
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
    const worker = await createWorker('eng', {
      logger: progress => {
        if (progressCallback && progress.status === 'recognizing text') {
          // Map Tesseract's progress (0-1) to our progress scale (10-90)
          const mappedProgress = 10 + Math.floor(progress.progress * 80);
          progressCallback(mappedProgress);
        }
      }
    });
    
    logInfo("OCR: Worker initialized, starting recognition");
    
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
      
      // Report 100% when done
      if (progressCallback) progressCallback(100);
      
      // Clean up the worker
      await worker.terminate();
      
      logInfo("OCR: Text recognition completed successfully");
      
      return result.data.text;
    } catch (recognizeError) {
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
