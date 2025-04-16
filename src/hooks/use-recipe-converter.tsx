
import { useRecipeState } from './recipe/use-recipe-state';
import { useRecipeConversionHandler } from './recipe/use-recipe-conversion-handler';
import { useRecipeStorage } from './recipe/use-recipe-storage';
import { useTabState } from './recipe/use-tab-state';
import { useConversionSuccess } from './recipe/use-conversion-success';
import { RecipeData } from '@/types/recipeTypes';
import { logInfo } from '@/utils/logger';

export const useRecipeConverter = () => {
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

  useConversionSuccess(recipe, isEditing, setShowConversionSuccess);

  const setRecipeWithConversion = (incoming: RecipeData) => {
    const verified = {
      ...incoming,
      isConverted: true
    };

    logInfo("Setting recipe in useRecipeConverter", {
      hasTitle: !!verified.title,
      ingredients: verified.ingredients?.length,
      instructions: verified.instructions?.length,
      isConverted: verified.isConverted
    });

    setRecipe(verified);
    return verified;
  };

  const handleSaveWithSwitch = async (incoming: RecipeData = recipe): Promise<boolean> => {
    const saveReady = {
      ...incoming,
      isConverted: true
    };

    logInfo("Saving recipe", {
      id: saveReady.id,
      title: saveReady.title,
      converted: saveReady.isConverted
    });

    const ok = await handleSaveRecipe(saveReady);
    if (ok) setActiveTab("favorites");
    return ok;
  };

  const handleSelectWithClear = (chosen: RecipeData) => {
    const flagged = {
      ...chosen,
      isConverted: true
    };

    handleSelectSavedRecipe(flagged);
    setConversionError(null);
  };

  return {
    recipe,
    setRecipe: setRecipeWithConversion,
    isEditing,
    setIsEditing,
    showConversionSuccess,
    activeTab,
    setActiveTab,
    handleConversionComplete,
    handleSaveRecipe: handleSaveWithSwitch,
    handleSelectSavedRecipe: handleSelectWithClear,
    resetRecipe,
    conversionError,
    setConversionError
  };
};
