
import { RecipeData } from '@/types/recipeTypes';
import { processRecipeText } from '@/lib/ai-services';
import { cleanOCRText } from './cleaners';
import { logError, logInfo } from '@/utils/logger';

export const convertRecipeText = async (
  text: string, 
  onSuccess: (recipe: RecipeData) => void, 
  onError: (error: Error) => void
): Promise<void> => {
  if (!text || text.trim() === '') {
    onError(new Error('Empty or invalid recipe text provided'));
    return;
  }

  try {
    logInfo('Starting recipe conversion', { 
      textLength: text.length,
      textPreview: text.substring(0, 100)
    });
    
    // Clean the text first
    const cleanedText = cleanOCRText(text);
    
    if (!cleanedText || cleanedText.trim() === '') {
      logError('Text cleaning resulted in empty content', {
        originalTextLength: text.length
      });
      throw new Error('Text cleaning resulted in empty content');
    }
    
    logInfo('Text cleaned successfully', {
      originalLength: text.length,
      cleanedLength: cleanedText.length
    });
    
    // Process the recipe text
    const response = await processRecipeText(cleanedText);
    
    // Check if the response is successful and has a recipe
    if (response.success && response.recipe) {
      // Convert the recipe to RecipeData format with default values for safety
      const convertedRecipe: RecipeData = {
        title: response.recipe.title || 'Untitled Recipe',
        introduction: response.recipe.introduction || '',
        ingredients: response.recipe.ingredients || [],
        prepTime: response.recipe.prepTime || '',
        restTime: response.recipe.restTime || '',
        bakeTime: response.recipe.bakeTime || '',
        totalTime: response.recipe.totalTime || '',
        instructions: response.recipe.instructions || [],
        tips: response.recipe.tips || [],
        proTips: response.recipe.proTips || [],
        equipmentNeeded: Array.isArray(response.recipe.equipmentNeeded) ? 
          response.recipe.equipmentNeeded : [],
        imageUrl: response.recipe.imageUrl || 
          'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
        tags: Array.isArray(response.recipe.tags) ? response.recipe.tags : [],
        isPublic: false,
        isConverted: true
      };
      
      logInfo('Recipe conversion successful', { 
        recipeTitle: convertedRecipe.title,
        ingredientsCount: convertedRecipe.ingredients.length,
        instructionsCount: convertedRecipe.instructions.length
      });
      
      onSuccess(convertedRecipe);
    } else {
      const errorMessage = response.error || 'Failed to convert recipe: No valid recipe data returned';
      logError('Recipe conversion failed', { error: errorMessage });
      throw new Error(errorMessage);
    }
  } catch (error) {
    logError('Recipe conversion error', { 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    onError(error instanceof Error ? error : new Error(String(error)));
  }
};
