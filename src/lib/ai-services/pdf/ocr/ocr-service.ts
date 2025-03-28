
import { logInfo } from '@/utils/logger';
import { cleanOCRText } from '@/lib/recipe-conversion/cleaners';

/**
 * Process OCR text to clean up common OCR artifacts and improve the result
 * @param ocrText Raw OCR text output
 * @returns Cleaned up text
 */
export const cleanupOCR = (ocrText: string): string => {
  if (!ocrText) return '';
  
  logInfo('Cleaning up OCR text', { textLength: ocrText.length });
  
  // Use the shared text cleaner
  const cleanedText = cleanOCRText(ocrText);
  
  logInfo('OCR text cleanup completed', { 
    originalLength: ocrText.length, 
    cleanedLength: cleanedText.length 
  });
  
  return cleanedText;
};
