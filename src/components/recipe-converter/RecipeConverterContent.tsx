
import React, { useEffect } from 'react';
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
  onSaveRecipe: (recipe?: RecipeData) => Promise<boolean>;
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
  const hasRecipeData = recipe && recipe.title && 
    Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && 
    Array.isArray(recipe.instructions) && recipe.instructions.length > 0;
    
  const isConverted = recipe.isConverted === true;
  
  // Log recipe data for debugging
  useEffect(() => {
    console.log("Recipe in RecipeConverterContent:", recipe, 
      "hasRecipeData:", hasRecipeData,
      "isConverted:", isConverted);
  }, [recipe, hasRecipeData, isConverted]);
  
  const handleSave = () => {
    // Ensure the recipe is marked as converted before saving
    const recipeToSave = {
      ...recipe,
      isConverted: true
    };
    onSaveRecipe(recipeToSave);
  };
  
  const handleFormCancel = () => {
    onSetIsEditing(false);
  };

  const handlePrint = () => {
    // Print function is now implemented within the RecipeCard component
    // We keep this method for compatibility but it's now a no-op
  };

  const handleConversion = (text: string) => {
    try {
      const parsedRecipe: RecipeData = { 
        ...recipe,
        title: recipe.title || "New Recipe",
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || [],
        isConverted: true // Ensure this is set to true
      };
      
      onConversionComplete(parsedRecipe);
    } catch (error) {
      console.error("Error handling conversion:", error);
    }
  };

  return (
    <div className="space-y-6">
      {showConversionSuccess && isConverted && !isEditing && (
        <ConversionSuccessAlert show={showConversionSuccess} />
      )}
      
      {conversionError && (
        <ErrorAlert error={conversionError} title="Recipe Conversion Error" />
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
          onConvertRecipe={handleConversion}
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
