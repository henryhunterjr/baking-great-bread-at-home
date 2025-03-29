
import { logInfo, logError } from '@/utils/logger';
import { cleanOCRText } from '@/lib/ai-services/text-cleaner';

/**
 * Clean up OCR extracted text to improve quality and readability
 * 
 * @param text Raw OCR text
 * @returns Cleaned text
 */
export const cleanupOCR = (text: string): string => {
  if (!text) return '';
  
  // Use our text cleaner utility
  const cleaned = cleanOCRText(text);
  
  logInfo('OCR text cleaned', { 
    originalLength: text.length, 
    cleanedLength: cleaned.length 
  });
  
  return cleaned;
};

/**
 * Extract and prepare data from OCR results
 * 
 * @param ocrText Raw OCR text
 * @returns Processed text
 */
export const processOCRResult = (ocrText: string | null | undefined): string => {
  // Handle null or undefined results
  if (!ocrText) {
    logError('OCR returned null or undefined text');
    return '';
  }
  
  // Clean up the text
  const cleanedText = cleanupOCR(ocrText);
  
  // Return the cleaned text
  return cleanedText;
};
