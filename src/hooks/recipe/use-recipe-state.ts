
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
    // Ensure recipe always has required arrays
    const processedRecipe: RecipeData = {
      ...updatedRecipe,
      ingredients: Array.isArray(updatedRecipe.ingredients) ? updatedRecipe.ingredients : [],
      instructions: Array.isArray(updatedRecipe.instructions) ? updatedRecipe.instructions : [],
      notes: Array.isArray(updatedRecipe.notes) ? updatedRecipe.notes : [],
      tips: Array.isArray(updatedRecipe.tips) ? updatedRecipe.tips : [],
      createdAt: updatedRecipe.createdAt || new Date().toISOString(),
      isConverted: true // Explicitly mark as converted
    };
    
    // Log processed recipe for debugging
    console.log("Processing recipe:", processedRecipe);
    
    // Set the recipe and enable editing
    setRecipe(processedRecipe);
    setIsEditing(false); // Changed to false to show the recipe card first
    
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
