
/**
 * Clean up PDF extracted text to make it more readable
 * @param text The text to clean
 * @returns Cleaned text
 */
export const cleanPDFText = (text: string): string => {
  // Remove excessive whitespace and normalize line breaks
  let cleanedText = text.replace(/\r\n/g, '\n');
  
  // Remove multiple consecutive spaces
  cleanedText = cleanedText.replace(/[ \t]+/g, ' ');
  
  // Remove multiple empty lines
  cleanedText = cleanedText.replace(/\n{3,}/g, '\n\n');
  
  // Fix common OCR errors
  cleanedText = cleanedText.replace(/l\/2/g, '1/2'); // Replace l/2 with 1/2
  cleanedText = cleanedText.replace(/l\/4/g, '1/4'); // Replace l/4 with 1/4
  cleanedText = cleanedText.replace(/l\/3/g, '1/3'); // Replace l/3 with 1/3
  
  // Fix broken bullet points
  cleanedText = cleanedText.replace(/\n[•*-] +/g, '\n• ');
  
  // Fix common fractions
  cleanedText = cleanedText.replace(/(\d)\/(\d)/g, '$1/$2');
  
  return cleanedText.trim();
};
