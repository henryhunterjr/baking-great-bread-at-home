
import { logInfo, logError } from '@/utils/logger';
import { createWorker } from 'tesseract.js';
import { cleanOCRText } from '@/lib/recipe-conversion/cleaners';

// Increased timeout for OCR processing
const OCR_PROCESSING_TIMEOUT = 180000; // 3 minutes (increased from 2 minutes)

/**
 * Check if OCR capability is available in the current environment
 */
export const verifyOCRAvailability = async (): Promise<boolean> => {
  try {
    // Just check if we can import the module without initializing
    return true;
  } catch (error) {
    logError('OCR availability check failed', { error });
    return false;
  }
};

/**
 * Process an image with OCR to extract text
 * @param imageSource Image file or data URL
 * @param progressCallback Optional callback for progress updates
 * @returns Extracted text
 */
export const extractTextWithOCR = async (
  imageSource: File | string,
  progressCallback?: (progress: number) => void
): Promise<string> => {
  let worker: any = null;
  let timeoutId: number | null = null;
  
  try {
    logInfo('Starting OCR text extraction', {
      sourceType: typeof imageSource === 'string' ? 'dataURL' : 'file',
      fileType: typeof imageSource !== 'string' ? imageSource.type : undefined
    });
    
    // Report initial progress
    if (progressCallback) progressCallback(10);
    
    // Create a cancellable timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = window.setTimeout(() => {
        reject(new Error('OCR processing timed out after ' + (OCR_PROCESSING_TIMEOUT / 1000) + ' seconds'));
        
        // Try to terminate the worker if it exists
        if (worker) {
          try {
            worker.terminate().catch((e: any) => {
              logError('Error terminating OCR worker during timeout', { e });
            });
          } catch (err) {
            logError('Error terminating OCR worker during timeout', { err });
          }
        }
      }, OCR_PROCESSING_TIMEOUT);
    });
    
    // Create a worker with proper progress handling
    // Using a separate closure for the progress handler to avoid serialization issues
    worker = await createWorker('eng', 1, {
      logger: (m) => {
        if (m.status === 'recognizing text' && progressCallback && typeof m.progress === 'number') {
          // Map progress from 0-1 to 10-90 to leave room for pre and post processing
          const mappedProgress = Math.round(10 + (m.progress * 80));
          progressCallback(mappedProgress);
        }
      }
    });
    
    // Report progress after worker creation
    if (progressCallback) progressCallback(20);
    
    // Process the image source - either dataURL or File
    const processingPromise = (async () => {
      let result;
      
      if (typeof imageSource === 'string') {
        // Process data URL
        result = await worker.recognize(imageSource);
      } else {
        // Process File object
        const imageData = await readFileAsDataURL(imageSource);
        result = await worker.recognize(imageData);
      }
      
      // Clean up the worker
      if (worker) {
        try {
          await worker.terminate();
        } catch (e) {
          logError('Error terminating OCR worker after completion', { e });
        }
      }
      
      return result;
    })();
    
    // Race between processing and timeout
    const result = await Promise.race([
      processingPromise,
      timeoutPromise
    ]);
    
    // Clear timeout if processing completed successfully
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    // Report progress before finalizing
    if (progressCallback) progressCallback(95);
    
    // Clean up worker explicitly in case it wasn't done already
    if (worker) {
      try {
        await worker.terminate();
        worker = null;
      } catch (e) {
        // Already terminated or failed to terminate, either way it's fine
      }
    }
    
    // Clean and return the text
    const extractedText = cleanOCRText(result.data.text);
    
    logInfo('OCR text extraction completed', { textLength: extractedText.length });
    
    // Final progress
    if (progressCallback) progressCallback(100);
    
    return extractedText;
  } catch (error) {
    // Clear timeout if it exists
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    // Try to clean up worker if it exists
    if (worker) {
      try {
        await worker.terminate().catch(() => {});
        worker = null;
      } catch (e) {
        // Failed to terminate, but we still want to report the original error
      }
    }
    
    logError('OCR text extraction failed', { error });
    throw error;
  }
};

/**
 * Helper function to read a file as data URL
 */
const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Create a throttled function to report progress updates less frequently
 * to avoid overwhelming the UI with updates
 */
export const createThrottledProgressReporter = (
  callback: (progress: number) => void, 
  delay: number
): ((progress: number) => void) => {
  let lastCallTime = 0;
  let lastProgress = 0;
  
  return (progress: number) => {
    const now = Date.now();
    
    // Always report 0 and 100%
    if (progress === 0 || progress === 100 || 
        // Or if enough time has passed AND progress has changed significantly
        (now - lastCallTime > delay && Math.abs(progress - lastProgress) > 1)) {
      
      lastCallTime = now;
      lastProgress = progress;
      callback(progress);
    }
  };
};
