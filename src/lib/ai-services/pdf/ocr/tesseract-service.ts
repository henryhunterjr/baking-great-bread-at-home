
import { createWorker, RecognizeResult } from 'tesseract.js';
import { logInfo, logError } from '@/utils/logger';

// Configure Tesseract based on environment
const tesseractConfig = {
  workerPath: '/tesseract/worker.min.js',
  langPath: '/tesseract/lang-data',
  corePath: '/tesseract/tesseract-core.wasm.js',
  logger: (message: any) => {
    if (message.status === 'recognizing text' && message.progress) {
      logInfo('Tesseract OCR progress', { progress: Math.round(message.progress * 100) + '%' });
    }
  }
};

// Maximum retry attempts for OCR operations
const MAX_RETRIES = 3;

export const Tesseract = {
  /**
   * Check if Tesseract.js is available in the current environment
   */
  async checkAvailability(): Promise<boolean> {
    try {
      const worker = await createWorker();
      await worker.terminate();
      return true;
    } catch (error) {
      logError('Tesseract availability check failed', { error });
      return false;
    }
  },
  
  /**
   * Recognize text in an image with retries
   * @param imageSource URL or File object of the image
   * @param options Options for recognition
   * @returns Recognition result
   */
  async recognize(
    imageSource: string | File,
    options: { logger?: (data: any) => void } = {}
  ): Promise<RecognizeResult> {
    let attempts = 0;
    let lastError: Error | null = null;
    
    while (attempts < MAX_RETRIES) {
      try {
        attempts++;
        logInfo('OCR attempt', { attempt: attempts, maxRetries: MAX_RETRIES });
        
        // Create a new worker for each attempt to avoid state issues
        const worker = await createWorker('eng', 1, {
          ...tesseractConfig,
          logger: options.logger || tesseractConfig.logger
        });
        
        try {
          // Set parameters for better text recognition - explicitly as strings
          await worker.setParameters({
            tessedit_ocr_engine_mode: "3", // Legacy + LSTM mode (as string)
            preserve_interword_spaces: "1"
          });
          
          // Perform the recognition
          const result = await worker.recognize(imageSource);
          
          // Clean up worker resources
          await worker.terminate();
          
          // Return the result on success
          return result;
        } catch (error) {
          await worker.terminate(); // Ensure worker is terminated on error
          throw error;
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        logError('OCR attempt failed', { attempt: attempts, error: lastError.message });
        
        // If this is not the last attempt, wait before retrying
        if (attempts < MAX_RETRIES) {
          // Exponential backoff (1s, 2s, 4s, etc.)
          const backoffMs = Math.pow(2, attempts) * 1000;
          logInfo('Retrying OCR after backoff', { backoffMs });
          await new Promise(resolve => setTimeout(resolve, backoffMs));
        }
      }
    }
    
    // If all attempts fail, throw the last error
    throw new Error(`OCR failed after ${MAX_RETRIES} attempts: ${lastError?.message || 'Unknown error'}`);
  }
};
