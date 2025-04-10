
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

// Parse recipe text into structured format with improved error handling
export const parseRecipeText = async (text: string): Promise<{
  success: boolean;
  title?: string;
  ingredients?: string[];
  instructions?: string[];
  prepTime?: string;
  cookTime?: string;
  servings?: string;
  notes?: string[];
  error?: string;
}> => {
  try {
    // Clean the input text
    const cleanedText = cleanOCRText(text);
    
    if (!cleanedText || cleanedText.trim().length < 20) {
      return {
        success: false,
        error: "The provided text is too short or doesn't appear to be a recipe."
      };
    }
    
    // Check API key status
    if (!isAIConfigured()) {
      return {
        success: false,
        error: "AI service is not configured with an API key."
      };
    }
    
    const response = await processRecipeText(cleanedText);
    
    if (!response || !response.success) {
      return {
        success: false,
        error: response?.error || "Failed to process recipe."
      };
    }
    
    return {
      success: true,
      title: response.recipe?.title,
      ingredients: response.recipe?.ingredients,
      instructions: response.recipe?.instructions,
      prepTime: response.recipe?.prepTime,
      cookTime: response.recipe?.bakeTime,
      servings: response.recipe?.servings,
      notes: response.recipe?.notes
    };
    
  } catch (error) {
    logError('Error parsing recipe text', { error });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown parsing error"
    };
  }
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
    
    // Parse the recipe text first
    const parseResult = await parseRecipeText(text);
    
    if (!parseResult.success) {
      throw new Error(parseResult.error || "Failed to parse recipe");
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
    
    try {
      logInfo('Processing recipe with parsed data', { 
        hasTitle: !!parseResult.title,
        ingredientsCount: parseResult.ingredients?.length || 0,
        instructionsCount: parseResult.instructions?.length || 0
      });
      
      // Generate a unique ID for the recipe
      const recipeId = crypto.randomUUID();
      
      // Always ensure all required fields are present
      // Ensure ingredients are properly formatted as strings
      const guaranteedIngredients = Array.isArray(parseResult.ingredients) && parseResult.ingredients.length > 0 
        ? parseResult.ingredients.map(ing => typeof ing === 'string' ? ing : `${ing.quantity} ${ing.unit} ${ing.name}`)
        : ['Default ingredient, please edit'];
      
      const guaranteedInstructions = Array.isArray(parseResult.instructions) && parseResult.instructions.length > 0
        ? parseResult.instructions
        : ['Default instruction, please edit'];
      
      // Create a brief introduction instead of using the full recipe text
      const briefIntroduction = extractBriefIntroduction(originalText);
      logInfo('Brief introduction created', { introLength: briefIntroduction.length });
      
      // Add converted flag and handle missing properties - FIXED: recipe saving issue
      const convertedRecipe: RecipeData = {
        id: recipeId,
        isConverted: true, // CRITICAL: Ensure this is explicitly set to true
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Use a brief introduction instead of the full recipe text
        introduction: briefIntroduction,
        // Ensure these properties exist to prevent null/undefined errors
        title: parseResult.title || 'Untitled Recipe',
        ingredients: guaranteedIngredients,
        instructions: guaranteedInstructions,
        prepTime: parseResult.prepTime || '',
        bakeTime: parseResult.cookTime || '',
        servings: parseResult.servings || '',
        notes: parseResult.notes || [],
        // Initialize empty arrays for other properties
        tips: [],
        proTips: [],
        equipmentNeeded: []
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
