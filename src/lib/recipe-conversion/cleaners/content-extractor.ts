
import { logInfo, logError } from '@/utils/logger';
import { fixFractions } from './fraction-cleaner';
import { fixMeasurements } from './measurement-cleaner';
import { fixSectionHeaders } from './section-headers-cleaner';

/**
 * Enhanced function to extract recipe content from OCR or PDF text
 * with better structure detection and formatting
 */
export const enhancedExtractRecipeContent = (text: string): string => {
  if (!text) return '';
  
  try {
    logInfo("Extracting recipe content with enhanced algorithm");
    
    // Remove excessive whitespace and normalize line breaks
    let cleaned = text.replace(/\r\n/g, '\n');
    
    // Remove multiple consecutive spaces
    cleaned = cleaned.replace(/[ \t]+/g, ' ');
    
    // Remove multiple empty lines but preserve paragraph structure
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    
    // Fix common OCR errors with fractions and measurements
    cleaned = fixFractions(cleaned);
    cleaned = fixMeasurements(cleaned);
    
    // Fix recipe section headers with better pattern matching
    cleaned = fixSectionHeaders(cleaned);
    
    // Basic recipe structure detection - look for ingredients and instructions sections
    if (!cleaned.toLowerCase().includes('ingredient') && !cleaned.toLowerCase().includes('instruction')) {
      // Try to identify recipe sections if not explicitly labeled
      const lines = cleaned.split('\n');
      let structuredText = '';
      let inIngredientSection = false;
      let ingredientSectionFound = false;
      
      // Look for ingredient patterns (quantities followed by food items)
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Skip empty lines
        if (!line) {
          structuredText += '\n';
          continue;
        }
        
        // Detect ingredient lines (quantities followed by food items)
        const isIngredientLine = /^\d+[\s\/]*(cup|tbsp|tsp|oz|g|kg|ml|l|lb|pound|tablespoon|teaspoon)s?\b/i.test(line) || 
                                /^\d+[\s\/]*(.+)/.test(line);
        
        // If we find what looks like an ingredient line and we're not already in the ingredient section
        if (isIngredientLine && !inIngredientSection && !ingredientSectionFound) {
          structuredText += "\nINGREDIENTS:\n\n";
          inIngredientSection = true;
          ingredientSectionFound = true;
        }
        
        // If we were in ingredient section but now have a line that looks like a header or instruction
        if (inIngredientSection && 
            (line.endsWith(':') || line.match(/^(step|[0-9]+\.)/) || line.length > 50)) {
          structuredText += "\nINSTRUCTIONS:\n\n";
          inIngredientSection = false;
        }
        
        structuredText += line + '\n';
      }
      
      cleaned = structuredText;
    }
    
    return cleaned.trim();
  } catch (error) {
    logError("Error in enhanced content extraction", { error });
    return text; // Return original text if processing fails
  }
};
