
import { logInfo, logError } from '@/utils/logger';
import { RecipeData } from '@/types/recipeTypes';
import { processRecipeText } from '@/lib/ai-services';
import { cleanOCRText } from './cleaners';
import { parseRecipeJson, convertFromStandardFormat } from './json-parser';

/**
 * Processes recipe text and converts it to structured RecipeData
 */
export const convertRecipeText = async (
  text: string, 
  onSuccess: (recipe: RecipeData) => void, 
  onError: (error: Error) => void
): Promise<void> => {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error("Please enter some recipe text to convert.");
    }
    
    logInfo("Starting recipe conversion process", { textLength: text.length });
    
    // First check if this is a valid JSON recipe in our standard format
    const standardRecipe = parseRecipeJson(text);
    
    if (standardRecipe) {
      // If it's already in our standard JSON format, convert it directly
      logInfo("Text recognized as JSON recipe", { 
        title: standardRecipe.title 
      });
      
      const convertedRecipe = convertFromStandardFormat(standardRecipe);
      onSuccess(convertedRecipe);
      return;
    }
    
    // Clean up the text if it comes from OCR
    const cleanedText = cleanOCRText(text);
    
    // Process the recipe text using the AI service
    logInfo("Sending text to AI service for processing", { 
      textLength: cleanedText.length 
    });
    
    const result = await processRecipeText(cleanedText);
    
    // Map the AI service result to our RecipeData format
    const convertedRecipe: RecipeData = {
      title: result.title,
      introduction: result.description,
      ingredients: result.ingredients.map(ing => 
        `${ing.quantity} ${ing.unit} ${ing.name}`.trim()),
      prepTime: result.prepTime.toString(),
      restTime: '',
      bakeTime: result.cookTime ? result.cookTime.toString() : '',
      totalTime: (result.prepTime + (result.cookTime || 0)).toString(),
      instructions: result.steps,
      tips: result.notes ? [result.notes] : [],
      proTips: [],
      equipmentNeeded: [],
      imageUrl: result.imageUrl || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
      tags: result.tags,
      isPublic: false,
      isConverted: true
    };
    
    logInfo("Recipe conversion successful", { 
      title: convertedRecipe.title,
      ingredientsCount: convertedRecipe.ingredients.length,
      instructionsCount: convertedRecipe.instructions.length
    });
    
    onSuccess(convertedRecipe);
  } catch (error) {
    logError("Recipe conversion failed", { error });
    onError(error instanceof Error ? error : new Error(String(error)));
    throw error; // Re-throw to allow parent component to handle the error
  }
};
