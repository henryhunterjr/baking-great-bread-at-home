
import { fixFractions, fixMeasurements } from '@/lib/recipe-conversion/cleaners/index';

/**
 * Clean up extracted text
 */
export const cleanText = (text: string): string => {
  if (!text) return '';
  
  // Replace multiple newlines with a single one
  let cleaned = text.replace(/\n{3,}/g, '\n\n');
  
  // Replace multiple spaces with a single one
  cleaned = cleaned.replace(/[ \t]{2,}/g, ' ');
  
  // Fix broken fractions, measurements, and other common OCR issues
  cleaned = cleaned
    .replace(/(\d)\/(\d)/g, '$1/$2')
    .replace(/(\d) ([cmt]?[lbgks])/gi, '$1$2')
    .replace(/(\d)[ ]?[oO°][ ]?([CF])/g, '$1°$2')
    .replace(/(\d) (min|hour|sec|minute)/gi, '$1 $2');
  
  return cleaned;
};
