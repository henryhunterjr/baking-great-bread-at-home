
import { logInfo } from '@/utils/logger';

/**
 * Clean up text from OCR processing to improve conversion accuracy
 */
export const cleanOCRText = (text: string): string => {
  logInfo("Cleaning OCR text", { textLength: text.length });
  
  // Remove excessive whitespace and normalize line breaks
  let cleaned = text.replace(/\r\n/g, '\n');
  
  // Remove multiple consecutive spaces
  cleaned = cleaned.replace(/[ \t]+/g, ' ');
  
  // Remove multiple empty lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  // Fix common OCR errors
  cleaned = cleaned.replace(/l\/2/g, '1/2'); // Replace l/2 with 1/2
  cleaned = cleaned.replace(/l\/4/g, '1/4'); // Replace l/4 with 1/4
  cleaned = cleaned.replace(/l\/3/g, '1/3'); // Replace l/3 with 1/3
  
  logInfo("OCR text cleaned", { 
    originalLength: text.length, 
    cleanedLength: cleaned.length 
  });
  
  return cleaned.trim();
};
