
import { RecipeData } from '@/types/recipeTypes';
import { logError } from '@/utils/logger';

/**
 * Parses AI response into a structured recipe format
 */
export function parseRecipeFromText(aiResponse: string): RecipeData | null {
  try {
    const parsed = JSON.parse(aiResponse);
    
    // Validate required fields
    if (!parsed.title || !Array.isArray(parsed.ingredients) || !Array.isArray(parsed.instructions)) {
      throw new Error('Missing required recipe fields');
    }
    
    return {
      title: parsed.title,
      ingredients: parsed.ingredients,
      instructions: parsed.instructions,
      notes: parsed.notes || [],
      prepTime: parsed.prepTime || '',
      cookTime: parsed.cookTime || '',
      servings: parsed.servings || 1,
      isConverted: true
    };
  } catch (error) {
    logError('Recipe parsing failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      response: aiResponse
    });
    return null;
  }
}
