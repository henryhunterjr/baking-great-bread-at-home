
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

  // Process incoming recipe to ensure it has all required fields
  const processRecipe = (incomingRecipe: RecipeData): RecipeData => {
    return {
      ...incomingRecipe,
      // Ensure recipe has a title
      title: incomingRecipe.title || 'Untitled Recipe',
      // Ensure recipe has ingredients
      ingredients: incomingRecipe.ingredients?.length ? 
        incomingRecipe.ingredients : ['Add your ingredients here'],
      // Ensure recipe has instructions
      instructions: incomingRecipe.instructions?.length ? 
        incomingRecipe.instructions : ['Add your instructions here'],
      // Ensure each equipment item has an ID
      equipmentNeeded: incomingRecipe.equipmentNeeded?.map(item => ({
        id: item.id || uuidv4(),
        name: item.name || 'Equipment',
        affiliateLink: item.affiliateLink
      })) || [],
      // Ensure isConverted flag is set
      isConverted: true
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
    resetRecipe
  };
};
