
import { useState, useCallback } from 'react';
import { RecipeData } from '@/types/recipeTypes';

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

  // Process a recipe after conversion or update
  const processRecipe = useCallback((updatedRecipe: RecipeData) => {
    // Add timestamp if not present
    const processedRecipe = {
      ...updatedRecipe,
      createdAt: updatedRecipe.createdAt || new Date().toISOString()
    };
    
    // Set the recipe and enable editing
    setRecipe(processedRecipe);
    setIsEditing(true);
    
    // Show success message
    setShowConversionSuccess(true);
    
    // Clear any previous errors
    setConversionError(null);
    
    return processedRecipe;
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
    setRecipe,
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
