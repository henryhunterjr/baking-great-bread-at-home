
import { useRecipeState } from './recipe/use-recipe-state';
import { useRecipeConversionHandler } from './recipe/use-recipe-conversion-handler';
import { useRecipeStorage } from './recipe/use-recipe-storage';
import { useTabState } from './recipe/use-tab-state';
import { useConversionSuccess } from './recipe/use-conversion-success';
import { RecipeData } from '@/types/recipeTypes';
import { logInfo } from '@/utils/logger';

export const useRecipeConverter = () => {
  // Use the smaller, focused hooks
  const {
    recipe,
    setRecipe,
    isEditing,
    setIsEditing,
    showConversionSuccess,
    setShowConversionSuccess,
    conversionError,
    setConversionError,
    processRecipe,
    resetRecipe
  } = useRecipeState();

  const { activeTab, setActiveTab } = useTabState();

  const { handleConversionComplete } = useRecipeConversionHandler(
    setRecipe,
    processRecipe,
    setIsEditing,
    setConversionError
  );

  const { handleSaveRecipe, handleSelectSavedRecipe } = useRecipeStorage(
    recipe,
    setRecipe,
    setIsEditing
  );

  // Use the conversion success hook
  useConversionSuccess(recipe, isEditing, setShowConversionSuccess);
  
  // Log recipe status whenever it changes
  const setRecipeWithLogging = (newRecipe: RecipeData) => {
    logInfo("Setting recipe in useRecipeConverter", {
      hasTitle: !!newRecipe.title,
      hasIngredients: Array.isArray(newRecipe.ingredients) && newRecipe.ingredients.length > 0,
      hasInstructions: Array.isArray(newRecipe.instructions) && newRecipe.instructions.length > 0,
      isConverted: newRecipe.isConverted === true
    });
    
    // Ensure isConverted is always set to true for valid recipes
    const updatedRecipe = {
      ...newRecipe,
      isConverted: true // Always force this to true for any recipe being set
    };
    
    setRecipe(updatedRecipe);
    return updatedRecipe;
  };

  // Auto-switch to favorites tab after saving
  const handleSaveWithTabSwitch = async (updatedRecipe: RecipeData = recipe): Promise<boolean> => {
    // Ensure isConverted is true before saving
    const recipeToSave = {
      ...updatedRecipe,
      isConverted: true
    };
    
    logInfo("Saving recipe in handleSaveWithTabSwitch", {
      hasId: !!recipeToSave.id,
      title: recipeToSave.title,
      isConverted: recipeToSave.isConverted === true
    });
    
    const success = await handleSaveRecipe(recipeToSave);
    if (success) {
      // Auto-switch to favorites tab after saving
      setActiveTab("favorites");
    }
    return success;
  };

  // Handle selection with error clearing
  const handleSelectWithErrorClearing = (savedRecipe: RecipeData) => {
    // Ensure isConverted is true when selecting a recipe
    const recipeWithConversion = {
      ...savedRecipe,
      isConverted: true
    };
    
    handleSelectSavedRecipe(recipeWithConversion);
    setConversionError(null);
  };

  return {
    recipe,
    setRecipe: setRecipeWithLogging,
    isEditing,
    setIsEditing,
    showConversionSuccess,
    activeTab,
    setActiveTab,
    handleConversionComplete,
    handleSaveRecipe: handleSaveWithTabSwitch,
    handleSelectSavedRecipe: handleSelectWithErrorClearing,
    resetRecipe,
    conversionError,
    setConversionError
  };
};
