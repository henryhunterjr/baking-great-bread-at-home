import { logInfo } from '@/utils/logger';

/**
 * Create a timeout that can be cancelled
 * @param callback Function to call when timeout expires
 * @param delay Timeout in milliseconds
 * @returns Object with timeoutId and cancel function
 */
export const createCancellableTimeout = (
  callback: () => void,
  delay: number
): { timeoutId: number; cancel: () => void } => {
  const timeoutId = window.setTimeout(callback, delay);
  
  return {
    timeoutId,
    cancel: () => {
      window.clearTimeout(timeoutId);
      logInfo('Timeout cancelled', { timeoutId });
    }
  };
};

/**
 * Set up progress tracking and warning timeouts
 * @param onProgress Progress callback function
 * @param isCancelled Flag indicating if the operation is cancelled
 * @returns Object with timeout and interval IDs
 */
export const setupProgressTracking = (
  onProgress: (progress: number) => void,
  isCancelled: boolean
): { warningTimeoutId: number, progressIntervalId: number } => {
  let lastProgressUpdate = Date.now();
  let currentProgress = 10;
  
  // Show a warning after 20 seconds
  const warningTimeoutId = window.setTimeout(() => {
    if (!isCancelled) {
      // Don't use onError here, just log a warning
      logInfo("PDF processing warning: taking longer than expected");
      onProgress(Math.min(currentProgress + 5, 98)); // Increment progress slightly
    }
  }, 20000);
  
  // Periodic progress updates for large files
  const progressIntervalId = window.setInterval(() => {
    if (isCancelled) {
      window.clearInterval(progressIntervalId);
      return;
    }
    
    // Calculate elapsed time
    const elapsedMs = Date.now() - lastProgressUpdate;
    if (elapsedMs > 2000) { // Every 2 seconds
      // Simulate progress to keep user informed during long-running operations
      currentProgress = Math.min(currentProgress + 2, 98); // Cap at 98% until we get actual completion
      onProgress(currentProgress);
      lastProgressUpdate = Date.now();
    }
  }, 2000);
  
  return { warningTimeoutId, progressIntervalId };
};
