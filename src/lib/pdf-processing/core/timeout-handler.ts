import { logError, logInfo } from '@/utils/logger';

/**
 * Execute a function with a timeout
 * 
 * @param fn The function to execute
 * @param timeout Timeout duration in milliseconds
 * @param onProgress Optional progress callback
 * @returns The result of the function or throws an error if timeout is reached
 */
export const executeWithTimeout = async <T>(
  fn: (progressCallback?: (progress: number) => void) => Promise<T>,
  timeout: number,
  onProgress?: (progress: number) => void
): Promise<T> => {
  return new Promise((resolve, reject) => {
    // Track if timeout has occurred
    let isTimedOut = false;
    
    // Set timeout
    const timeoutId = setTimeout(() => {
      isTimedOut = true;
      const timeoutDuration = Math.round(timeout / 1000);
      logError(`Operation timed out after ${timeoutDuration} seconds`);
      reject(new Error(`Operation timed out after ${timeoutDuration} seconds. The file may be too large or complex.`));
    }, timeout);
    
    // Progress wrapper to handle timeout
    const progressWrapper = (progress: number) => {
      if (!isTimedOut && onProgress) {
        onProgress(progress);
      }
    };
    
    // Execute the function
    fn(progressWrapper)
      .then((result) => {
        if (!isTimedOut) {
          clearTimeout(timeoutId);
          resolve(result);
        }
        // Otherwise ignore the result since we already rejected with timeout
      })
      .catch((error) => {
        if (!isTimedOut) {
          clearTimeout(timeoutId);
          reject(error);
        }
        // Otherwise ignore the error since we already rejected with timeout
      });
  });
};
