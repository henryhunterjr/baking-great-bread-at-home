
import React, { useEffect } from 'react';
import RecipeForm from './RecipeForm';
import RecipeCard from './RecipeCard';
import { RecipeData } from '@/types/recipeTypes';
import ConversionService from './ConversionService';
import ConversionSuccessAlert from './ConversionSuccessAlert';
import ErrorAlert from '@/components/common/ErrorAlert';
import { useToast } from '@/hooks/use-toast';
import { logInfo } from '@/utils/logger';

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
  const { toast } = useToast();
  
  // Ensure recipe always has the required fields
  const hasRecipeData = recipe && recipe.title && 
    Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && 
    Array.isArray(recipe.instructions) && recipe.instructions.length > 0;
    
  // Force isConverted to be true whenever we're showing a recipe
  const isConverted = hasRecipeData ? true : recipe.isConverted === true;
  
  // Log recipe data for debugging - fixed to use proper object format
  useEffect(() => {
    logInfo("Recipe in RecipeConverterContent:", {
      recipe,
      hasRecipeData,
      isConverted
    });
  }, [recipe, hasRecipeData, isConverted]);
  
  const handleSave = async () => {
    // Ensure the recipe is marked as converted before saving
    const recipeToSave: RecipeData = {
      ...recipe,
      isConverted: true // Always force this to true when saving
    };
    
    // Log the save attempt
    logInfo("Attempting to save recipe:", {
      hasId: !!recipeToSave.id,
      title: recipeToSave.title,
      ingredientsCount: recipeToSave.ingredients.length,
      isConverted: recipeToSave.isConverted
    });
    
    try {
      const result = await onSaveRecipe(recipeToSave);
      if (result) {
        toast({
          title: "Recipe Saved",
          description: "Your recipe has been saved successfully.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Save Failed",
          description: "There was a problem saving your recipe. Please try again.",
        });
      }
      return result;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save Error",
        description: "There was a problem saving your recipe. Please try again.",
      });
      return false;
    }
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
      // Create a base recipe with required fields and ensure isConverted is true
      const parsedRecipe: RecipeData = { 
        ...recipe,
        title: recipe.title || "New Recipe",
        ingredients: Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 
          ? recipe.ingredients 
          : ["Add ingredients"],
        instructions: Array.isArray(recipe.instructions) && recipe.instructions.length > 0 
          ? recipe.instructions 
          : ["Add instructions"],
        isConverted: true // Explicitly set to true
      };
      
      logInfo("Handling conversion with recipe:", parsedRecipe);
      onConversionComplete(parsedRecipe);
    } catch (error) {
      console.error("Error handling conversion:", error);
      toast({
        variant: "destructive",
        title: "Conversion Error",
        description: "There was a problem converting your recipe. Please try again.",
      });
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
      
      {hasRecipeData ? (
        isEditing ? (
          <RecipeForm 
            initialRecipe={{...recipe, isConverted: true}} 
            onSave={updateRecipe} 
            onCancel={handleFormCancel} 
          />
        ) : (
          <RecipeCard 
            recipe={{...recipe, isConverted: true}}
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
