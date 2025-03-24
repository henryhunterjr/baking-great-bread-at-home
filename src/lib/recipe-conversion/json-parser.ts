
import { logInfo, logError } from '@/utils/logger';
import { StandardRecipe } from '@/types/standardRecipeFormat';
import { RecipeData } from '@/types/recipeTypes';

/**
 * Attempt to parse a string as JSON into our standard recipe format
 */
export const parseRecipeJson = (text: string): StandardRecipe | null => {
  try {
    // Try to parse the text as JSON
    const parsedData = JSON.parse(text);
    
    // Check if it has the expected format (basic validation)
    if (parsedData && 
        typeof parsedData === 'object' && 
        'title' in parsedData && 
        'ingredients' in parsedData && 
        Array.isArray(parsedData.ingredients)) {
      
      logInfo("Successfully parsed recipe JSON", { 
        title: parsedData.title 
      });
      
      return parsedData as StandardRecipe;
    }
    
    return null;
  } catch (error) {
    // Not valid JSON, just return null (not an error case)
    return null;
  }
};

/**
 * Convert a standardized recipe format to our application's RecipeData format
 */
export const convertFromStandardFormat = (standardRecipe: StandardRecipe): RecipeData => {
  try {
    logInfo("Converting from standard recipe format", { 
      title: standardRecipe.title 
    });
    
    // Map ingredients to strings if they are objects
    const ingredients = standardRecipe.ingredients.map(ing => {
      if (typeof ing === 'string') {
        return ing;
      } else if (typeof ing === 'object' && ing !== null) {
        // Handle case where ingredients are objects with quantity, unit, name
        const quantity = 'quantity' in ing ? ing.quantity : '';
        const unit = 'unit' in ing ? ing.unit : '';
        const name = 'name' in ing ? ing.name : '';
        return `${quantity} ${unit} ${name}`.trim();
      }
      return '';
    });
    
    // Create recipe data with proper defaults for missing fields
    const convertedRecipe: RecipeData = {
      title: standardRecipe.title || 'Untitled Recipe',
      introduction: standardRecipe.description || '',
      ingredients: ingredients.filter(i => i.trim() !== ''),
      prepTime: standardRecipe.prepTime?.toString() || '',
      restTime: standardRecipe.restTime?.toString() || '',
      bakeTime: standardRecipe.cookTime?.toString() || '',
      totalTime: standardRecipe.totalTime?.toString() || 
        ((standardRecipe.prepTime || 0) + (standardRecipe.cookTime || 0)).toString(),
      instructions: Array.isArray(standardRecipe.steps) ? standardRecipe.steps : [],
      tips: standardRecipe.notes ? 
        (Array.isArray(standardRecipe.notes) ? standardRecipe.notes : [standardRecipe.notes]) : [],
      proTips: [],
      equipmentNeeded: standardRecipe.equipment || [],
      imageUrl: standardRecipe.imageUrl || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
      tags: standardRecipe.tags || [],
      isPublic: false,
      isConverted: true
    };
    
    return convertedRecipe;
  } catch (error) {
    logError("Error converting from standard format", { error });
    
    // Return a minimal valid recipe if conversion fails
    return {
      title: standardRecipe.title || 'Conversion Error',
      introduction: 'There was an error converting this recipe.',
      ingredients: [],
      prepTime: '',
      restTime: '',
      bakeTime: '',
      totalTime: '',
      instructions: [],
      tips: [],
      proTips: [],
      equipmentNeeded: [],
      imageUrl: '',
      tags: [],
      isPublic: false,
      isConverted: true
    };
  }
};
