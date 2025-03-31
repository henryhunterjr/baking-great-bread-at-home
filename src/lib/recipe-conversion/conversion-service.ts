
import { RecipeData } from '@/types/recipeTypes';
import { processRecipeText } from '@/lib/ai-services';
import { cleanOCRText } from './cleaners';
import { logError, logInfo } from '@/utils/logger';
import { getOpenAIApiKey, isAIConfigured, updateOpenAIApiKey, checkAPIKeyStatus } from '@/lib/ai-services';
import { toast } from 'sonner';

export const convertRecipeText = async (
  text: string, 
  onComplete: (recipe: RecipeData) => void,
  onError: (error: Error) => void
): Promise<void> => {
  try {
    // Validate input
    if (!text || typeof text !== 'string') {
      throw new Error("Invalid text input provided");
    }
    
    // Store original text before cleaning - CRITICAL
    const originalText = text;
    
    // Clean and preprocess the text
    const cleanedText = cleanOCRText(text);
    
    if (!cleanedText || cleanedText.trim().length < 20) {
      throw new Error("The provided text is too short or doesn't appear to be a recipe.");
    }
    
    // Make sure we have the latest OpenAI API key
    updateOpenAIApiKey();
    
    // Check API key status
    const keyStatus = checkAPIKeyStatus();
    logInfo('API Key Status during recipe conversion', keyStatus);
    
    // Check if OpenAI API is configured before proceeding
    if (!isAIConfigured()) {
      const error = new Error("AI service is not configured with an API key. Please add your OpenAI API key in Settings.");
      // Log this as an important error
      logError('OpenAI API key missing during recipe conversion', { error });
      onError(error);
      return;
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
      
      // Generate a unique ID for the recipe if it doesn't have one
      const recipeId = response.recipe.id || crypto.randomUUID();
      
      // Add converted flag and handle missing properties
      const convertedRecipe: RecipeData = {
        ...response.recipe,
        id: recipeId,
        isConverted: true, // CRITICAL: Ensure this is explicitly set to true
        createdAt: response.recipe.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Preserve the original text exactly as the introduction - CRITICAL
        introduction: originalText,
        // Ensure these properties exist to prevent null/undefined errors
        title: response.recipe.title || 'Untitled Recipe',
        ingredients: Array.isArray(response.recipe.ingredients) && response.recipe.ingredients.length > 0 
          ? response.recipe.ingredients 
          : ['Default ingredient, please edit'],
        instructions: Array.isArray(response.recipe.instructions) && response.recipe.instructions.length > 0
          ? response.recipe.instructions
          : ['Default instruction, please edit'],
        // Ensure equipment items have IDs
        equipmentNeeded: Array.isArray(response.recipe.equipmentNeeded) 
          ? response.recipe.equipmentNeeded.map(item => ({
              id: item.id || crypto.randomUUID(),
              name: item.name,
              affiliateLink: item.affiliateLink
            }))
          : []
      };
      
      // Log successful conversion
      logInfo('Recipe conversion completed successfully', {
        id: convertedRecipe.id,
        hasTitle: !!convertedRecipe.title,
        ingredientsCount: convertedRecipe.ingredients.length,
        instructionsCount: convertedRecipe.instructions.length,
        isConverted: convertedRecipe.isConverted
      });
      
      onComplete(convertedRecipe);
    } catch (processingError) {
      logError('Error during recipe processing:', { error: processingError });
      onError(processingError instanceof Error ? processingError : new Error(String(processingError)));
    }
  } catch (error) {
    logError('Recipe conversion error:', { error });
    onError(error instanceof Error ? error : new Error(String(error)));
  }
};
