
import { logError } from '@/utils/logger';

/**
 * Create a timeout promise that rejects after a specified time
 * @param timeoutMs Timeout in milliseconds
 * @param message Custom error message
 * @returns A promise that rejects after the timeout
 */
export const createTimeout = (timeoutMs: number, message: string): Promise<never> => {
  return new Promise((_, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(message));
    }, timeoutMs);
    
    // Make the timeout ID available for potential cancellation
    return () => clearTimeout(timeoutId);
  });
};

/**
 * Execute a promise with a timeout
 * @param promise The promise to execute
 * @param timeoutMs Timeout in milliseconds
 * @param timeoutMessage Custom error message
 * @returns The result of the promise or throws if timeout occurs
 */
export const executeWithTimeout = async <T>(
  promise: Promise<T>, 
  timeoutMs: number, 
  timeoutMessage: string
): Promise<T> => {
  return Promise.race([
    promise,
    createTimeout(timeoutMs, timeoutMessage)
  ]);
};

/**
 * Create a cancellable timeout
 * @param callback Function to call when timeout occurs
 * @param timeoutMs Timeout in milliseconds
 * @returns An object with the timeoutId and a cancel function
 */
export const createCancellableTimeout = (
  callback: () => void, 
  timeoutMs: number
): { timeoutId: number; cancel: () => void } => {
  const timeoutId = window.setTimeout(callback, timeoutMs);
  
  return {
    timeoutId,
    cancel: () => window.clearTimeout(timeoutId)
  };
};
