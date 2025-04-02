
import { useRecipeState } from './recipe/use-recipe-state';
import { useRecipeConversionHandler } from './recipe/use-recipe-conversion-handler';
import { useRecipeStorage } from './recipe/use-recipe-storage';
import { useTabState } from './recipe/use-tab-state';
import { useConversionSuccess } from './recipe/use-conversion-success';
import { RecipeData } from '@/types/recipeTypes';

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

  // Auto-switch to favorites tab after saving
  const handleSaveWithTabSwitch = (updatedRecipe: RecipeData = recipe) => {
    const success = handleSaveRecipe(updatedRecipe);
    if (success) {
      // Auto-switch to favorites tab after saving
      setActiveTab("favorites");
    }
    return success;
  };

  // Handle selection with error clearing
  const handleSelectWithErrorClearing = (savedRecipe: RecipeData) => {
    handleSelectSavedRecipe(savedRecipe);
    setConversionError(null);
  };

  return {
    recipe,
    setRecipe,
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
