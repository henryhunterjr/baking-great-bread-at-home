
import { RecipeData } from '@/types/recipeTypes';
import { logError, logInfo } from '@/utils/logger';

export const useRecipeConversionHandler = (
  setRecipe: (recipe: RecipeData) => void,
  processRecipe: (recipe: RecipeData) => RecipeData,
  setIsEditing: (isEditing: boolean) => void,
  setConversionError: (error: string | null) => void
) => {
  // This function accepts a string and processes it into a RecipeData object
  const handleConversionComplete = async (text: string) => {
    try {
      logInfo("Processing conversion text", { textLength: text.length });
      
      // Simple example conversion (in a real app, this would be more sophisticated)
      // Extract a title from the first line
      const lines = text.split('\n').filter(line => line.trim() !== '');
      const title = lines[0] || 'Converted Recipe';
      
      // Attempt to extract ingredients (lines with numbers, bullets, etc.)
      const ingredients = lines
        .filter(line => /^[\d•\-*]/.test(line.trim()) || line.toLowerCase().includes('ingredient'))
        .map(line => line.trim());
      
      // The rest are likely instructions
      const instructions = lines
        .filter(line => !/^[\d•\-*]/.test(line.trim()) && 
                        !line.toLowerCase().includes('ingredient') && 
                        line !== title)
        .map(line => line.trim());
      
      // Create a basic recipe structure
      const newRecipe: RecipeData = {
        title: title,
        ingredients: ingredients.length > 0 ? ingredients : ['Add ingredients here'],
        instructions: instructions.length > 0 ? instructions : ['Add instructions here'],
        isConverted: true
      };
      
      // Process the recipe to ensure all required fields exist
      const processedRecipe = processRecipe(newRecipe);
      
      // Update state
      setRecipe(processedRecipe);
      setIsEditing(true);
      setConversionError(null);
      
      logInfo("Recipe conversion complete", { 
        title: processedRecipe.title,
        ingredients: processedRecipe.ingredients.length,
        instructions: processedRecipe.instructions.length
      });
      
      return processedRecipe;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during conversion';
      logError("Recipe conversion failed", { error: errorMessage });
      setConversionError(errorMessage);
      return null;
    }
  };

  return {
    handleConversionComplete,
  };
};
