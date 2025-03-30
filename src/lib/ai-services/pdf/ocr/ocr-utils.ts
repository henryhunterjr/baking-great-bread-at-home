import { logInfo } from '@/utils/logger';
import { ThrottledProgressReporter } from '../types';

/**
 * Calculate an appropriate timeout duration based on image size
 * @param fileSize Size of the file in bytes
 * @returns Timeout in milliseconds
 */
export const calculateTimeout = (fileSize: number): number => {
  // Base timeout of 30 seconds
  const baseTimeoutMs = 30000;
  
  // Additional time based on file size (10 seconds per MB)
  const additionalTimeMs = Math.floor((fileSize / (1024 * 1024)) * 10000);
  
  // Cap at a reasonable maximum (3 minutes)
  const maxTimeoutMs = 180000;
  
  const timeout = Math.min(baseTimeoutMs + additionalTimeMs, maxTimeoutMs);
  
  logInfo('Calculated OCR timeout', { 
    fileSize, 
    timeoutMs: timeout 
  });
  
  return timeout;
};

/**
 * Check if an image is suitable for OCR processing
 * @param imageFile The image file to check
 * @returns True if the image is suitable, false otherwise
 */
export const isImageSuitableForOCR = async (imageFile: File): Promise<boolean> => {
  // Check file type
  const isImageType = imageFile.type.startsWith('image/');
  
  // Check file size (avoid processing very large images)
  const isAcceptableSize = imageFile.size < 10 * 1024 * 1024; // 10MB limit
  
  // Return combined result
  return isImageType && isAcceptableSize;
};

/**
 * Creates a throttled progress reporter that limits the frequency of progress updates
 * @param callback The progress callback function
 * @param throttleMs Minimum time in ms between progress updates
 * @returns A throttled progress function
 */
export const createThrottledProgressReporter = (
  callback: (progress: number) => void,
  throttleMs: number = 200
): ThrottledProgressReporter => {
  let lastUpdate = 0;
  let lastProgress = -1;
  
  return (progress: number) => {
    const now = Date.now();
    
    // Only report if progress has changed and enough time has passed
    if ((progress !== lastProgress) && (now - lastUpdate > throttleMs)) {
      callback(progress);
      lastUpdate = now;
      lastProgress = progress;
    }
  };
};
