
import { logInfo } from '@/utils/logger';

/**
 * Clean up text from OCR processing to improve conversion accuracy
 */
export const cleanOCRText = (text: string): string => {
  logInfo("Cleaning OCR text", { textLength: text.length });
  
  if (!text) return '';
  
  // Remove excessive whitespace and normalize line breaks
  let cleaned = text.replace(/\r\n/g, '\n');
  
  // Remove multiple consecutive spaces
  cleaned = cleaned.replace(/[ \t]+/g, ' ');
  
  // Remove multiple empty lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  // Fix common OCR errors - improved with more patterns
  cleaned = cleaned
    // Fix fractions
    .replace(/l\/2/g, '1/2')
    .replace(/l\/4/g, '1/4')
    .replace(/l\/3/g, '1/3')
    .replace(/(\d)l(\s|$)/g, '$1l$2')
    .replace(/(\d),(\d)/g, '$1.$2')
    .replace(/(\d+)\/(\d+)/g, '$1/$2')
    
    // Fix standard measurements
    .replace(/(\d+)g(\s|$)/g, '$1g$2')
    .replace(/(\d+)ml(\s|$)/g, '$1ml$2')
    .replace(/(\d+)oz(\s|$)/g, '$1oz$2')
    .replace(/(\d+)lb(\s|$)/g, '$1lb$2')
    .replace(/(\d+)kg(\s|$)/g, '$1kg$2')
    
    // Fix common recipe section headers
    .replace(/lngredients/gi, 'Ingredients')
    .replace(/D1rections/gi, 'Directions')
    .replace(/[Ii]nstructions?:/g, 'Instructions:')
    .replace(/[Pp]rep(aration)?:/g, 'Preparation:')
    .replace(/[Mm]ethod:/g, 'Method:')
    .replace(/[Ss]tep (\d+)[:\.]?/g, 'Step $1:')
    
    // Fix common cooking terms
    .replace(/[Pp]reheat/g, 'Preheat')
    .replace(/[Oo]ven/g, 'oven')
    .replace(/[Bb]aking/g, 'baking')
    .replace(/[Mm]ixing/g, 'mixing')
    .replace(/[Bb]owl/g, 'bowl')
    .replace(/[Ss]tir/g, 'stir')
    .replace(/[Ww]hisk/g, 'whisk');
  
  logInfo("OCR text cleaned", { 
    originalLength: text.length, 
    cleanedLength: cleaned.length 
  });
  
  return cleaned.trim();
};

/**
 * Clean up text specifically from PDF extraction
 */
export const cleanPDFText = (text: string): string => {
  if (!text) return '';
  
  logInfo("Cleaning PDF text", { textLength: text.length });
  
  // Remove PDF artifacts
  let cleaned = text
    .replace(/Page \d+ of \d+/g, '')
    .replace(/[^\x20-\x7E\x0A\x0D]/g, '') // Remove non-ASCII characters except newlines
    .replace(/(\w)-\s*\n\s*(\w)/g, '$1$2') // Fix hyphenated words across lines
    .replace(/([^\n])\n([a-z])/g, '$1 $2'); // Join broken sentences
  
  // Apply general OCR cleaning
  return cleanOCRText(cleaned);
};

/**
 * Extract the main recipe content from surrounding text
 */
export const extractRecipeContent = (text: string): string => {
  logInfo("Extracting recipe content from text", { textLength: text.length });
  
  // Look for common recipe section markers
  const ingredientSectionRegex = /(?:INGREDIENTS|Ingredients|ingredients)(?::|.{0,3})\s*/;
  const instructionSectionRegex = /(?:INSTRUCTIONS|Instructions|instructions|DIRECTIONS|Directions|directions|METHOD|Method|method)(?::|.{0,3})\s*/;
  
  // Try to find the recipe title
  const titleRegex = /^(?:\s*)([\w\s'"-]+?)(?:\n|$)/;
  const titleMatch = text.match(titleRegex);
  let recipeContent = text;
  
  // Try to find the ingredients section
  const ingredientMatch = text.match(ingredientSectionRegex);
  if (ingredientMatch && ingredientMatch.index !== undefined) {
    // If we find ingredients, extract from there to the end
    recipeContent = text.substring(ingredientMatch.index);
  }
  
  logInfo("Recipe content extracted", { 
    originalLength: text.length, 
    extractedLength: recipeContent.length,
    hasTitle: !!titleMatch
  });
  
  return recipeContent;
};
