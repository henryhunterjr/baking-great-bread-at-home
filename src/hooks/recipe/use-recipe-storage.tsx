
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";
import { RecipeData } from '@/types/recipeTypes';
import { logInfo, logError } from '@/utils/logger';

export const useRecipeStorage = (
  recipe: RecipeData,
  setRecipe: (recipe: RecipeData) => void,
  setIsEditing: (isEditing: boolean) => void
) => {
  const { toast } = useToast();

  const handleSaveRecipe = (updatedRecipe: RecipeData = recipe) => {
    try {
      // If no recipe ID exists, create one (for new recipes)
      const recipeToSave = {
        ...updatedRecipe,
        id: updatedRecipe.id || uuidv4(),
        createdAt: updatedRecipe.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Ensure isConverted flag is set
        isConverted: true
      };
      
      logInfo("Saving recipe", {
        id: recipeToSave.id,
        title: recipeToSave.title,
        ingredientsCount: Array.isArray(recipeToSave.ingredients) ? recipeToSave.ingredients.length : 0,
        instructionsCount: Array.isArray(recipeToSave.instructions) ? recipeToSave.instructions.length : 0
      });
      
      setRecipe(recipeToSave);
      setIsEditing(false);
      
      // Get existing recipes from localStorage
      const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
      
      // Check if this recipe already exists in saved recipes
      const existingRecipeIndex = savedRecipes.findIndex((r: RecipeData) => r.id === recipeToSave.id);
      
      if (existingRecipeIndex >= 0) {
        // Update existing recipe
        savedRecipes[existingRecipeIndex] = recipeToSave;
        toast({
          title: "Recipe Updated!",
          description: "Your recipe has been updated in your collection.",
        });
      } else {
        // Add new recipe
        savedRecipes.push(recipeToSave);
        toast({
          title: "Recipe Saved!",
          description: "Your recipe has been added to your collection.",
        });
      }
      
      // Save back to localStorage
      localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
      
      return true;
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
      const processedRecipe = {
        ...savedRecipe,
        equipmentNeeded: savedRecipe.equipmentNeeded?.map(item => ({
          id: item.id || uuidv4(),
          name: item.name,
          affiliateLink: item.affiliateLink
        })) || [],
        // Ensure isConverted flag is set
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
    handleSelectSavedRecipe
  };
};
