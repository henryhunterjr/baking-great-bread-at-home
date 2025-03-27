
import { logInfo } from '@/utils/logger';

/**
 * Clean up OCR text by removing excessive whitespace and fixing common OCR errors
 */
export const cleanOCRText = (text: string): string => {
  // Remove excessive whitespace
  let cleaned = text.replace(/\s+/g, ' ');
  
  // Fix common OCR errors
  cleaned = cleaned
    .replace(/l\/2/g, '1/2')  // Fix for half fraction
    .replace(/l\/4/g, '1/4')  // Fix for quarter fraction
    .replace(/l\/3/g, '1/3')  // Fix for third fraction
    .replace(/0\/2/g, '1/2')  // Another common OCR error for fractions
    .trim();
  
  return cleaned;
};

/**
 * Convert a file to a data URL
 */
export const fileToDataURL = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Create an inline progress reporter for Tesseract
 */
export const createProgressReporter = (
  progressCallback: ((progress: number) => void) | undefined,
  rangeStart: number = 0, 
  rangeEnd: number = 100
) => {
  let lastReportedProgress = rangeStart;
  
  return (m: any) => {
    if (m.status === 'recognizing text' && progressCallback) {
      // Map the tesseract progress (0-1) to our custom range
      const mappedProgress = Math.round(rangeStart + (m.progress * (rangeEnd - rangeStart)));
      if (mappedProgress > lastReportedProgress) {
        lastReportedProgress = mappedProgress;
        progressCallback(mappedProgress);
        logInfo(`OCR Progress: ${mappedProgress}%`);
      }
    }
  };
};
