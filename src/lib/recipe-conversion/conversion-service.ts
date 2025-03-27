
import { RecipeData } from '@/types/recipeTypes';
import { processRecipeText } from '@/lib/ai-services';
import { cleanOCRText } from './cleaners';
import { logError, logInfo } from '@/utils/logger';
import { getOpenAIApiKey, isOpenAIConfigured, updateOpenAIApiKey, checkAPIKeyStatus } from '@/lib/ai-services/ai-config';

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
    if (!isOpenAIConfigured()) {
      throw new Error("AI service is not configured with an API key. Please add your OpenAI API key in Settings.");
    }
    
    const response = await processRecipeText(cleanedText);
    
    if (!response.success) {
      throw new Error(response.message || "Failed to process recipe. Please try again.");
    }
    
    if (!response.recipe) {
      throw new Error("No recipe data was returned. The text might not be recognized as a recipe.");
    }
    
    // Add converted flag
    const convertedRecipe: RecipeData = {
      ...response.recipe,
      isConverted: true,
      updatedAt: new Date().toISOString()
    };
    
    onComplete(convertedRecipe);
  } catch (error) {
    logError('Recipe conversion error:', { error });
    onError(error instanceof Error ? error : new Error(String(error)));
  }
};
