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
 * Additional cleaner functions can be added here as needed
 */
