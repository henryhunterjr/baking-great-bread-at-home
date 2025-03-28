
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
// Limit concurrent workers to prevent memory exhaustion
const MAX_CONCURRENT_WORKERS = 2;
// Track active workers
let activeWorkers = 0;
// Queue for pending OCR tasks
const taskQueue: Array<() => Promise<void>> = [];

// Helper function to perform the actual recognition with retries
// This is now a regular function, not a method
async function performRecognition(
  imageSource: string | File,
  options: { 
    logger?: (data: any) => void,
    signal?: AbortSignal
  } = {}
): Promise<RecognizeResult> {
  let attempts = 0;
  let lastError: Error | null = null;
  
  // Increment active worker count
  activeWorkers++;
  
  try {
    while (attempts < MAX_RETRIES) {
      try {
        attempts++;
        logInfo('OCR attempt', { attempt: attempts, maxRetries: MAX_RETRIES });
        
        // Check if operation was cancelled
        if (options.signal?.aborted) {
          throw new Error('OCR operation cancelled');
        }
        
        // Create a new worker for each attempt to avoid state issues
        const worker = await createWorker('eng', 1, {
          ...tesseractConfig,
          logger: options.logger || tesseractConfig.logger
        });
        
        // Set up cancellation listener if signal provided
        const abortListener = options.signal ? 
          () => {
            logInfo('OCR operation aborted by signal');
            worker.terminate();
          } : 
          null;
          
        if (abortListener && options.signal) {
          options.signal.addEventListener('abort', abortListener);
        }
        
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
          
          // Remove abort listener if it was added
          if (abortListener && options.signal) {
            options.signal.removeEventListener('abort', abortListener);
          }
          
          // Return the result on success
          return result;
        } catch (error) {
          // Check if operation was cancelled during processing
          if (options.signal?.aborted) {
            throw new Error('OCR operation cancelled during processing');
          }
          
          await worker.terminate(); // Ensure worker is terminated on error
          
          // Remove abort listener if it was added
          if (abortListener && options.signal) {
            options.signal.removeEventListener('abort', abortListener);
          }
          
          throw error;
        }
      } catch (error) {
        // Check if operation was cancelled
        if (options.signal?.aborted) {
          throw new Error('OCR operation cancelled');
        }
        
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
  } finally {
    // Decrement active worker count and process next in queue
    activeWorkers--;
    
    // Process next task in queue if any
    if (taskQueue.length > 0) {
      const nextTask = taskQueue.shift();
      if (nextTask) {
        logInfo('Processing next OCR task from queue', { remainingInQueue: taskQueue.length });
        nextTask().catch(error => {
          logError('Error in queued OCR task', { error });
        });
      }
    }
  }
}

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
   * Recognize text in an image with retries and worker management
   * @param imageSource URL or File object of the image
   * @param options Options for recognition including signal for cancellation
   * @returns Recognition result
   */
  async recognize(
    imageSource: string | File,
    options: { 
      logger?: (data: any) => void,
      signal?: AbortSignal
    } = {}
  ): Promise<RecognizeResult> {
    // Implement task queueing for memory management
    if (activeWorkers >= MAX_CONCURRENT_WORKERS) {
      logInfo('OCR worker limit reached, queueing task', { 
        activeWorkers, 
        queueLength: taskQueue.length 
      });
      
      // Create a queueable promise
      return new Promise((resolve, reject) => {
        taskQueue.push(async () => {
          try {
            // Check if operation was cancelled while in queue
            if (options.signal?.aborted) {
              reject(new Error('OCR operation cancelled while in queue'));
              return;
            }
            
            const result = await performRecognition(imageSource, options);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      });
    }
    
    return performRecognition(imageSource, options);
  }
};
