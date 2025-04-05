import React from 'react';
import RecipeUploader from './RecipeUploader';
import RecipeForm from './RecipeForm';
import RecipeCard from './RecipeCard';
import { RecipeData } from '@/types/recipeTypes';
import ConversionService from './ConversionService';
import ConversionSuccessAlert from './ConversionSuccessAlert';
import ErrorAlert from '@/components/common/ErrorAlert';

interface RecipeConverterContentProps {
  recipe: RecipeData;
  isEditing: boolean;
  showConversionSuccess: boolean;
  onSetIsEditing: (isEditing: boolean) => void;
  onConversionComplete: (recipe: RecipeData) => void;
  onSaveRecipe: (recipe?: RecipeData) => boolean;
  onResetRecipe: () => void;
  updateRecipe: (recipe: RecipeData) => void;
  conversionError: string | null;
}

const RecipeConverterContent: React.FC<RecipeConverterContentProps> = ({
  recipe,
  isEditing,
  showConversionSuccess,
  onSetIsEditing,
  onConversionComplete,
  onSaveRecipe,
  onResetRecipe,
  updateRecipe,
  conversionError
}) => {
  const hasRecipeData = recipe && recipe.title && recipe.ingredients && recipe.instructions;
  const isConverted = recipe.isConverted === true;
  
  const handleSave = () => {
    onSaveRecipe(recipe);
  };
  
  const handleFormCancel = () => {
    onSetIsEditing(false);
  };

  const handlePrint = () => {
    // Print function is now implemented within the RecipeCard component
    // We keep this method for compatibility but it's now a no-op
  };

  return (
    <div className="space-y-6">
      {showConversionSuccess && isConverted && !isEditing && (
        <ConversionSuccessAlert />
      )}
      
      {conversionError && (
        <ErrorAlert title="Recipe Conversion Error" message={conversionError} />
      )}
      
      {hasRecipeData && isConverted ? (
        isEditing ? (
          <RecipeForm 
            initialRecipe={recipe} 
            onSave={updateRecipe} 
            onCancel={handleFormCancel} 
          />
        ) : (
          <RecipeCard 
            recipe={recipe}
            onEdit={() => onSetIsEditing(true)}
            onPrint={handlePrint}
            onReset={onResetRecipe}
            onSave={handleSave}
            onUpdateRecipe={updateRecipe}
          />
        )
      ) : (
        <ConversionService 
          onConvertRecipe={onConversionComplete}
          isConverting={false}
          conversionError={conversionError}
          onReset={onResetRecipe}
          recipe={hasRecipeData ? recipe : undefined}
          onSaveRecipe={hasRecipeData ? handleSave : undefined}
        />
      )}
    </div>
  );
};

export default RecipeConverterContent;
