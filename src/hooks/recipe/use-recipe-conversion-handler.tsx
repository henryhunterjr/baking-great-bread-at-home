
import { useCallback } from 'react';
import { RecipeData } from '@/types/recipeTypes';
import { processRecipe as processRecipeService } from '@/services/RecipeService';
import { logError } from '@/utils/logger';

export function useRecipeConversionHandler(
  setRecipe: (recipe: RecipeData) => void,
  processRecipe: (recipe: RecipeData) => RecipeData,
  setIsEditing: (editing: boolean) => void,
  setConversionError: (error: string | null) => void
) {
  const handleConversionComplete = useCallback(
    async (recipe: RecipeData) => {
      try {
        // Set minimal required fields if they're missing
        const completedRecipe: RecipeData = {
          ...recipe,
          title: recipe.title || 'New Recipe',
          ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
          instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
          isConverted: true, // Explicitly ensure this is set to true
          createdAt: recipe.createdAt || new Date().toISOString()
        };

        // Process and validate the recipe
        const processedRecipe = processRecipe(completedRecipe);
        
        // Set the processed recipe to the state
        setRecipe(processedRecipe);
        
        // Set editing mode (allow user to make changes if needed)
        setIsEditing(true);
        
        // Clear any previous conversion errors
        setConversionError(null);
      } catch (error) {
        // Log the error
        const errorMessage = 
          error instanceof Error ? error.message : 'Unknown error during recipe conversion';
        logError('Error in handleConversionComplete:', { error });
        
        // Set the error message to display to the user
        setConversionError(errorMessage);
      }
    },
    [setRecipe, processRecipe, setIsEditing, setConversionError]
  );

  return {
    handleConversionComplete
  };
}
