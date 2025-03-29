import { logInfo } from '@/utils/logger';

/**
 * Calculate a reasonable timeout for OCR processing based on file size
 * 
 * @param fileSize Size of the file in bytes
 * @returns Timeout in milliseconds
 */
export const calculateTimeout = (fileSize: number): number => {
  // Base timeout of 60 seconds (60000ms)
  const baseTimeout = 60000;
  
  // For larger files, add additional time
  // For each MB above 1MB, add 15 seconds up to a maximum
  const fileSizeMB = fileSize / (1024 * 1024);
  const additionalTimePerMB = 15000; // 15 seconds per MB
  const additionalTime = Math.min(fileSizeMB - 1, 9) * additionalTimePerMB;
  
  // Return total timeout, with a minimum of 60 seconds and maximum of 3 minutes
  return Math.max(baseTimeout, Math.min(baseTimeout + additionalTime, 180000));
};

/**
 * Create a throttled progress reporter to avoid too many progress updates
 * 
 * @param callback The progress callback function
 * @param throttleMs Throttle time in milliseconds (default: 250ms)
 * @returns A throttled callback function
 */
export const createThrottledProgressReporter = (
  callback: (progress: number) => void,
  throttleMs: number = 250
): ((progress: number) => void) => {
  let lastCallTime = 0;
  let lastProgress = 0;
  
  return (progress: number) => {
    const now = Date.now();
    
    // Always call for 0% and 100% progress
    if (progress === 0 || progress === 100 || 
        // Otherwise throttle based on time and minimum progress change
        (now - lastCallTime > throttleMs && Math.abs(progress - lastProgress) >= 1)) {
      lastCallTime = now;
      lastProgress = progress;
      callback(progress);
    }
  };
};

/**
 * Convert a File object to an HTMLImageElement for processing
 * This is useful for camera captures and OCR processing
 */
export const fileToImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image file'));
    img.src = URL.createObjectURL(file);
    
    // Clean up the object URL after the image loads or errors
    const cleanup = () => URL.revokeObjectURL(img.src);
    img.onload = () => {
      cleanup();
      resolve(img);
    };
    img.onerror = () => {
      cleanup();
      reject(new Error('Failed to load image file'));
    };
  });
};
