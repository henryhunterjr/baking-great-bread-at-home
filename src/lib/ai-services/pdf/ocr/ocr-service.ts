
/**
 * Clean up OCR extracted text to improve quality
 * @param text Raw OCR text
 * @returns Cleaned text
 */
export const cleanupOCR = (text: string): string => {
  if (!text) return '';
  
  // Replace multiple newlines with a single one
  let cleaned = text.replace(/\n{3,}/g, '\n\n');
  
  // Replace multiple spaces with a single one
  cleaned = cleaned.replace(/[ \t]{2,}/g, ' ');
  
  // Fix common OCR errors
  cleaned = cleaned
    // Fix broken fractions
    .replace(/(\d)\/(\d)/g, '$1/$2')
    // Fix broken measurements
    .replace(/(\d) ([cmt]?[lbgks])/gi, '$1$2')
    // Fix degree symbols
    .replace(/(\d)[ ]?[oO°][ ]?([CF])/g, '$1°$2')
    // Fix broken time units
    .replace(/(\d) (min|hour|sec|minute)/gi, '$1 $2');
  
  return cleaned;
};
