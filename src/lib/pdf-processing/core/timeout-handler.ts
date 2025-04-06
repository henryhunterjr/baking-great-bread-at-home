
import { logError } from '@/utils/logger';

/**
 * Execute an operation with timeout protection
 * @param operation The function to execute with timeout protection
 * @param timeoutMs Timeout in milliseconds
 * @param progressCallback Optional callback for progress updates
 * @returns The result of the operation or a cancellable task
 */
export const executeWithTimeout = async <T>(
  operation: (progressCallback?: (progress: number) => void) => Promise<T>,
  timeoutMs: number = 300000, // 5 minutes default timeout
  progressCallback?: (progress: number) => void
): Promise<T | { cancel: () => void }> => {
  // Create a promise that resolves when the operation completes
  const operationPromise = operation(progressCallback);
  
  // Create a timeout promise
  const timeoutPromise = new Promise((_, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs / 1000} seconds`));
    }, timeoutMs);
    
    // Attach the timeout ID to the promise for cleanup
    (timeoutPromise as any).timeoutId = timeoutId;
  });
  
  // Create a cancellation function
  const cancel = () => {
    if ((timeoutPromise as any).timeoutId) {
      clearTimeout((timeoutPromise as any).timeoutId);
    }
    
    return {
      cancel: () => {
        logError('Operation already cancelled');
      }
    };
  };
  
  try {
    // Race between the operation and timeout
    const result = await Promise.race([operationPromise, timeoutPromise]);
    return result;
  } catch (error) {
    if ((error as Error).message.includes('timed out')) {
      logError('Operation timed out', { timeoutMs });
    }
    throw error;
  } finally {
    // Clean up the timeout
    if ((timeoutPromise as any).timeoutId) {
      clearTimeout((timeoutPromise as any).timeoutId);
    }
  }
};
