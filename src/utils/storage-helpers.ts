
import { RecipeData } from '@/types/recipeTypes';
import { logError, logInfo } from '@/utils/logger';
import { storageService } from '@/services/StorageService';

/**
 * Save a recipe to storage with error handling
 */
export const saveRecipeToStorage = async (recipe: RecipeData): Promise<boolean> => {
  try {
    // Ensure recipe has required fields
    if (!recipe.title || !recipe.ingredients || !recipe.instructions) {
      logError('Cannot save recipe: missing required fields', {
        hasTitle: !!recipe.title,
        hasIngredients: !!recipe.ingredients,
        hasInstructions: !!recipe.instructions
      });
      return false;
    }
    
    // Create a unique identifier for this recipe if it doesn't have one
    const recipeToSave = {
      ...recipe,
      id: recipe.id || crypto.randomUUID(),
      updatedAt: new Date().toISOString()
    };
    
    logInfo('Saving recipe using storage service', { 
      id: recipeToSave.id,
      title: recipeToSave.title
    });
    
    // Use the storage service to save the recipe
    const result = await storageService.saveRecipe(recipeToSave as any);
    
    if (result) {
      logInfo('Recipe saved successfully', { 
        id: recipeToSave.id,
        title: recipeToSave.title
      });
    } else {
      logError('Failed to save recipe via storage service', {
        id: recipeToSave.id
      });
    }
    
    return result;
  } catch (error) {
    logError('Error saving recipe', { error });
    return false;
  }
};

/**
 * Get all saved recipes from storage with error handling
 */
export const getSavedRecipes = async (): Promise<RecipeData[]> => {
  try {
    // Use the storage service to get all recipes
    const recipes = await storageService.getAllRecipes();
    
    // Validate the data structure is an array
    if (!Array.isArray(recipes)) {
      logError('Saved recipes data is not an array', { data: typeof recipes });
      return [];
    }
    
    // Filter out invalid recipes and ensure they have unique IDs
    const seenIds = new Set();
    const validRecipes = recipes
      .filter(recipe => 
        recipe && 
        typeof recipe === 'object' && 
        recipe.title && 
        recipe.id &&
        (Array.isArray(recipe.ingredients) || typeof recipe.ingredients === 'string') &&
        (Array.isArray(recipe.instructions) || typeof recipe.instructions === 'string')
      )
      .filter(recipe => {
        // Ensure we don't have duplicate IDs
        if (seenIds.has(recipe.id)) {
          return false;
        }
        seenIds.add(recipe.id);
        return true;
      });
    
    // Sort by updatedAt if available, newest first
    validRecipes.sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });
    
    logInfo('Retrieved saved recipes', { count: validRecipes.length });
    return validRecipes as RecipeData[];
  } catch (error) {
    logError('Error retrieving saved recipes', { error });
    return [];
  }
};

/**
 * Delete a recipe from storage
 */
export const deleteRecipe = async (recipeId: string): Promise<boolean> => {
  try {
    // Use the storage service to delete the recipe
    return await storageService.deleteRecipe(recipeId);
  } catch (error) {
    logError('Error deleting recipe', { error });
    return false;
  }
};

/**
 * Clear all saved recipes
 */
export const clearAllRecipes = async (): Promise<boolean> => {
  try {
    // Get all recipes
    const recipes = await storageService.getAllRecipes();
    
    // Delete each recipe
    for (const recipe of recipes) {
      await storageService.deleteRecipe(recipe.id);
    }
    
    return true;
  } catch (error) {
    logError('Error clearing recipes', { error });
    return false;
  }
};
