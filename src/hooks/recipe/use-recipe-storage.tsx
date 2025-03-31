
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";
import { RecipeData } from '@/types/recipeTypes';
import { logInfo, logError } from '@/utils/logger';
import { saveRecipeToStorage } from '@/utils/storage-helpers';

export const useRecipeStorage = (
  recipe: RecipeData,
  setRecipe: (recipe: RecipeData) => void,
  setIsEditing: (isEditing: boolean) => void
) => {
  const { toast } = useToast();

  // Helper function to check if a recipe is valid
  const isRecipeValid = (recipeData: RecipeData): boolean => {
    const hasTitle = !!recipeData.title && recipeData.title.trim() !== '';
    const hasIngredients = Array.isArray(recipeData.ingredients) && recipeData.ingredients.length > 0;
    const hasInstructions = Array.isArray(recipeData.instructions) && recipeData.instructions.length > 0;
    
    logInfo("Recipe validation in storage hook", {
      hasTitle,
      hasIngredients,
      hasInstructions
    });
    
    return hasTitle && hasIngredients && hasInstructions;
  };

  const handleSaveRecipe = (updatedRecipe: RecipeData = recipe) => {
    try {
      // Log the recipe being saved for debugging
      logInfo("Attempting to save recipe", {
        id: updatedRecipe.id || "new",
        title: updatedRecipe.title,
        ingredientsCount: Array.isArray(updatedRecipe.ingredients) ? updatedRecipe.ingredients.length : 0,
        instructionsCount: Array.isArray(updatedRecipe.instructions) ? updatedRecipe.instructions.length : 0,
        isConverted: !!updatedRecipe.isConverted
      });
      
      // Check if the recipe is valid before saving
      if (!isRecipeValid(updatedRecipe)) {
        logError("Cannot save recipe: invalid data", {
          hasTitle: !!updatedRecipe.title,
          hasIngredients: Array.isArray(updatedRecipe.ingredients) && updatedRecipe.ingredients.length > 0,
          hasInstructions: Array.isArray(updatedRecipe.instructions) && updatedRecipe.instructions.length > 0
        });
        
        toast({
          variant: "destructive",
          title: "Cannot Save Recipe",
          description: "Recipe must have a title, ingredients, and instructions.",
        });
        
        return false;
      }

      // Prepare the recipe for saving with required fields
      const recipeToSave = {
        ...updatedRecipe,
        id: updatedRecipe.id || uuidv4(),
        createdAt: updatedRecipe.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isConverted: true
      };
      
      // Use the utility function to save to localStorage
      const saveSuccess = saveRecipeToStorage(recipeToSave);
      
      if (saveSuccess) {
        // Update the recipe state with the saved version
        setRecipe(recipeToSave);
        setIsEditing(false);
        
        toast({
          title: "Recipe Saved!",
          description: recipeToSave.id === updatedRecipe.id ? 
            "Your recipe has been updated." : 
            "Your recipe has been added to your collection.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Save Failed",
          description: "There was an error saving your recipe. Please try again.",
        });
      }
      
      return saveSuccess;
    } catch (error) {
      logError("Error saving recipe", { error });
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "There was an error saving your recipe. Please try again.",
      });
      return false;
    }
  };

  const handleSelectSavedRecipe = (savedRecipe: RecipeData) => {
    try {
      logInfo("Selecting saved recipe", {
        id: savedRecipe.id,
        title: savedRecipe.title
      });
      
      // Ensure the recipe has all required fields
      const processedRecipe = {
        ...savedRecipe,
        ingredients: Array.isArray(savedRecipe.ingredients) ? savedRecipe.ingredients : ['Add ingredients'],
        instructions: Array.isArray(savedRecipe.instructions) ? savedRecipe.instructions : ['Add instructions'],
        equipmentNeeded: Array.isArray(savedRecipe.equipmentNeeded) ? 
          savedRecipe.equipmentNeeded.map(item => ({
            id: item.id || uuidv4(),
            name: item.name,
            affiliateLink: item.affiliateLink
          })) : [],
        isConverted: true
      };
      
      setRecipe(processedRecipe);
      setIsEditing(false);
    } catch (error) {
      logError("Error selecting saved recipe", { error });
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load the selected recipe. Please try again.",
      });
    }
  };

  return {
    handleSaveRecipe,
    handleSelectSavedRecipe,
    isRecipeValid
  };
};
