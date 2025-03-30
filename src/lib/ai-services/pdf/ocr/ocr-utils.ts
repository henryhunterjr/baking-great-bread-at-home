
import { logInfo } from '@/utils/logger';

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
