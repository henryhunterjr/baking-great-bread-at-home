
import React from 'react';
import { RecipeData } from '@/types/recipeTypes';
import ConversionService from './ConversionService';
import RecipeForm from './RecipeForm';
import RecipeCard from './RecipeCard';
import ConversionSuccessAlert from './ConversionSuccessAlert';

interface RecipeConverterContentProps {
  recipe: RecipeData;
  isEditing: boolean;
  showConversionSuccess: boolean;
  onSetIsEditing: (isEditing: boolean) => void;
  onConversionComplete: (recipe: RecipeData) => void;
  onSaveRecipe: (recipe: RecipeData) => void;
  onResetRecipe: () => void;
}

const RecipeConverterContent: React.FC<RecipeConverterContentProps> = ({
  recipe,
  isEditing,
  showConversionSuccess,
  onSetIsEditing,
  onConversionComplete,
  onSaveRecipe,
  onResetRecipe
}) => {
  return (
    <div className="space-y-4">
      <ConversionSuccessAlert show={showConversionSuccess && recipe.isConverted && !isEditing} />
      
      {!recipe.isConverted ? (
        <ConversionService onConversionComplete={onConversionComplete} />
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
        />
      )}
    </div>
  );
};

export default RecipeConverterContent;
