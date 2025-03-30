
import React from 'react';
import { RecipeData } from '@/types/recipeTypes';
import ConversionService from './ConversionService';
import RecipeForm from './RecipeForm';
import RecipeCard from './RecipeCard';
import ConversionSuccessAlert from './ConversionSuccessAlert';
import { useRecipeConversion } from '@/hooks/use-recipe-conversion';
import { FormProvider, useForm } from 'react-hook-form';
import { logInfo } from '@/utils/logger';

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
  const { isConverting, conversionError, handleConversion } = useRecipeConversion(onConversionComplete);
  
  // Combine conversion errors from both sources
  const displayError = pageConversionError || conversionError;

  // Log the recipe state for debugging
  React.useEffect(() => {
    if (recipe) {
      // Log info about the recipe to debug why save might be disabled
      logInfo("Recipe state in RecipeConverterContent", {
        hasId: !!recipe.id,
        hasTitle: !!recipe.title,
        ingredientsCount: Array.isArray(recipe.ingredients) ? recipe.ingredients.length : 0,
        instructionsCount: Array.isArray(recipe.instructions) ? recipe.instructions.length : 0,
        isConverted: !!recipe.isConverted,
        isEditing
      });
    }
  }, [recipe, isEditing]);
  
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
            onSaveRecipe={() => onSaveRecipe(recipe)}
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
            onSave={() => onSaveRecipe(recipe)}
          />
        )}
      </FormProvider>
    </div>
  );
};

export default RecipeConverterContent;
