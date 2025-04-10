
import { useCallback } from 'react';
import { RecipeData } from '@/types/recipeTypes';
import { processRecipe as processRecipeService } from '@/services/RecipeService';
import { logError, logInfo } from '@/utils/logger';
import { useToast } from '@/hooks/use-toast';

export function useRecipeConversionHandler(
  setRecipe: (recipe: RecipeData) => void,
  processRecipe: (recipe: RecipeData) => RecipeData,
  setIsEditing: (editing: boolean) => void,
  setConversionError: (error: string | null) => void
) {
  const { toast } = useToast();
  
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

        // Log state for debugging
        logInfo('Recipe in conversion handler before processing:', { 
          hasTitle: !!completedRecipe.title,
          ingredientsCount: completedRecipe.ingredients.length,
          instructionsCount: completedRecipe.instructions.length,
          isConverted: completedRecipe.isConverted === true
        });

        // Process and validate the recipe
        const processedRecipe = processRecipe(completedRecipe);
        
        // Ensure isConverted flag is true even after processing
        processedRecipe.isConverted = true;
        
        // Log after processing
        logInfo('Recipe in conversion handler after processing:', { 
          hasTitle: !!processedRecipe.title,
          ingredientsCount: processedRecipe.ingredients.length,
          instructionsCount: processedRecipe.instructions.length,
          isConverted: processedRecipe.isConverted === true
        });
        
        // Set the processed recipe to the state
        setRecipe(processedRecipe);
        
        // Set editing mode (allow user to make changes if needed)
        setIsEditing(true);
        
        // Clear any previous conversion errors
        setConversionError(null);
        
        toast({
          title: "Recipe Converted",
          description: "Your recipe has been successfully converted. You can now edit and save it.",
        });
      } catch (error) {
        // Log the error
        const errorMessage = 
          error instanceof Error ? error.message : 'Unknown error during recipe conversion';
        logError('Error in handleConversionComplete:', { error });
        
        // Set the error message to display to the user
        setConversionError(errorMessage);
        
        toast({
          variant: "destructive", 
          title: "Conversion Error",
          description: errorMessage,
        });
      }
    },
    [setRecipe, processRecipe, setIsEditing, setConversionError, toast]
  );

  return {
    handleConversionComplete
  };
}
