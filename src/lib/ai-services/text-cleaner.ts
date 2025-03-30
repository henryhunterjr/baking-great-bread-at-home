
/**
 * Utilities for cleaning and normalizing text from various sources
 */

/**
 * Clean and normalize OCR text
 * @param text The raw OCR text to clean
 * @returns The cleaned text
 */
export const cleanOCRText = (text: string): string => {
  if (!text) return '';
  
  // Basic cleaning operations
  return text
    .replace(/(\r\n|\n){3,}/g, '\n\n') // Replace multiple newlines with double newlines
    .replace(/\s{2,}/g, ' ')           // Replace multiple spaces with single space
    .trim();                           // Trim whitespace from ends
};

/**
 * Clean and normalize PDF text
 * @param text The raw PDF text to clean
 * @returns The cleaned text
 */
export const cleanPDFText = (text: string): string => {
  if (!text) return '';
  
  // PDF-specific cleaning
  let cleaned = text
    .replace(/(\r\n|\n){3,}/g, '\n\n')   // Replace multiple newlines with double newlines
    .replace(/\s{2,}/g, ' ')             // Replace multiple spaces with single space
    .replace(/([a-z])(\n)([a-z])/gi, '$1 $3') // Join words split across lines
    .trim();
  
  // Additional PDF-specific cleaning could be added here
  
  return cleaned;
};

/**
 * Clean and normalize image OCR text with special handling for common OCR errors
 * @param text The raw OCR text from image processing
 * @returns The cleaned text
 */
export const cleanImageOCRText = (text: string): string => {
  if (!text) return '';
  
  // Image OCR specific cleaning
  let cleaned = text
    .replace(/(\r\n|\n){3,}/g, '\n\n')   // Replace multiple newlines
    .replace(/\s{2,}/g, ' ')             // Replace multiple spaces
    // Fix common OCR errors
    .replace(/l(\d)/g, '1$1')            // Replace 'l' followed by digit with '1'
    .replace(/O/g, '0')                  // Replace 'O' with '0' in appropriate contexts
    .trim();
  
  return cleaned;
};
