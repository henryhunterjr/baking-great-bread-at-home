
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

  const handleSaveRecipe = async (updatedRecipe: RecipeData = recipe): Promise<boolean> => {
    try {
      // Always ensure isConverted is true when saving
      const recipeToProcess = {
        ...updatedRecipe,
        isConverted: true
      };
      
      // Log the recipe being saved for debugging
      logInfo("Attempting to save recipe", {
        id: recipeToProcess.id || "new",
        title: recipeToProcess.title,
        ingredientsCount: Array.isArray(recipeToProcess.ingredients) ? recipeToProcess.ingredients.length : 0,
        instructionsCount: Array.isArray(recipeToProcess.instructions) ? recipeToProcess.instructions.length : 0,
        isConverted: recipeToProcess.isConverted === true
      });
      
      // Check if the recipe is valid before saving
      if (!isRecipeValid(recipeToProcess)) {
        logError("Cannot save recipe: invalid data", {
          hasTitle: !!recipeToProcess.title,
          hasIngredients: Array.isArray(recipeToProcess.ingredients) && recipeToProcess.ingredients.length > 0,
          hasInstructions: Array.isArray(recipeToProcess.instructions) && recipeToProcess.instructions.length > 0
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
        ...recipeToProcess,
        id: recipeToProcess.id || uuidv4(),
        createdAt: recipeToProcess.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isConverted: true // Ensure this flag is set to true
      };
      
      // Use the utility function to save to localStorage
      const saveSuccess = await saveRecipeToStorage(recipeToSave);
      
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
      
      // Ensure the recipe has all required fields and isConverted is true
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
        isConverted: true // Ensure this is set to true
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
