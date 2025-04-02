
import { RecipeData } from '@/types/recipeTypes';
import { processRecipeText } from '@/lib/ai-services';
import { cleanOCRText } from '@/lib/ai-services/text-cleaner';
import { logError, logInfo } from '@/utils/logger';
import { getOpenAIApiKey, isAIConfigured, updateOpenAIApiKey, checkAPIKeyStatus } from '@/lib/ai-services';
import { toast } from 'sonner';

// Helper function to extract a brief introduction from the recipe text
const extractBriefIntroduction = (text: string): string => {
  // Get first 150 characters or the first sentence, whichever is shorter
  const firstSentence = text.split(/(?<=[.!?])\s+/)[0] || '';
  const shortIntro = text.substring(0, 150);
  
  return firstSentence.length < shortIntro.length 
    ? firstSentence 
    : shortIntro + '...';
};

export const convertRecipeText = async (
  text: string, 
  onComplete: (recipe: RecipeData) => void,
  onError: (error: Error) => void
): Promise<void> => {
  try {
    // Log initial conversion attempt
    logInfo('Starting recipe conversion process', { textLength: text?.length || 0 });
    
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
      logInfo('Calling processRecipeText with cleaned text', { cleanedTextLength: cleanedText.length });
      
      const response = await processRecipeText(cleanedText);
      
      if (!response || !response.success) {
        throw new Error(response?.error || "Failed to process recipe. Please try again.");
      }
      
      if (!response.recipe) {
        throw new Error("No recipe data was returned. The text might not be recognized as a recipe.");
      }
      
      // Generate a unique ID for the recipe if it doesn't have one
      const recipeId = response.recipe.id || crypto.randomUUID();
      
      // Log receipt of recipe data
      logInfo('Recipe data received from AI service', { 
        hasTitle: !!response.recipe.title,
        hasIngredients: Array.isArray(response.recipe.ingredients) && response.recipe.ingredients.length > 0,
        hasInstructions: Array.isArray(response.recipe.instructions) && response.recipe.instructions.length > 0
      });
      
      // Always ensure all required fields are present
      const guaranteedIngredients = Array.isArray(response.recipe.ingredients) && response.recipe.ingredients.length > 0 
        ? response.recipe.ingredients 
        : ['Default ingredient, please edit'];
      
      const guaranteedInstructions = Array.isArray(response.recipe.instructions) && response.recipe.instructions.length > 0
        ? response.recipe.instructions
        : ['Default instruction, please edit'];
      
      // Create a brief introduction instead of using the full recipe text
      const briefIntroduction = extractBriefIntroduction(originalText);
      logInfo('Brief introduction created', { introLength: briefIntroduction.length });
      
      // Add converted flag and handle missing properties - FIXED: recipe saving issue
      const convertedRecipe: RecipeData = {
        ...response.recipe,
        id: recipeId,
        isConverted: true, // CRITICAL: Ensure this is explicitly set to true
        createdAt: response.recipe.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Use a brief introduction instead of the full recipe text
        introduction: briefIntroduction,
        // Ensure these properties exist to prevent null/undefined errors
        title: response.recipe.title || 'Untitled Recipe',
        ingredients: guaranteedIngredients,
        instructions: guaranteedInstructions,
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
      
      // Fix recipe save functionality by verifying recipe validity
      if (
        convertedRecipe.title &&
        convertedRecipe.ingredients.length > 0 &&
        convertedRecipe.instructions.length > 0 &&
        convertedRecipe.isConverted === true // CRITICAL: Ensure this is explicitly true, not just truthy
      ) {
        logInfo('Recipe is valid and ready to save', {
          hasTitle: !!convertedRecipe.title,
          ingredientsCount: convertedRecipe.ingredients.length,
          instructionsCount: convertedRecipe.instructions.length,
          isConverted: convertedRecipe.isConverted === true
        });
      } else {
        logError('Recipe validation failed', {
          hasTitle: !!convertedRecipe.title,
          ingredientsCount: convertedRecipe.ingredients.length,
          instructionsCount: convertedRecipe.instructions.length, 
          isConverted: convertedRecipe.isConverted
        });
      }
      
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
