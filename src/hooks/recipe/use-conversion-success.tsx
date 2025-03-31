
import { useEffect } from 'react';
import { RecipeData } from '@/types/recipeTypes';

export const useConversionSuccess = (
  recipe: RecipeData,
  isEditing: boolean,
  setShowConversionSuccess: (show: boolean) => void
) => {
  // Show success alert for 7 seconds after conversion
  useEffect(() => {
    if (recipe.isConverted && !isEditing) {
      setShowConversionSuccess(true);
      const timer = setTimeout(() => {
        setShowConversionSuccess(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [recipe.isConverted, isEditing, setShowConversionSuccess]);
};
