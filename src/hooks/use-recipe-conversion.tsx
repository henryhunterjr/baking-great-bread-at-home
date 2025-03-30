
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { RecipeData } from '@/types/recipeTypes';
import { convertRecipeText } from '@/lib/recipe-conversion/conversion-service';
import { logError, logInfo } from '@/utils/logger';

/**
 * Hook to manage recipe conversion state and process
 */
export const useRecipeConversion = (onConversionComplete: (recipe: RecipeData) => void) => {
  const { toast } = useToast();
  const [isConverting, setIsConverting] = useState(false);
  const [conversionError, setConversionError] = useState<string | null>(null);

  const handleConversion = async (text: string) => {
    if (!text || text.trim().length === 0) {
      toast({
        variant: "destructive",
        title: "Empty Text",
        description: "Please enter some recipe text to convert.",
      });
      setConversionError("Empty text cannot be processed");
      return;
    }
    
    setIsConverting(true);
    setConversionError(null);
    
    logInfo('Starting recipe conversion process', { textLength: text.length });
    
    try {
      await convertRecipeText(
        text,
        (convertedRecipe) => {
          // Ensure that a recipe has at least the minimum required fields filled
          const enrichedRecipe = ensureRequiredFields(convertedRecipe);
          
          // Pass the enriched recipe to the callback
          onConversionComplete(enrichedRecipe);
          
          toast({
            title: "Recipe Converted!",
            description: "Your recipe has been successfully converted. You can now edit, save, or print it.",
          });
          
          logInfo('Recipe conversion completed successfully');
        },
        (error) => {
          const errorMessage = error.message || "We couldn't convert your recipe. Please try again or use a different format.";
          setConversionError(errorMessage);
          
          toast({
            variant: "destructive",
            title: "Conversion Failed",
            description: errorMessage,
          });
          
          logError('Recipe conversion failed:', { error });
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unexpected error occurred during conversion.";
      
      setConversionError(errorMessage);
      logError('Unexpected error in conversion process:', { error });
      
      toast({
        variant: "destructive",
        title: "Conversion Failed",
        description: errorMessage,
      });
    } finally {
      setIsConverting(false);
    }
  };

  // Helper function to ensure all required fields are present
  const ensureRequiredFields = (recipe: RecipeData): RecipeData => {
    // Create a new object to avoid modifying the original
    const enrichedRecipe: RecipeData = {
      ...recipe,
      // Ensure these fields exist with fallback values if they're missing
      title: recipe.title || 'Untitled Recipe',
      ingredients: recipe.ingredients || [],
      instructions: recipe.instructions || [],
      // Make sure isConverted flag is set - this is crucial for enabling the save button
      isConverted: true
    };

    // Log what we're doing for debugging
    logInfo('Enriching recipe data to ensure required fields', {
      hadTitle: !!recipe.title,
      hadIngredients: Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0,
      hadInstructions: Array.isArray(recipe.instructions) && recipe.instructions.length > 0
    });

    // If ingredients is empty, add a placeholder
    if (!enrichedRecipe.ingredients.length) {
      enrichedRecipe.ingredients = ['Ingredients to be added'];
    }

    // If instructions is empty, add a placeholder
    if (!enrichedRecipe.instructions.length) {
      enrichedRecipe.instructions = ['Instructions to be added'];
    }

    return enrichedRecipe;
  };

  return {
    isConverting,
    conversionError,
    handleConversion
  };
};
