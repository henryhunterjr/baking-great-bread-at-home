
import { logInfo } from '@/utils/logger';

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
export const createProgressReporter = (callback: (progress: any) => void) => {
  // This function returns a simple handler that won't be passed to the Worker
  // It just calls the callback with the progress object
  return (progress: any) => {
    callback(progress);
  };
};
