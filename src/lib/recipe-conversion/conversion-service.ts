
import { RecipeData } from '@/types/recipeTypes';
import { processRecipeText } from '@/lib/ai-services';
import { cleanOCRText } from './cleaners';
import { logError, logInfo } from '@/utils/logger';
import { getOpenAIApiKey, isAIConfigured, updateOpenAIApiKey, checkAPIKeyStatus } from '@/lib/ai-services';

export const convertRecipeText = async (
  text: string, 
  onComplete: (recipe: RecipeData) => void,
  onError: (error: Error) => void
): Promise<void> => {
  try {
    // Clean and preprocess the text
    const cleanedText = cleanOCRText(text);
    
    if (!cleanedText || cleanedText.trim().length < 20) {
      throw new Error("The provided text is too short or doesn't appear to be a recipe.");
    }
    
    // Make sure we have the latest OpenAI API key
    updateOpenAIApiKey();
    
    // Check and log detailed API key status
    const keyStatus = checkAPIKeyStatus();
    logInfo('API Key Status during recipe conversion', keyStatus);
    
    // Check if OpenAI API is configured before proceeding
    if (!isAIConfigured()) {
      throw new Error("AI service is not configured with an API key. Please add your OpenAI API key in Settings.");
    }
    
    // Add error handling for browser compatibility
    try {
      const response = await processRecipeText(cleanedText);
      
      if (!response.success) {
        throw new Error(response.error || "Failed to process recipe. Please try again.");
      }
      
      if (!response.recipe) {
        throw new Error("No recipe data was returned. The text might not be recognized as a recipe.");
      }
      
      // Add converted flag and handle missing properties
      const convertedRecipe: RecipeData = {
        ...response.recipe,
        isConverted: true,
        updatedAt: new Date().toISOString(),
        // Ensure these properties exist to prevent null/undefined errors
        title: response.recipe.title || 'Untitled Recipe',
        ingredients: Array.isArray(response.recipe.ingredients) ? response.recipe.ingredients : [],
        instructions: Array.isArray(response.recipe.instructions) ? response.recipe.instructions : []
      };
      
      // Log successful conversion
      logInfo('Recipe conversion completed successfully', {
        hasTitle: !!convertedRecipe.title,
        ingredientsCount: convertedRecipe.ingredients.length,
        instructionsCount: convertedRecipe.instructions.length
      });
      
      onComplete(convertedRecipe);
    } catch (processingError) {
      logError('Error during recipe processing:', { error: processingError });
      throw processingError;
    }
  } catch (error) {
    logError('Recipe conversion error:', { error });
    onError(error instanceof Error ? error : new Error(String(error)));
  }
};
