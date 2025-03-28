
import { logInfo, logError } from '@/utils/logger';

/**
 * Enhanced version of the OCR text cleaner with better handling
 * for complex recipe formats and error recovery
 */
export const enhancedCleanOCRText = (text: string): string => {
  if (!text) return '';
  
  logInfo("Cleaning OCR text with enhanced algorithm", { textLength: text.length });
  
  try {
    // Remove excessive whitespace and normalize line breaks
    let cleaned = text.replace(/\r\n/g, '\n');
    
    // Remove multiple consecutive spaces
    cleaned = cleaned.replace(/[ \t]+/g, ' ');
    
    // Remove multiple empty lines
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    
    // Advanced recipe structure detection and correction
    cleaned = detectAndFixRecipeStructure(cleaned);
    
    // Enhanced fraction fixes with more patterns
    cleaned = fixFractions(cleaned);
    
    // Fix measurements with more comprehensive patterns
    cleaned = fixMeasurements(cleaned);
    
    // Fix recipe section headers with better pattern matching
    cleaned = fixSectionHeaders(cleaned);
    
    // Fix common cooking terms with context awareness
    cleaned = fixCookingTerms(cleaned);
    
    logInfo("OCR text cleaned with enhanced algorithm", { 
      originalLength: text.length, 
      cleanedLength: cleaned.length,
      improvement: Math.round((cleaned.length - text.length) / text.length * 100) + '%'
    });
    
    return cleaned.trim();
  } catch (error) {
    // If enhanced cleaning fails, fall back to basic cleaning
    logError("Enhanced OCR cleaning failed, using fallback", { error });
    return fallbackCleanOCRText(text);
  }
};

/**
 * Detects and fixes recipe structure issues
 */
const detectAndFixRecipeStructure = (text: string): string => {
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

/**
 * Fix fractions with comprehensive pattern matching
 */
const fixFractions = (text: string): string => {
  return text
    // Fix common OCR fraction errors
    .replace(/l\/2/g, '1/2')
    .replace(/l\/4/g, '1/4')
    .replace(/l\/3/g, '1/3')
    .replace(/l\/8/g, '1/8')
    .replace(/3\/4/g, '3/4')
    .replace(/2\/3/g, '2/3')
    .replace(/(\d)l(\s|$)/g, '$1l$2')
    .replace(/(\d),(\d)/g, '$1.$2')
    
    // Fix spacing around fractions
    .replace(/(\d+)\/(\d+)/g, '$1/$2')
    .replace(/(\d+) (\d+)\/(\d+)/g, '$1 $2/$3')
    
    // Fix Unicode fractions that OCR sometimes produces
    .replace(/½/g, '1/2')
    .replace(/⅓/g, '1/3')
    .replace(/⅔/g, '2/3')
    .replace(/¼/g, '1/4')
    .replace(/¾/g, '3/4')
    .replace(/⅕/g, '1/5')
    .replace(/⅖/g, '2/5')
    .replace(/⅗/g, '3/5')
    .replace(/⅘/g, '4/5')
    .replace(/⅙/g, '1/6')
    .replace(/⅚/g, '5/6')
    .replace(/⅛/g, '1/8')
    .replace(/⅜/g, '3/8')
    .replace(/⅝/g, '5/8')
    .replace(/⅞/g, '7/8');
};

/**
 * Fix measurements with comprehensive pattern matching
 */
const fixMeasurements = (text: string): string => {
  return text
    // Fix standard measurements
    .replace(/(\d+)g(\s|$)/g, '$1g$2')
    .replace(/(\d+)ml(\s|$)/g, '$1ml$2')
    .replace(/(\d+)oz(\s|$)/g, '$1oz$2')
    .replace(/(\d+)lb(\s|$)/g, '$1lb$2')
    .replace(/(\d+)kg(\s|$)/g, '$1kg$2')
    
    // Fix spacing in measurements
    .replace(/(\d+)(tbsp|tsp|cup|oz|g|lb|kg|ml|L)(\s|$)/gi, '$1 $2$3')
    
    // Fix common OCR errors in measurement words
    .replace(/(\d+)\s*cup5/gi, '$1 cups')
    .replace(/(\d+)\s*tb5p/gi, '$1 tbsp')
    .replace(/(\d+)\s*t5p/gi, '$1 tsp')
    .replace(/(\d+)\s*0z/gi, '$1 oz')
    
    // Fix abbreviated measurements
    .replace(/(\d+)\s*c\.\s/gi, '$1 cup ')
    .replace(/(\d+)\s*T\.\s/gi, '$1 tbsp ')
    .replace(/(\d+)\s*t\.\s/gi, '$1 tsp ')
    .replace(/(\d+)\s*oz\.\s/gi, '$1 oz ');
};

/**
 * Fix recipe section headers with better pattern matching
 */
const fixSectionHeaders = (text: string): string => {
  return text
    // Fix common recipe section headers
    .replace(/lngredients/gi, 'Ingredients')
    .replace(/D1rections/gi, 'Directions')
    .replace(/[Ii]nstructions?:/g, 'Instructions:')
    .replace(/[Pp]rep(aration)?:/g, 'Preparation:')
    .replace(/[Mm]ethod:/g, 'Method:')
    .replace(/[Ss]tep (\d+)[:\.]?/g, 'Step $1:')
    
    // Ensure section headers are properly formatted with newlines
    .replace(/([a-z])(\n|.)(INGREDIENTS|DIRECTIONS|INSTRUCTIONS|METHOD)/gi, '$1\n\n$3')
    
    // Enhance section header detection
    .replace(/(^|\n)([A-Z][A-Z\s]+:?)($|\n)/g, '$1\n$2\n$3');
};

/**
 * Fix common cooking terms with context awareness
 */
const fixCookingTerms = (text: string): string => {
  return text
    // Fix common cooking verbs
    .replace(/[Pp]reheat/g, 'Preheat')
    .replace(/[Mm]ix(ing)?/g, (match, p1) => p1 ? 'Mixing' : 'Mix')
    .replace(/[Ss]tir(ring)?/g, (match, p1) => p1 ? 'Stirring' : 'Stir')
    .replace(/[Ww]hisk(ing)?/g, (match, p1) => p1 ? 'Whisking' : 'Whisk')
    .replace(/[Bb]ak(e|ing)/g, (match, p1) => p1 === 'ing' ? 'Baking' : 'Bake')
    
    // Fix common cooking nouns
    .replace(/[Oo]ven/g, 'oven')
    .replace(/[Bb]owl/g, 'bowl')
    .replace(/[Mm]ixture/g, 'mixture')
    .replace(/[Dd]ough/g, 'dough')
    .replace(/[Bb]atter/g, 'batter')
    
    // Fix temperature settings
    .replace(/(\d+)([CF])\./g, '$1°$2.')
    .replace(/(\d+) degrees ([CF])/gi, '$1°$2');
};

/**
 * Fallback cleaner with basic functionality
 * This is used if the enhanced cleaner fails
 */
const fallbackCleanOCRText = (text: string): string => {
  if (!text) return '';
  
  logInfo("Using fallback OCR text cleaner");
  
  // Simple whitespace normalization
  let cleaned = text.replace(/\r\n/g, '\n');
  cleaned = cleaned.replace(/[ \t]+/g, ' ');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  // Basic fraction fixes
  cleaned = cleaned
    .replace(/l\/2/g, '1/2')
    .replace(/l\/4/g, '1/4')
    .replace(/l\/3/g, '1/3');
  
  return cleaned.trim();
};

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
