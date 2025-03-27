
/**
 * Utility for cleaning and processing text
 */

/**
 * Clean up OCR text by removing excessive whitespace and fixing common OCR errors
 */
export const cleanOCRText = (text: string): string => {
  if (!text) return '';
  
  // Remove excessive whitespace (multiple spaces, tabs, newlines)
  let cleaned = text.replace(/\s+/g, ' ');
  
  // Fix common OCR errors for fractions
  cleaned = cleaned
    .replace(/l\/2/g, '1/2')  // Fix for half fraction
    .replace(/l\/4/g, '1/4')  // Fix for quarter fraction
    .replace(/l\/3/g, '1/3')  // Fix for third fraction
    .replace(/0\/2/g, '1/2')  // Another common OCR error for fractions
    .replace(/O\/2/g, '1/2')  // O instead of 0
    .replace(/O\/4/g, '1/4')  // O instead of 0
    .replace(/(\d)l(\d)/g, '$11$2') // Replace l with 1 between numbers
    .trim();
  
  // Fix common letter substitutions
  cleaned = cleaned
    .replace(/(\s)l(\s)/g, '$11$2') // Replace standalone l with 1
    .replace(/(\s)O(\s)/g, '$10$2') // Replace standalone O with 0
    .replace(/(\d)O/g, '$10') // Replace O with 0 after a digit
    .replace(/O(\d)/g, '0$1') // Replace O with 0 before a digit
    .trim();
  
  // Remove control characters and non-printable characters
  cleaned = cleaned.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
  
  return cleaned;
};

/**
 * Clean up recipe text for processing
 */
export const cleanRecipeText = (text: string): string => {
  if (!text) return '';
  
  // Normalize line endings
  let cleaned = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  // Remove excessive whitespace between lines but preserve paragraph breaks
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  // Remove control characters
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');
  
  return cleaned.trim();
};

/**
 * Extract sections from recipe text
 */
export const extractRecipeSections = (text: string): { 
  title: string | null; 
  ingredients: string[];
  instructions: string[];
} => {
  const result = {
    title: null,
    ingredients: [],
    instructions: []
  };
  
  if (!text) return result;
  
  const lines = text.split('\n');
  
  // Try to extract title from first non-empty line
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    if (line && line.length > 3 && line.length < 100) {
      result.title = line;
      break;
    }
  }
  
  // Try to extract ingredients (look for lists with quantities)
  const ingredientRegex = /^\s*[-•*]?\s*(\d+\/\d+|\d+(?:\.\d+)?)\s*(cup|tbsp|tsp|oz|g|kg|ml|l|pound|lb|teaspoon|tablespoon|ounce)/i;
  const ingredientLines: string[] = [];
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (ingredientRegex.test(trimmed) || /^\s*[-•*]\s*\w+/.test(trimmed)) {
      ingredientLines.push(trimmed);
    }
  });
  
  result.ingredients = ingredientLines;
  
  // Try to extract instructions (look for numbered steps or paragraphs)
  const instructionRegex = /^\s*(\d+)\s*\.\s*(.+)/;
  const instructionLines: string[] = [];
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (instructionRegex.test(trimmed) || (trimmed.length > 40 && !ingredientRegex.test(trimmed))) {
      instructionLines.push(trimmed);
    }
  });
  
  result.instructions = instructionLines;
  
  return result;
};
