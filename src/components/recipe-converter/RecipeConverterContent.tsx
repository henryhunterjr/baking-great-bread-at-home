
import React, { useEffect } from 'react';
import { RecipeData } from '@/types/recipeTypes';
import ConversionService from './ConversionService';
import RecipeForm from './RecipeForm';
import RecipeCard from './RecipeCard';
import ConversionSuccessAlert from './ConversionSuccessAlert';
import { useRecipeConversion } from '@/hooks/use-recipe-conversion';
import { FormProvider, useForm } from 'react-hook-form';
import { logInfo, logError } from '@/utils/logger';

interface RecipeConverterContentProps {
  recipe: RecipeData;
  isEditing: boolean;
  showConversionSuccess: boolean;
  onSetIsEditing: (isEditing: boolean) => void;
  onConversionComplete: (recipe: RecipeData) => void;
  onSaveRecipe: (recipe: RecipeData) => void;
  onResetRecipe: () => void;
  conversionError?: string | null;
}

const RecipeConverterContent: React.FC<RecipeConverterContentProps> = ({
  recipe,
  isEditing,
  showConversionSuccess,
  onSetIsEditing,
  onConversionComplete,
  onSaveRecipe,
  onResetRecipe,
  conversionError: pageConversionError
}) => {
  // Create a form context to wrap all components
  const methods = useForm();
  
  // Use the recipe conversion hook
  const { isConverting, conversionError, handleConversion } = useRecipeConversion(
    (convertedRecipe) => {
      // Immediately set edit mode to true for new conversions
      onConversionComplete(convertedRecipe);
      // Set to editing mode right after conversion
      onSetIsEditing(true);
    }
  );
  
  // Combine conversion errors from both sources
  const displayError = pageConversionError || conversionError;

  // Log the recipe state for debugging
  useEffect(() => {
    logInfo("Recipe state in RecipeConverterContent", {
      hasId: !!recipe.id,
      hasTitle: !!recipe.title,
      ingredientsCount: Array.isArray(recipe.ingredients) ? recipe.ingredients.length : 0,
      instructionsCount: Array.isArray(recipe.instructions) ? recipe.instructions.length : 0,
      isConverted: !!recipe.isConverted,
      isEditing
    });
  }, [recipe, isEditing]);
  
  // Determine if the recipe can be saved
  const canSaveRecipe = React.useMemo(() => {
    const hasRequiredFields = !!recipe.title && 
      Array.isArray(recipe.ingredients) && 
      recipe.ingredients.length > 0 && 
      Array.isArray(recipe.instructions) && 
      recipe.instructions.length > 0;
    
    logInfo("Save button state calculation", {
      canSave: hasRequiredFields,
      title: recipe.title,
      isConverted: recipe.isConverted,
      ingredientsLength: Array.isArray(recipe.ingredients) ? recipe.ingredients.length : 0,
      instructionsLength: Array.isArray(recipe.instructions) ? recipe.instructions.length : 0
    });
    
    return hasRequiredFields;
  }, [recipe]);
  
  const handleSaveRecipe = () => {
    logInfo("Attempting to save recipe from RecipeConverterContent", {
      hasRequiredFields: canSaveRecipe
    });
    
    if (canSaveRecipe) {
      onSaveRecipe(recipe);
    } else {
      logError("Save button clicked but recipe can't be saved", {
        hasTitle: !!recipe.title,
        hasIngredients: Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0,
        hasInstructions: Array.isArray(recipe.instructions) && recipe.instructions.length > 0
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <ConversionSuccessAlert show={showConversionSuccess && recipe.isConverted && !isEditing} />
      
      <FormProvider {...methods}>
        {!recipe.isConverted ? (
          <ConversionService 
            onConvertRecipe={handleConversion}
            isConverting={isConverting}
            conversionError={displayError}
            onReset={onResetRecipe}
            recipe={recipe}
            onSaveRecipe={canSaveRecipe ? handleSaveRecipe : undefined}
          />
        ) : isEditing ? (
          <RecipeForm 
            initialRecipe={recipe} 
            onSave={onSaveRecipe} 
            onCancel={() => onSetIsEditing(false)} 
          />
        ) : (
          <RecipeCard 
            recipe={recipe} 
            onEdit={() => onSetIsEditing(true)} 
            onPrint={() => window.print()} 
            onReset={onResetRecipe}
            onSave={canSaveRecipe ? handleSaveRecipe : undefined}
          />
        )}
      </FormProvider>
    </div>
  );
};

export default RecipeConverterContent;
