
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { RecipeData } from '@/types/recipeTypes';
import { logInfo } from '@/utils/logger';

// Default recipe data
export const defaultRecipe: RecipeData = {
  title: '',
  introduction: '',
  ingredients: [],
  prepTime: '',
  restTime: '',
  bakeTime: '',
  totalTime: '',
  instructions: [],
  tips: [],
  proTips: [],
  equipmentNeeded: [],
  imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
  tags: [],
  isPublic: false,
  isConverted: false
};

export const useRecipeState = () => {
  const [recipe, setRecipe] = useState<RecipeData>(defaultRecipe);
  const [isEditing, setIsEditing] = useState(false);
  const [showConversionSuccess, setShowConversionSuccess] = useState(false);
  const [conversionError, setConversionError] = useState<string | null>(null);

  // Add a helper function to check if a recipe is valid for saving
  const isRecipeValid = (recipeData: RecipeData): boolean => {
    const hasTitle = !!recipeData.title && recipeData.title.trim() !== '';
    const hasIngredients = Array.isArray(recipeData.ingredients) && recipeData.ingredients.length > 0;
    const hasInstructions = Array.isArray(recipeData.instructions) && recipeData.instructions.length > 0;
    
    logInfo("Recipe validation check", {
      hasTitle,
      hasIngredients: hasIngredients,
      ingredientsCount: Array.isArray(recipeData.ingredients) ? recipeData.ingredients.length : 0,
      hasInstructions: hasInstructions,
      instructionsCount: Array.isArray(recipeData.instructions) ? recipeData.instructions.length : 0
    });
    
    return hasTitle && hasIngredients && hasInstructions;
  };

  // Process incoming recipe to ensure it has all required fields
  const processRecipe = (incomingRecipe: RecipeData): RecipeData => {
    // Debug the incoming recipe
    logInfo("Processing incoming recipe", {
      hasId: !!incomingRecipe.id,
      hasTitle: !!incomingRecipe.title,
      ingredientsCount: Array.isArray(incomingRecipe.ingredients) ? incomingRecipe.ingredients.length : 0,
      instructionsCount: Array.isArray(incomingRecipe.instructions) ? incomingRecipe.instructions.length : 0,
      isConverted: !!incomingRecipe.isConverted
    });
    
    // Create a properly structured recipe with defaults where needed
    return {
      id: incomingRecipe.id || undefined, // Keep existing ID if available
      title: incomingRecipe.title || 'Untitled Recipe',
      introduction: incomingRecipe.introduction || '',
      // Ensure ingredients is always an array
      ingredients: Array.isArray(incomingRecipe.ingredients) && incomingRecipe.ingredients.length > 0 ? 
        incomingRecipe.ingredients : ['Add your ingredients here'],
      // Ensure instructions is always an array  
      instructions: Array.isArray(incomingRecipe.instructions) && incomingRecipe.instructions.length > 0 ? 
        incomingRecipe.instructions : ['Add your instructions here'],
      prepTime: incomingRecipe.prepTime || '',
      restTime: incomingRecipe.restTime || '',
      bakeTime: incomingRecipe.bakeTime || '',
      totalTime: incomingRecipe.totalTime || '',
      // Handle equipment items
      equipmentNeeded: Array.isArray(incomingRecipe.equipmentNeeded) ? 
        incomingRecipe.equipmentNeeded.map(item => ({
          id: item.id || uuidv4(),
          name: item.name || 'Equipment',
          affiliateLink: item.affiliateLink
        })) : [],
      tips: Array.isArray(incomingRecipe.tips) ? incomingRecipe.tips : [],
      proTips: Array.isArray(incomingRecipe.proTips) ? incomingRecipe.proTips : [],
      imageUrl: incomingRecipe.imageUrl || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
      tags: Array.isArray(incomingRecipe.tags) ? incomingRecipe.tags : [],
      isPublic: !!incomingRecipe.isPublic,
      isConverted: true // Always set to true when processed
    };
  };
  
  const resetRecipe = () => {
    setRecipe(defaultRecipe);
    setIsEditing(false);
    setConversionError(null);
  };

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
    resetRecipe,
    isRecipeValid
  };
};
