
import { logInfo, logError } from '@/utils/logger';

/**
 * Clean up OCR text results
 */
export const cleanOCRText = (text: string): string => {
  if (!text) return '';
  
  // Remove excessive whitespace
  let cleaned = text.replace(/\s+/g, ' ');
  
  // Fix common OCR errors
  cleaned = cleaned
    .replace(/l\/2/g, '1/2')
    .replace(/l\/4/g, '1/4')
    .replace(/(\d)l(\s|$)/g, '$1l$2')
    .replace(/(\d),(\d)/g, '$1.$2');
  
  return cleaned.trim();
};

/**
 * Convert a file to a data URL
 */
export const fileToDataURL = async (file: File | Blob): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Create a progress reporter that doesn't cause DataCloneError 
 * when passed to a Worker
 */
export const createProgressReporter = (callback: (progress: number) => void) => {
  // Instead of passing the callback directly to the worker,
  // we return a simple function that just calls the callback with the progress
  return (progress: number) => {
    try {
      // Make sure progress is a number between 0 and 1
      const normalizedProgress = Math.min(Math.max(progress || 0, 0), 1);
      callback(normalizedProgress);
    } catch (error) {
      // Silently handle any errors in the progress callback
      logError('Error in OCR progress callback', { error });
    }
  };
};

/**
 * Create a throttled progress reporter to avoid excessive updates
 */
export const createThrottledProgressReporter = (
  callback: (progress: number) => void, 
  interval = 500
) => {
  let lastUpdate = 0;
  let lastProgress = 0;
  
  return (progress: number) => {
    const now = Date.now();
    
    // Update if:
    // 1. It's been at least 'interval' ms since last update, OR
    // 2. This is the first update (0%), OR
    // 3. This is the last update (100%), OR
    // 4. Progress jumped by at least 10%
    if (
      now - lastUpdate > interval || 
      lastProgress === 0 || 
      progress === 1 ||
      Math.abs(progress - lastProgress) > 0.1
    ) {
      lastUpdate = now;
      lastProgress = progress;
      
      try {
        callback(progress);
      } catch (error) {
        // Silently handle any errors
        logError('Error in throttled progress callback', { error });
      }
    }
  };
};
