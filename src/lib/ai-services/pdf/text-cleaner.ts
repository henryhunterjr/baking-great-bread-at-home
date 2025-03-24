
/**
 * Clean and normalize the text extracted from a PDF
 */
export const cleanPDFText = (text: string): string => {
  // Remove excessive whitespace and normalize line breaks
  let cleaned = text.replace(/\r\n/g, '\n');
  
  // Fix hyphenated words that span multiple lines
  cleaned = cleaned.replace(/(\w+)-\n(\w+)/g, '$1$2');
  
  // Remove multiple consecutive spaces
  cleaned = cleaned.replace(/[ \t]+/g, ' ');
  
  // Remove multiple empty lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  // Fix common OCR errors
  cleaned = cleaned.replace(/l\/2/g, '1/2'); // Replace l/2 with 1/2
  cleaned = cleaned.replace(/l\/4/g, '1/4'); // Replace l/4 with 1/4
  cleaned = cleaned.replace(/l\/3/g, '1/3'); // Replace l/3 with 1/3
  
  return cleaned.trim();
};
