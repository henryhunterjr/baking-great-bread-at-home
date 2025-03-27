
import { logInfo, logError } from '@/utils/logger';
import { createWorker } from 'tesseract.js';

// Tesseract.js worker instance
let tesseractWorker: any = null;
let isInitializing = false;
let isInitialized = false;

/**
 * Initialize the OCR service with proper error handling
 */
export const initializeOCR = async (): Promise<boolean> => {
  if (isInitialized && tesseractWorker) {
    return true;
  }
  
  if (isInitializing) {
    // Wait for initialization to complete
    while (isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return isInitialized;
  }
  
  try {
    isInitializing = true;
    logInfo('Initializing OCR service (Tesseract.js)');
    
    // Clean up any existing worker
    if (tesseractWorker) {
      try {
        await tesseractWorker.terminate();
        tesseractWorker = null;
      } catch (error) {
        logError('Error terminating existing Tesseract worker', { error });
        // Continue with initialization
      }
    }
    
    // Create a new worker with progress logging
    tesseractWorker = await createWorker('eng', {
      logger: m => {
        if (m.status === 'recognizing text') {
          const progressPercent = Math.round(m.progress * 100);
          logInfo(`OCR Progress: ${progressPercent}%`);
        }
      }
    });
    
    // Log successful initialization
    logInfo('OCR service successfully initialized');
    isInitialized = true;
    return true;
  } catch (error) {
    logError('Error initializing OCR service', { error });
    isInitialized = false;
    tesseractWorker = null;
    return false;
  } finally {
    isInitializing = false;
  }
};

/**
 * Get the current OCR worker instance
 */
export const getOCRWorker = (): any => {
  return tesseractWorker;
};

/**
 * Clean up OCR service resources
 */
export const cleanupOCR = async (): Promise<void> => {
  if (tesseractWorker) {
    try {
      await tesseractWorker.terminate();
      tesseractWorker = null;
      isInitialized = false;
      logInfo('OCR service cleaned up');
    } catch (error) {
      logError('Error cleaning up OCR service', { error });
    }
  }
};

// Auto-cleanup on module unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (tesseractWorker) {
      tesseractWorker.terminate().catch(console.error);
    }
  });
}
