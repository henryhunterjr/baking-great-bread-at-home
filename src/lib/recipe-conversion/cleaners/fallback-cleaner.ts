
import { logInfo } from '@/utils/logger';

/**
 * Fallback cleaner with basic functionality
 * This is used if the enhanced cleaner fails
 */
export const fallbackCleanOCRText = (text: string): string => {
  if (!text) return '';
  
  logInfo("Using fallback OCR text cleaner");
  
  // Simple whitespace normalization
  let cleaned = text.replace(/\r\n/g, '\n');
  cleaned = cleaned.replace(/[ \t]+/g, ' ');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  // Basic fraction fixes
  cleaned = cleaned
    .replace(/l\/2/g, '1/2')
    .replace(/l\/4/g, '1/4')
    .replace(/l\/3/g, '1/3');
  
  return cleaned.trim();
};
