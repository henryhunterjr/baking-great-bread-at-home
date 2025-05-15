
import { useEffect } from 'react';
import { RecipeData } from '@/types/unifiedRecipe';

export const useConversionSuccess = (
  recipe: RecipeData | null,
  isEditing: boolean,
  setShowConversionSuccess: (show: boolean) => void
) => {
  // Show success message when recipe is converted but not yet being edited
  useEffect(() => {
    if (recipe?.isConverted && !isEditing) {
      setShowConversionSuccess(true);
    } else {
      setShowConversionSuccess(false);
    }
  }, [recipe?.isConverted, isEditing, setShowConversionSuccess]);
};
