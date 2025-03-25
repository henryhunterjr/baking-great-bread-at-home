
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
    
    // Set a maximum length to avoid processing extremely large texts
    const MAX_TEXT_LENGTH = 20000; // 20KB is plenty for most recipes
    if (text.length > MAX_TEXT_LENGTH) {
      logInfo("Truncating very long recipe text", { 
        originalLength: text.length,
        truncatedLength: MAX_TEXT_LENGTH
      });
      text = text.substring(0, MAX_TEXT_LENGTH);
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
    
    // Add a timeout for the AI service call
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Recipe conversion timed out after 60 seconds')), 60000)
    );
    
    // Race the AI service against the timeout
    const result = await Promise.race([
      processRecipeText(cleanedText),
      timeoutPromise
    ]);
    
    if (!result.success || !result.recipe) {
      throw new Error("Failed to process recipe text");
    }
    
    const recipeData = result.recipe;
    
    // Map the AI service result to our RecipeData format
    const convertedRecipe: RecipeData = {
      title: recipeData.title || 'Untitled Recipe',
      introduction: recipeData.introduction || '',
      ingredients: recipeData.ingredients || [],
      prepTime: recipeData.prepTime || '',
      restTime: recipeData.restTime || '',
      bakeTime: recipeData.bakeTime || '',
      totalTime: recipeData.totalTime || '',
      instructions: recipeData.instructions || [],
      tips: recipeData.tips || [],
      proTips: recipeData.proTips || [],
      equipmentNeeded: recipeData.equipmentNeeded || [],
      imageUrl: recipeData.imageUrl || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
      tags: recipeData.tags || [],
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
    
    // Transform common errors to more user-friendly messages
    let errorToReport: Error;
    if (error instanceof Error) {
      if (error.message.includes('timed out')) {
        errorToReport = new Error(
          "The recipe conversion took too long. Try with a shorter recipe or simpler format."
        );
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorToReport = new Error(
          "Network error while converting recipe. Please check your internet connection and try again."
        );
      } else {
        errorToReport = error;
      }
    } else {
      errorToReport = new Error(String(error));
    }
    
    onError(errorToReport);
  }
};
