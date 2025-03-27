
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
