
import { logInfo } from '@/utils/logger';

/**
 * Detects and fixes recipe structure issues
 */
export const detectAndFixRecipeStructure = (text: string): string => {
  logInfo('Fixing recipe structure in text', { textLength: text.length });
  
  let result = text;
  
  // Detect ingredient lists (usually has measurements and ingredients on separate lines)
  const ingredientListPattern = /(\d+\s*(?:cup|tbsp|tsp|oz|g|lb|ml)s?\.?(?:\s+|\n)[\w\s]+)/gi;
  const hasIngredientList = ingredientListPattern.test(text);
  
  if (hasIngredientList) {
    // Try to properly format ingredient lists by ensuring each ingredient is on its own line
    result = result.replace(/(\d+\s*(?:cup|tbsp|tsp|oz|g|lb|ml)s?\.?)([a-zA-Z])/g, '$1 $2');
    
    // Fix cases where ingredient lines got merged
    result = result.replace(/(\.)(\d+\s*(?:cup|tbsp|tsp|oz|g|lb|ml))/g, '$1\n$2');
  }
  
  // Detect instruction steps and ensure proper formatting
  const stepPattern = /(?:^|\n)(?:Step\s*(\d+)|(\d+)\.)/gi;
  const hasSteps = stepPattern.test(text);
  
  if (hasSteps) {
    // Ensure each step is on its own line
    result = result.replace(/(\n|\.)(?:Step\s*(\d+)|(\d+)\.)/gi, '\n$&');
    
    // Add newlines between steps if missing
    result = result.replace(/(\n|\s)(Step\s*\d+|(\d+)\.)\s/gi, '\n$2\n');
  }
  
  return result;
};
