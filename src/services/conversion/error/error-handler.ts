import { ConversionErrorType, ConversionResult } from '../types';
import { makeOpenAIRequest } from '../openai/openai-service';
import { parseRecipeFromText } from '../utils/recipe-parser';
import { logError, logInfo } from '@/utils/logger';
import { ConvertedRecipe } from '@/types/recipe';

/**
 * Handle different types of conversion errors with specific recovery strategies
 */
export async function handleConversionError(
  errorType: ConversionErrorType, 
  originalText: string
): Promise<ConversionResult> {
  try {
    logInfo('Attempting error recovery', { errorType, textLength: originalText.length });
    
    let recoveryPrompt = '';
    
    // Build prompts based on error type
    switch (errorType) {
      case ConversionErrorType.PARSING_ERROR:
        recoveryPrompt = `
I'm having trouble parsing this recipe text into a structured format. 
Please convert the following recipe text into a structured JSON format with title, ingredients (as array), 
and instructions (as array). Include any other fields you can extract.

Recipe text:
${originalText}

Format as valid JSON with these fields at minimum: title, ingredients, instructions.
`.trim();
        break;
        
      case ConversionErrorType.EMPTY_INPUT:
        return {
          success: false,
          error: {
            type: ConversionErrorType.EMPTY_INPUT,
            message: 'Empty or invalid recipe text provided'
          }
        };
        
      case ConversionErrorType.CONVERSION_ERROR:
        recoveryPrompt = `
This recipe text needs to be properly formatted.
Convert it into a valid JSON object with these fields: title, ingredients (array), instructions (array).
Try to preserve all important recipe information.

Recipe text:
${originalText}

Remember to output ONLY valid JSON.
`.trim();
        break;
        
      default: // Generic recovery for unknown errors
        recoveryPrompt = `
Please analyze this recipe text and convert it to a structured JSON format.
Include fields for title, ingredients (as array), and instructions (as array).
Extract any other useful information like prep time, cook time, etc.

Recipe text:
${originalText}

Return ONLY a valid JSON object with the structured recipe data.
`.trim();
    }
    
    // Attempt recovery through AI
    const response = await makeOpenAIRequest(recoveryPrompt);
    
    if (!response || !response.choices || !response.choices[0]) {
      throw new Error('Invalid response from AI service during error recovery');
    }
    
    // Parse the AI response
    const content = response.choices[0].message.content;
    const parsedRecipe = parseRecipeFromText(content);
    
    if (!parsedRecipe) {
      throw new Error('Failed to parse recipe from AI recovery response');
    }
    
    // Convert to the correct ConvertedRecipe format
    const recipe: ConvertedRecipe = {
      name: parsedRecipe.title || "Recovered Recipe",
      title: parsedRecipe.title, // Keep title for compatibility
      ingredients: Array.isArray(parsedRecipe.ingredients) ? 
        parsedRecipe.ingredients.map(ing => {
          if (typeof ing === 'string') {
            const parts = ing.split(' ');
            const quantity = parts[0];
            const unit = parts.length > 2 ? parts[1] : '';
            const name = parts.length > 2 ? parts.slice(2).join(' ') : parts.slice(1).join(' ');
            return { quantity, unit, name };
          } else if (typeof ing === 'object') {
            return {
              quantity: String(ing.quantity || ''),
              unit: String(ing.unit || ''),
              name: String(ing.name || '')
            };
          }
          return { quantity: '', unit: '', name: 'Ingredient' };
        }) : [],
      instructions: Array.isArray(parsedRecipe.instructions) ? parsedRecipe.instructions : [],
      prepTime: parsedRecipe.prepTime,
      cookTime: parsedRecipe.cookTime,
      totalTime: parsedRecipe.totalTime,
      servings: String(parsedRecipe.servings || ''),
      notes: Array.isArray(parsedRecipe.notes) ? parsedRecipe.notes : []
    };
    
    logInfo('Error recovery successful', { recipeTitle: recipe.name });
    
    return {
      success: true,
      data: recipe
    };
  } catch (error) {
    logError('Error recovery failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      errorType
    });
    
    return {
      success: false,
      error: {
        type: errorType,
        message: error instanceof Error 
          ? error.message 
          : 'Failed to recover from conversion error'
      }
    };
  }
}
