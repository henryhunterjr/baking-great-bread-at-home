
import { logInfo, logError } from '@/utils/logger';
import { StandardRecipe, EquipmentItem } from '@/types/standardRecipeFormat';
import { RecipeData } from '@/types/recipeTypes';
import { v4 as uuidv4 } from 'uuid';

/**
 * Attempts to parse a string as JSON and validate it as a StandardRecipe
 * @returns The parsed StandardRecipe or null if invalid
 */
export const parseRecipeJson = (text: string): StandardRecipe | null => {
  try {
    // Attempt to parse the text as JSON
    const possibleRecipe = JSON.parse(text);
    
    // Basic validation to check if this is likely our recipe format
    if (possibleRecipe && 
        typeof possibleRecipe === 'object' && 
        possibleRecipe.title && 
        Array.isArray(possibleRecipe.ingredients) &&
        Array.isArray(possibleRecipe.steps)) {
      
      logInfo("Successfully parsed recipe JSON", { 
        title: possibleRecipe.title 
      });
      
      return possibleRecipe as StandardRecipe;
    }
    
    return null;
  } catch (error) {
    // Not valid JSON or not our format
    return null;
  }
};

/**
 * Converts from standard recipe format to app RecipeData format
 */
export const convertFromStandardFormat = (standardRecipe: StandardRecipe): RecipeData => {
  try {
    logInfo("Converting from standard recipe format", { 
      title: standardRecipe.title 
    });
    
    // Format ingredients as strings
    const ingredients = standardRecipe.ingredients.map(ingredient => {
      if (typeof ingredient === 'string') {
        return ingredient;
      }
      
      // Format structured ingredient
      return `${ingredient.quantity || ''} ${ingredient.unit || ''} ${ingredient.name}`.trim();
    });
    
    // Convert equipment items
    const equipmentNeeded = standardRecipe.equipment 
      ? standardRecipe.equipment.map(item => {
          if (typeof item === 'string') {
            return {
              id: uuidv4(),
              name: item
            };
          } else {
            return {
              id: uuidv4(),
              name: item.name,
              affiliateLink: ''
            };
          }
        }) 
      : [];
    
    // Map to RecipeData format
    const recipeData: RecipeData = {
      title: standardRecipe.title,
      introduction: standardRecipe.description || '',
      ingredients: ingredients,
      prepTime: standardRecipe.prepTime?.toString() || '',
      restTime: standardRecipe.restTime?.toString() || '',
      bakeTime: standardRecipe.cookTime?.toString() || '',
      totalTime: standardRecipe.totalTime?.toString() || '',
      instructions: standardRecipe.steps,
      tips: standardRecipe.notes ? 
        (Array.isArray(standardRecipe.notes) ? standardRecipe.notes : [standardRecipe.notes]) : [],
      proTips: [],
      equipmentNeeded: equipmentNeeded,
      imageUrl: standardRecipe.imageUrl || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
      tags: standardRecipe.tags || [],
      isPublic: false,
      isConverted: true
    };
    
    return recipeData;
  } catch (error) {
    logError("Error converting from standard format", { error });
    throw error;
  }
};
