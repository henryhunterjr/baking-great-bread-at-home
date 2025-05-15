
import { RecipeData } from '@/types/unifiedRecipe';
import { logError } from '@/utils/logger';

/**
 * A more robust parser for AI responses to handle various formats and edge cases
 * 
 * @param aiResponse The string response from AI services
 * @returns A properly structured RecipeData object or null if parsing fails
 */
export function parseRecipeFromText(aiResponse: string): RecipeData | null {
  try {
    // Try to parse as JSON first
    let parsed;
    try {
      parsed = JSON.parse(aiResponse);
    } catch (jsonError) {
      // If JSON parsing fails, try to extract JSON from the response
      // (Sometimes AI wraps JSON in markdown or explanatory text)
      const jsonMatch = aiResponse.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          parsed = JSON.parse(jsonMatch[1].trim());
        } catch {
          // If extraction fails, handle as text
          logError('Failed to extract JSON from AI response');
          return null;
        }
      } else {
        // Not in a JSON format we can handle
        logError('Response is not in a parseable JSON format');
        return null;
      }
    }
    
    // Ensure we have the required fields with proper fallbacks
    const safeRecipe: RecipeData = {
      title: parsed.title || parsed.name || "Untitled Recipe",
      ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients : [],
      instructions: Array.isArray(parsed.instructions) ? parsed.instructions : [],
      notes: parsed.notes || [],
      prepTime: parsed.prepTime || '',
      cookTime: parsed.cookTime || '',
      servings: parsed.servings || 1,
      isConverted: true
    };
    
    // Do additional validation
    if (
      typeof safeRecipe.title !== 'string' || 
      !Array.isArray(safeRecipe.ingredients) || 
      !Array.isArray(safeRecipe.instructions)
    ) {
      throw new Error('Invalid recipe structure');
    }
    
    return safeRecipe;
  } catch (error) {
    logError('Recipe parsing failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      response: aiResponse
    });
    return null;
  }
}
