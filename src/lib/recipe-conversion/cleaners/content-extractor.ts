
import { logInfo, logError } from '@/utils/logger';

/**
 * Extract the main recipe content from surrounding text
 * with improved detection of recipe boundaries
 */
export const enhancedExtractRecipeContent = (text: string): string => {
  if (!text) return '';
  
  logInfo("Extracting recipe content with enhanced algorithm", { textLength: text.length });
  
  try {
    // Try to detect recipe boundaries
    
    // Common recipe start indicators
    const startPatterns = [
      /ingredients:/i,
      /yield:.*servings/i,
      /prep time:/i,
      /preparation time:/i,
      /cook time:/i,
      /baking time:/i,
      /total time:/i
    ];
    
    // Common recipe end indicators
    const endPatterns = [
      /nutritional information/i,
      /nutrition facts/i,
      /serving suggestion/i,
      /source:/i,
      /adapted from/i,
      /recipe by/i,
      /enjoy!/i
    ];
    
    // Find the earliest start marker
    let startIndex = text.length;
    for (const pattern of startPatterns) {
      const match = text.match(pattern);
      if (match && match.index !== undefined && match.index < startIndex) {
        startIndex = match.index;
      }
    }
    
    // If no start marker found, try to find the title
    if (startIndex === text.length) {
      const titleMatch = text.match(/^(?:\s*)([\w\s'"-]+?)(?:\n|$)/);
      if (titleMatch && titleMatch.index !== undefined) {
        startIndex = titleMatch.index;
      } else {
        startIndex = 0;
      }
    }
    
    // Find the earliest end marker after the start marker
    let endIndex = -1;
    for (const pattern of endPatterns) {
      const match = text.match(pattern);
      if (match && match.index !== undefined && match.index > startIndex) {
        if (endIndex === -1 || match.index < endIndex) {
          endIndex = match.index;
        }
      }
    }
    
    // Extract the recipe content
    let recipeContent;
    if (endIndex !== -1) {
      recipeContent = text.substring(startIndex, endIndex);
    } else {
      recipeContent = text.substring(startIndex);
    }
    
    logInfo("Recipe content extracted with enhanced algorithm", { 
      originalLength: text.length, 
      extractedLength: recipeContent.length,
      startIndex,
      endIndex: endIndex !== -1 ? endIndex : 'end'
    });
    
    return recipeContent;
  } catch (error) {
    // If enhanced extraction fails, return the original text
    logError("Enhanced recipe extraction failed", { error });
    return text;
  }
};
