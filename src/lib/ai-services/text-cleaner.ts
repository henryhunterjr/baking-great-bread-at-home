
/**
 * Cleans and formats text from OCR processing for better recipe extraction
 */
export const cleanOCRText = (text: string): string => {
  if (!text) return '';
  
  // Remove excessive whitespace
  let cleaned = text.replace(/\s+/g, ' ');
  
  // Fix common OCR errors
  cleaned = cleaned
    .replace(/['']/g, "'")
    .replace(/[""]/g, '"')
    .replace(/(\d)l(\s|$)/g, '$1l$2') // Fix for 1l being interpreted as 11
    .replace(/(\d),(\d)/g, '$1.$2');  // Fix for comma vs decimal point in numbers
  
  // Try to detect and clean up ingredient lists
  // Common OCR errors in ingredient amounts
  cleaned = cleaned
    .replace(/(\d+)\/(\d+)/g, '$1/$2') // Fix fractions
    .replace(/l\/(\d+)/g, '1/$1')      // Fix 1/4 being read as l/4
    .replace(/(\d+)I(\d+)/g, '$1/$2')  // Fix for 1/2 being read as 1I2
    .replace(/(\d+)g /g, '$1g ')       // Fix for grams
    .replace(/(\d+)ml /g, '$1ml ');    // Fix for milliliters
  
  // Fix common OCR recipe structural issues
  cleaned = cleaned
    .replace(/lngredients/gi, 'Ingredients')
    .replace(/D1rections/gi, 'Directions')
    .replace(/[Ss]tep (\d+)[:\.]?/g, 'Step $1:')
    .replace(/[Mm]ethod/g, 'Method')
    .replace(/[Pp]reparation/g, 'Preparation')
    .replace(/[Ii]nstructions/g, 'Instructions');
  
  return cleaned;
};

/**
 * Specially tailored cleaning function for PDF text
 */
export const cleanPDFText = (text: string): string => {
  if (!text) return '';
  
  // Remove PDF artifacts like page numbers and headers
  let cleaned = text
    .replace(/Page \d+ of \d+/g, '')
    .replace(/[^\x20-\x7E\x0A\x0D]/g, ''); // Remove non-ASCII characters except newlines
  
  // Fix PDF line breaks - sometimes PDFs break lines in awkward places
  cleaned = cleaned
    .replace(/(\w)-\s*\n\s*(\w)/g, '$1$2') // Fix hyphenated words across lines
    .replace(/([^\n])\n([a-z])/g, '$1 $2'); // Join broken sentences
  
  // Apply general OCR cleaning
  return cleanOCRText(cleaned);
};

/**
 * Extract a recipe block from surrounding text
 */
export const extractRecipeFromText = (text: string): string => {
  if (!text) return '';
  
  // Look for common recipe section markers
  const ingredientSectionRegex = /(?:INGREDIENTS|Ingredients|ingredients)(?::|.{0,3})\s*/;
  const instructionSectionRegex = /(?:INSTRUCTIONS|Instructions|instructions|DIRECTIONS|Directions|directions|METHOD|Method|method)(?::|.{0,3})\s*/;
  
  // Try to find the ingredients section
  const ingredientMatch = text.match(ingredientSectionRegex);
  
  if (ingredientMatch) {
    // If we find ingredients, try to extract from there to the end
    const startIndex = ingredientMatch.index;
    
    if (startIndex !== undefined) {
      // If we found a start, get everything from there to the end
      return text.substring(startIndex);
    }
  }
  
  // If we can't find an ingredients section, return the original text
  return text;
};
