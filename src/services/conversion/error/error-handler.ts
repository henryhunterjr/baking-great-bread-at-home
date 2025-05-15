
import { logError } from '@/utils/logger';
import { ConversionErrorType, ConversionResult } from '@/types/unifiedRecipe';

/**
 * Handle conversion errors with appropriate recovery strategies
 */
export const handleConversionError = async (
  errorType: ConversionErrorType,
  originalText: string
): Promise<ConversionResult> => {
  // Log the error for analysis
  logError('Handling conversion error', { 
    errorType, 
    textLength: originalText.length 
  });
  
  switch (errorType) {
    case ConversionErrorType.API_KEY_MISSING:
      return {
        success: false,
        error: {
          type: ConversionErrorType.API_KEY_MISSING,
          message: 'API key is required for AI-powered recipe conversion. Please add your API key in settings.'
        }
      };
      
    case ConversionErrorType.PARSING_ERROR:
      // Try basic parsing as fallback
      return tryBasicParsing(originalText);
      
    case ConversionErrorType.INVALID_INPUT:
      return {
        success: false,
        error: {
          type: ConversionErrorType.INVALID_INPUT,
          message: 'The provided text does not appear to be a recipe. Please check your input and try again.'
        }
      };
      
    case ConversionErrorType.API_ERROR:
      return {
        success: false,
        error: {
          type: ConversionErrorType.API_ERROR,
          message: 'Error communicating with the AI service. Please try again later.'
        }
      };
      
    case ConversionErrorType.EMPTY_INPUT:
      return {
        success: false,
        error: {
          type: ConversionErrorType.EMPTY_INPUT,
          message: 'Please enter or paste a recipe before converting.'
        }
      };
      
    default:
      return {
        success: false,
        error: {
          type: ConversionErrorType.UNKNOWN,
          message: 'An unexpected error occurred during recipe conversion.'
        }
      };
  }
};

/**
 * Basic recipe parsing as a fallback
 */
const tryBasicParsing = (text: string): ConversionResult => {
  try {
    // Basic parsing logic
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    // Try to extract title from the first line
    const title = lines[0] || 'Untitled Recipe';
    
    // Look for ingredients and instructions sections
    let currentSection = '';
    const ingredients: string[] = [];
    const instructions: string[] = [];
    
    for (const line of lines.slice(1)) {
      const lowerLine = line.toLowerCase();
      
      if (lowerLine.includes('ingredient')) {
        currentSection = 'ingredients';
        continue;
      } else if (lowerLine.includes('instruction') || lowerLine.includes('direction')) {
        currentSection = 'instructions';
        continue;
      }
      
      if (currentSection === 'ingredients') {
        ingredients.push(line);
      } else if (currentSection === 'instructions') {
        instructions.push(line);
      }
    }
    
    // If we couldn't identify sections, make a guess
    if (ingredients.length === 0 && instructions.length === 0) {
      let foundIngredients = false;
      
      for (const line of lines.slice(1)) {
        // Ingredients often have measurements
        const hasMeasurement = /[0-9]+\s*(g|oz|cup|cups|tbsp|tsp|ml|pound|lb|kg)/i.test(line);
        
        if (!foundIngredients && hasMeasurement) {
          ingredients.push(line);
          foundIngredients = true;
        } else if (foundIngredients && !hasMeasurement && line.length > 20) {
          instructions.push(line);
        } else if (foundIngredients && hasMeasurement) {
          ingredients.push(line);
        }
      }
    }
    
    return {
      success: true,
      data: {
        name: title,
        title: title,
        ingredients: ingredients.map(ing => ({ quantity: '', unit: '', name: ing })),
        instructions: instructions,
        prepTime: '',
        cookTime: '',
        totalTime: '',
        servings: '',
        notes: []
      }
    };
  } catch (error) {
    logError('Basic parsing fallback failed', { error });
    
    return {
      success: false,
      error: {
        type: ConversionErrorType.PARSING_ERROR,
        message: 'Could not parse recipe text even with fallback methods. Please try a different format.'
      }
    };
  }
};
