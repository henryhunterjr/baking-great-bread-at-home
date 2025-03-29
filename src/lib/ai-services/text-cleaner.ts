
/**
 * Clean up OCR extracted text to improve quality
 * @param text Raw OCR text
 * @returns Cleaned text
 */
export const cleanOCRText = (text: string): string => {
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

/**
 * Clean up PDF extracted text to improve quality
 * @param text Raw PDF text
 * @returns Cleaned text
 */
export const cleanPDFText = (text: string): string => {
  if (!text) return '';
  
  // Replace multiple newlines with a single one
  let cleaned = text.replace(/\n{3,}/g, '\n\n');
  
  // Replace multiple spaces with a single one
  cleaned = cleaned.replace(/[ \t]{2,}/g, ' ');
  
  // Remove strange characters often found in PDFs
  cleaned = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
  
  // Fix broken words that may have been split across lines
  cleaned = cleaned.replace(/(\w+)-\n(\w+)/g, '$1$2');
  
  // Fix common formatting issues
  cleaned = cleaned
    // Fix broken fractions
    .replace(/(\d)\/(\d)/g, '$1/$2')
    // Fix broken measurements
    .replace(/(\d) ([cmt]?[lbgks])/gi, '$1$2')
    // Fix degree symbols
    .replace(/(\d)[ ]?[oO°][ ]?([CF])/g, '$1°$2')
    // Fix broken time units
    .replace(/(\d) (min|hour|sec|minute)/gi, '$1 $2')
    // Fix common cooking terms
    .replace(/cup s/gi, 'cups')
    .replace(/table spoon/gi, 'tablespoon')
    .replace(/tea spoon/gi, 'teaspoon');
  
  return cleaned;
};
