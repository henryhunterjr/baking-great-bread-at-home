
import { useToast } from "@/hooks/use-toast";
import { RecipeData } from '@/types/recipeTypes';
import { logInfo } from '@/utils/logger';

export const useRecipeConversionHandler = (
  setRecipe: (recipe: RecipeData) => void,
  processRecipe: (recipe: RecipeData) => RecipeData,
  setIsEditing: (isEditing: boolean) => void,
  setConversionError: (error: string | null) => void
) => {
  const { toast } = useToast();

  const handleConversionComplete = (convertedRecipe: RecipeData) => {
    // Process the converted recipe to ensure it has all required fields
    const processedRecipe = processRecipe(convertedRecipe);
    
    logInfo("Recipe conversion complete", {
      hasTitle: !!processedRecipe.title,
      ingredientsCount: processedRecipe.ingredients.length,
      instructionsCount: processedRecipe.instructions.length,
      isConverted: processedRecipe.isConverted
    });
    
    setRecipe(processedRecipe);
    // Now go directly to editing mode
    setIsEditing(true);
    setConversionError(null);
    
    toast({
      title: "Recipe Converted!",
      description: "Your recipe has been converted. You can now edit and save it to your collection.",
    });
  };

  return {
    handleConversionComplete
  };
};
