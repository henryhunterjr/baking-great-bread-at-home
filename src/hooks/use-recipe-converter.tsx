
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
  
  // Enhanced recipe setter with proper logging and isConverted flag enforcement
  const setRecipeWithLogging = (newRecipe: RecipeData) => {
    if (!newRecipe) {
      logInfo("Attempt to set null or undefined recipe prevented");
      return recipe; // Return existing recipe to prevent nullifying the state
    }
    
    logInfo("Setting recipe in useRecipeConverter", {
      hasTitle: !!newRecipe.title,
      hasIngredients: Array.isArray(newRecipe.ingredients) && newRecipe.ingredients.length > 0,
      hasInstructions: Array.isArray(newRecipe.instructions) && newRecipe.instructions.length > 0,
      isConverted: newRecipe.isConverted === true
    });
    
    // Ensure key properties exist and are in correct format
    const updatedRecipe = {
      ...newRecipe,
      // Always ensure these core properties exist and are in the correct format
      title: newRecipe.title || 'Untitled Recipe',
      ingredients: Array.isArray(newRecipe.ingredients) ? newRecipe.ingredients : [],
      instructions: Array.isArray(newRecipe.instructions) ? newRecipe.instructions : [],
      isConverted: true // Always force this to true for any recipe being set
    };
    
    setRecipe(updatedRecipe);
    return updatedRecipe;
  };

  // Auto-switch to favorites tab after saving with enhanced error handling
  const handleSaveWithTabSwitch = async (updatedRecipe: RecipeData = recipe): Promise<boolean> => {
    if (!updatedRecipe || !updatedRecipe.title) {
      logInfo("Prevented save attempt for invalid recipe", { 
        hasRecipe: !!updatedRecipe,
        hasTitle: updatedRecipe?.title 
      });
      setConversionError("Cannot save recipe: missing title or recipe data");
      return false;
    }
    
    // Ensure isConverted is true and other required fields are present before saving
    const recipeToSave = {
      ...updatedRecipe,
      title: updatedRecipe.title || 'Untitled Recipe',
      ingredients: Array.isArray(updatedRecipe.ingredients) ? updatedRecipe.ingredients : [],
      instructions: Array.isArray(updatedRecipe.instructions) ? updatedRecipe.instructions : [],
      isConverted: true,
      updatedAt: new Date().toISOString()
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
      // Clear any previous errors
      setConversionError(null);
    }
    return success;
  };

  // Handle selection with error clearing and isConverted enforcement
  const handleSelectWithErrorClearing = (savedRecipe: RecipeData) => {
    if (!savedRecipe) return;
    
    // Ensure isConverted is true when selecting a recipe
    const recipeWithConversion = {
      ...savedRecipe,
      isConverted: true,
      ingredients: Array.isArray(savedRecipe.ingredients) ? savedRecipe.ingredients : [],
      instructions: Array.isArray(savedRecipe.instructions) ? savedRecipe.instructions : []
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
