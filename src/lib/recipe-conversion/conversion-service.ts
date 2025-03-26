
import { RecipeData } from '@/types/recipeTypes';
import { processRecipeText } from '@/lib/ai-services';
import { cleanOCRText } from './cleaners';
import { logError, logInfo } from '@/utils/logger';
import { getOpenAIApiKey, isOpenAIConfigured, updateOpenAIApiKey } from '@/lib/ai-services/ai-config';

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
    
    // Make sure we have the latest OpenAI API key
    updateOpenAIApiKey();
    
    // Check if OpenAI API is configured before proceeding
    if (!isOpenAIConfigured()) {
      logError('Recipe conversion failed', { error: 'AI service not configured with valid API key' });
      throw new Error('AI service not configured with valid API key. Please add your API key in settings.');
    }
    
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
    
    try {
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
      // For API errors, use a fallback method with local parsing
      logInfo('Using fallback recipe conversion method');
      
      // Create a basic parsed recipe with what we have
      const fallbackRecipe: RecipeData = createFallbackRecipe(cleanedText);
      
      // Let the user know we're using a basic conversion
      logInfo('Using fallback recipe conversion', {
        fallbackTitle: fallbackRecipe.title,
        fallbackIngredients: fallbackRecipe.ingredients.length
      });
      
      onSuccess(fallbackRecipe);
    }
  } catch (error) {
    logError('Recipe conversion error', { 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    onError(error instanceof Error ? error : new Error(String(error)));
  }
};

/**
 * Basic fallback recipe parser when AI conversion fails
 */
const createFallbackRecipe = (text: string): RecipeData => {
  // Very basic parsing of ingredients and instructions
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  // Try to extract a title from the first line
  const title = lines.length > 0 ? lines[0].trim() : 'Untitled Recipe';
  
  // Basic ingredient detection (lines with quantities or common ingredients)
  const ingredients = lines.filter(line => {
    const trimmedLine = line.trim().toLowerCase();
    return (
      /\d+\s*(?:cup|tbsp|tsp|oz|g|kg|ml|l|pound|lb|teaspoon|tablespoon)s?/.test(trimmedLine) ||
      /butter|flour|sugar|salt|egg|milk|water|oil|vanilla|baking|yeast/.test(trimmedLine)
    );
  });
  
  // Assume instructions are longer text paragraphs or numbered lines
  const instructions = lines.filter(line => {
    const trimmedLine = line.trim();
    return (
      (trimmedLine.length > 40 && !ingredients.includes(line)) ||
      /^\d+[\.\)]/.test(trimmedLine) || // Numbered lists
      /^step\s+\d+/i.test(trimmedLine)  // Lines starting with "Step X"
    );
  });
  
  return {
    title: title,
    introduction: "This recipe was converted using basic text parsing because AI conversion wasn't available.",
    ingredients: ingredients.length > 0 ? ingredients : ['Ingredients could not be automatically detected'],
    instructions: instructions.length > 0 ? instructions : ['Instructions could not be automatically detected'],
    prepTime: '',
    restTime: '',
    bakeTime: '',
    totalTime: '',
    tips: ['This recipe was parsed using a simple text converter. You may need to edit it for accuracy.'],
    proTips: [],
    equipmentNeeded: [],
    tags: ['converted-recipe'],
    isPublic: false,
    isConverted: true
  };
};
