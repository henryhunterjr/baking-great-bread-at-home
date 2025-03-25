
import { RecipeData } from '@/types/recipeTypes';
import { processRecipeText } from '@/lib/ai-services';
import { cleanOCRText } from './cleaners';

export const convertRecipeText = async (
  text: string, 
  onSuccess: (recipe: RecipeData) => void, 
  onError: (error: Error) => void
): Promise<void> => {
  try {
    // Clean the text first
    const cleanedText = cleanOCRText(text);
    
    // Process the recipe text
    const response = await processRecipeText(cleanedText);
    
    // Check if the response is successful and has a recipe
    if (response.success && response.recipe) {
      // Convert the recipe to RecipeData format
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
        equipmentNeeded: response.recipe.equipmentNeeded || [],
        imageUrl: response.recipe.imageUrl || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
        tags: response.recipe.tags || [],
        isPublic: false,
        isConverted: true
      };
      
      onSuccess(convertedRecipe);
    } else {
      throw new Error(response.error || 'Failed to convert recipe');
    }
  } catch (error) {
    onError(error instanceof Error ? error : new Error(String(error)));
  }
};
