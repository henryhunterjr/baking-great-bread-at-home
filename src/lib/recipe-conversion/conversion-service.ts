
import { v4 as uuidv4 } from 'uuid';
import { logInfo } from '@/utils/logger';
import { StandardRecipe } from '@/types/standardRecipeFormat';
import { RecipeData, EquipmentItem } from '@/types/recipeTypes';

/**
 * Formats recipe data from AI output into the standard recipe format
 */
export const formatToStandardRecipe = (recipeData: RecipeData): StandardRecipe => {
  logInfo('Formatting recipe to standard format', { title: recipeData.title });
  
  // Parse ingredients into the required format
  const formattedIngredients = recipeData.ingredients.map(ingredient => {
    if (typeof ingredient === 'string') {
      const parts = ingredient.split(' ');
      const quantity = parts[0];
      let unit = '';
      let name = '';
      
      if (parts.length > 2) {
        unit = parts[1];
        name = parts.slice(2).join(' ');
      } else {
        name = parts.slice(1).join(' ');
      }
      
      return {
        quantity,
        unit,
        name
      };
    } else {
      // Already in object format
      return {
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        name: ingredient.name
      };
    }
  });
  
  // Create standard recipe format
  const standardRecipe: StandardRecipe = {
    title: recipeData.title,
    description: recipeData.introduction,
    ingredients: formattedIngredients,
    prepTime: parseInt(recipeData.prepTime || '0') || 0,
    cookTime: parseInt(recipeData.cookTime || '0') || 0,
    restTime: parseInt(recipeData.restTime || '0') || 0,
    totalTime: parseInt(recipeData.totalTime || '0') || 0,
    steps: recipeData.instructions,
    notes: recipeData.tips && recipeData.tips.length > 0 ? recipeData.tips.join('\n') : '',
    equipment: recipeData.equipmentNeeded ? recipeData.equipmentNeeded.map(item => ({
      name: item.name,
      required: true
    })) : [],
    imageUrl: recipeData.imageUrl,
    tags: recipeData.tags
  };
  
  return standardRecipe;
};

/**
 * Formats standard recipe format into the app's RecipeData format
 */
export const formatFromStandardRecipe = (standardRecipe: StandardRecipe): RecipeData => {
  logInfo('Formatting from standard recipe format', { title: standardRecipe.title });
  
  // Parse ingredients back into string format
  const formattedIngredients = standardRecipe.ingredients.map(ingredient => {
    if (typeof ingredient === 'string') return ingredient;
    
    return `${ingredient.quantity || ''} ${ingredient.unit || ''} ${ingredient.name}`.trim();
  });
  
  // Map equipment items
  const equipmentItems: EquipmentItem[] = [];
  if (standardRecipe.equipment) {
    standardRecipe.equipment.forEach(item => {
      if (typeof item === 'string') {
        equipmentItems.push({
          id: uuidv4(),
          name: item
        });
      } else {
        equipmentItems.push({
          id: uuidv4(),
          name: item.name
        });
      }
    });
  }
  
  // Create app recipe data format
  const recipeData: RecipeData = {
    title: standardRecipe.title,
    introduction: standardRecipe.description || '',
    ingredients: formattedIngredients,
    prepTime: (standardRecipe.prepTime || 0).toString(),
    restTime: (standardRecipe.restTime || 0).toString(),
    bakeTime: (standardRecipe.cookTime || 0).toString(),
    totalTime: (standardRecipe.totalTime || 0).toString(),
    instructions: standardRecipe.steps,
    tips: Array.isArray(standardRecipe.notes) 
      ? standardRecipe.notes 
      : standardRecipe.notes ? [standardRecipe.notes] : [],
    proTips: [],
    equipmentNeeded: equipmentItems,
    imageUrl: standardRecipe.imageUrl || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
    tags: standardRecipe.tags || [],
    isPublic: false,
    isConverted: true
  };
  
  return recipeData;
};

/**
 * Converts recipe text to structured recipe data
 * @param text The recipe text to convert
 * @param successCallback Function to call with the converted recipe
 * @param errorCallback Function to call if conversion fails
 */
export const convertRecipeText = async (
  text: string,
  successCallback: (recipe: RecipeData) => void,
  errorCallback: (error: Error) => void
) => {
  try {
    // This is a simplified implementation - in a real app, this would
    // process the text with NLP or AI to extract structured data
    
    // For now, create a basic recipe from the text
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    // Try to extract a title from the first line
    const title = lines[0] || 'Converted Recipe';
    
    // Assume ingredients are lines that start with numbers or bullet points
    const ingredients = lines
      .filter(line => /^[\d•\-*]/.test(line.trim()))
      .map(line => line.trim());
    
    // Assume instructions are the remaining lines
    const instructions = lines
      .filter(line => !/^[\d•\-*]/.test(line.trim()) && line !== title)
      .map(line => line.trim());
    
    // Create the recipe data
    const recipe: RecipeData = {
      title,
      introduction: 'Converted from text',
      ingredients,
      instructions,
      prepTime: '',
      cookTime: '',
      restTime: '',
      bakeTime: '',
      totalTime: '',
      tips: [],
      proTips: [],
      equipmentNeeded: [],
      tags: ['converted'],
      imageUrl: '',
      isPublic: false,
      isConverted: true
    };
    
    // Call the success callback with the recipe
    successCallback(recipe);
  } catch (error) {
    // Call the error callback with the error
    errorCallback(error instanceof Error ? error : new Error('Failed to convert recipe text'));
  }
};
