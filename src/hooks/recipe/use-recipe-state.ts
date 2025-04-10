
import { useState, useCallback } from 'react';
import { RecipeData } from '@/types/recipeTypes';
import { logInfo, logError } from '@/utils/logger';

// Initial recipe state
const defaultRecipe: RecipeData = {
  title: '',
  introduction: '',
  ingredients: [],
  instructions: [],
  notes: [],
  tips: [],
  isConverted: false
};

export const useRecipeState = () => {
  // State for the current recipe
  const [recipe, setRecipe] = useState<RecipeData>(defaultRecipe);
  
  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  
  // Success notification state
  const [showConversionSuccess, setShowConversionSuccess] = useState(false);
  
  // Error state
  const [conversionError, setConversionError] = useState<string | null>(null);

  // Set recipe with guaranteed isConverted flag
  const setRecipeWithConversion = useCallback((newRecipe: RecipeData) => {
    // Always ensure isConverted is true for valid recipes
    const hasRequiredFields = 
      !!newRecipe.title && 
      Array.isArray(newRecipe.ingredients) && newRecipe.ingredients.length > 0 &&
      Array.isArray(newRecipe.instructions) && newRecipe.instructions.length > 0;
      
    const updatedRecipe = {
      ...newRecipe,
      isConverted: hasRequiredFields ? true : newRecipe.isConverted
    };
    
    setRecipe(updatedRecipe);
    return updatedRecipe;
  }, []);

  // Process a recipe after conversion or update
  const processRecipe = useCallback((updatedRecipe: RecipeData) => {
    try {
      // Ensure recipe always has required arrays with proper type checking
      const ingredients = Array.isArray(updatedRecipe.ingredients) 
        ? updatedRecipe.ingredients 
        : [];
      
      const instructions = Array.isArray(updatedRecipe.instructions) 
        ? updatedRecipe.instructions 
        : [];
      
      const notes = Array.isArray(updatedRecipe.notes) 
        ? updatedRecipe.notes 
        : [];
      
      const tips = Array.isArray(updatedRecipe.tips) 
        ? updatedRecipe.tips 
        : [];
      
      // Ensure all ingredients are strings (often AI returns objects instead)
      const normalizedIngredients = ingredients.map(item => {
        if (typeof item === 'string') {
          return item;
        } else if (typeof item === 'object' && item !== null) {
          // Handle case where ingredient is an object
          // Add type assertion to fix the TypeScript error
          const ingredientObj = item as { name?: string; quantity?: string | number; unit?: string };
          if (ingredientObj.name && ingredientObj.quantity && ingredientObj.unit) {
            // Format nicely if it has the expected structure
            const quantity = ingredientObj.quantity || '';
            const unit = ingredientObj.unit || '';
            const name = ingredientObj.name || '';
            return `${quantity} ${unit} ${name}`.trim();
          } else {
            // Just stringify the object
            return JSON.stringify(item);
          }
        } else {
          // Fallback for other types
          return String(item);
        }
      });
      
      // Create the processed recipe with all fields properly typed
      const processedRecipe: RecipeData = {
        ...updatedRecipe,
        title: updatedRecipe.title || 'Untitled Recipe',
        introduction: updatedRecipe.introduction || '',
        ingredients: normalizedIngredients,
        instructions: instructions,
        notes: notes,
        tips: tips,
        createdAt: updatedRecipe.createdAt || new Date().toISOString(),
        isConverted: true // Explicitly mark as converted
      };
      
      // Log processed recipe for debugging
      logInfo("Processing recipe:", {
        title: processedRecipe.title,
        ingredientsCount: processedRecipe.ingredients.length,
        isConverted: processedRecipe.isConverted === true
      });
      
      return processedRecipe;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error processing recipe';
      logError('Error in processRecipe:', { error });
      throw error;
    }
  }, []);

  // Reset recipe to default state
  const resetRecipe = useCallback(() => {
    setRecipe(defaultRecipe);
    setIsEditing(false);
    setShowConversionSuccess(false);
    setConversionError(null);
  }, []);

  return {
    recipe,
    setRecipe: setRecipeWithConversion,
    isEditing,
    setIsEditing,
    showConversionSuccess,
    setShowConversionSuccess,
    conversionError,
    setConversionError,
    processRecipe,
    resetRecipe
  };
};
