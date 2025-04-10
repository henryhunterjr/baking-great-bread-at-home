
import { RecipeData } from '@/types/recipeTypes';
import { logError, logInfo } from '@/utils/logger';
import { storageService } from '@/services/storage';

/**
 * Save a recipe to storage with improved error handling and backup mechanisms
 */
export const saveRecipeToStorage = async (recipe: RecipeData): Promise<boolean> => {
  try {
    // Ensure recipe has required fields and isConverted flag is set
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
      updatedAt: new Date().toISOString(),
      // Ensure isConverted flag is true
      isConverted: true
    };
    
    logInfo('Attempting to save recipe using storage service', { 
      id: recipeToSave.id,
      title: recipeToSave.title,
      isConverted: recipeToSave.isConverted
    });
    
    try {
      // Try primary storage method
      const result = await storageService.saveRecipe(recipeToSave as any);
      
      if (result) {
        logInfo('Recipe saved successfully through storage service', { 
          id: recipeToSave.id,
          title: recipeToSave.title
        });
        return true;
      } else {
        throw new Error('Storage service failed to save recipe');
      }
    } catch (primaryError) {
      logError('Primary storage method failed, trying backup', { error: primaryError });
      
      // Fallback to direct localStorage as backup
      try {
        saveToLocalStorageDirect(recipeToSave);
        logInfo('Recipe saved to localStorage backup', { id: recipeToSave.id });
        return true;
      } catch (backupError) {
        logError('Backup storage also failed', { error: backupError });
        return false;
      }
    }
  } catch (error) {
    logError('Error in recipe save process', { error });
    
    // Final attempt - save directly to localStorage
    try {
      if (recipe.id) {
        saveToLocalStorageDirect({...recipe, isConverted: true});
        return true;
      }
    } catch (finalError) {
      // At this point we've tried everything
      logError('All storage methods failed', { error: finalError });
    }
    
    return false;
  }
};

/**
 * Direct localStorage save as a backup mechanism
 */
const saveToLocalStorageDirect = (recipe: RecipeData): void => {
  if (typeof window === 'undefined') return;
  
  try {
    // Ensure recipe has minimal required structure and isConverted is set to true
    const recipeToSave = {
      ...recipe,
      id: recipe.id || crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
      createdAt: recipe.createdAt || new Date().toISOString(),
      isConverted: true
    };
    
    // Get existing recipes
    const existingRecipesJson = localStorage.getItem('bread_recipes_backup');
    const existingRecipes = existingRecipesJson ? JSON.parse(existingRecipesJson) : [];
    
    // Check if updating or adding
    const existingIndex = existingRecipes.findIndex((r: RecipeData) => r.id === recipeToSave.id);
    
    if (existingIndex >= 0) {
      // Update existing
      existingRecipes[existingIndex] = recipeToSave;
    } else {
      // Add new
      existingRecipes.push(recipeToSave);
    }
    
    // Save back to storage
    localStorage.setItem('bread_recipes_backup', JSON.stringify(existingRecipes));
    
    // Also save to the main storage key
    const mainRecipesJson = localStorage.getItem('bread_recipes');
    const mainRecipes = mainRecipesJson ? JSON.parse(mainRecipesJson) : [];
    
    const mainIndex = mainRecipes.findIndex((r: RecipeData) => r.id === recipeToSave.id);
    
    if (mainIndex >= 0) {
      mainRecipes[mainIndex] = recipeToSave;
    } else {
      mainRecipes.push(recipeToSave);
    }
    
    localStorage.setItem('bread_recipes', JSON.stringify(mainRecipes));
  } catch (error) {
    logError('Error in direct localStorage save', { error });
    throw error;
  }
};

/**
 * Get all saved recipes with improved error recovery
 */
export const getSavedRecipes = async (): Promise<RecipeData[]> => {
  try {
    // Primary method - use the storage service
    try {
      // Use the storage service to get all recipes
      const recipes = await storageService.getAllRecipes();
      
      // Validate the data structure is an array
      if (!Array.isArray(recipes)) {
        throw new Error('Saved recipes data is not an array');
      }
      
      // Filter out invalid recipes and ensure they have unique IDs
      const validRecipes = processAndFilterRecipes(recipes);
      
      logInfo('Retrieved saved recipes from storage service', { count: validRecipes.length });
      return validRecipes as RecipeData[];
    } catch (primaryError) {
      logError('Primary recipe retrieval failed, trying backup', { error: primaryError });
      
      // Try backup from localStorage
      const backupRecipes = getRecipesFromLocalStorageBackup();
      
      if (backupRecipes.length > 0) {
        logInfo('Retrieved recipes from localStorage backup', { count: backupRecipes.length });
        return backupRecipes;
      }
      
      // If backup also has no recipes, throw error to try final fallback
      throw new Error('No recipes found in backup storage');
    }
  } catch (error) {
    logError('Error retrieving saved recipes, using final fallback', { error });
    
    // Final fallback - try all possible localStorage keys
    try {
      const possibleKeys = [
        'bread_recipes',
        'saved_recipes',
        'recipes',
        'convertedRecipes'
      ];
      
      for (const key of possibleKeys) {
        try {
          const json = localStorage.getItem(key);
          if (json) {
            const data = JSON.parse(json);
            if (Array.isArray(data) && data.length > 0) {
              const recipes = processAndFilterRecipes(data);
              if (recipes.length > 0) {
                logInfo(`Found ${recipes.length} recipes in localStorage key: ${key}`);
                return recipes;
              }
            }
          }
        } catch (keyError) {
          continue; // Try next key
        }
      }
    } catch (fallbackError) {
      // Ignore fallback errors
    }
    
    // If all else fails, return empty array
    return [];
  }
};

/**
 * Process and filter recipes to ensure they're valid
 */
const processAndFilterRecipes = (recipes: any[]): RecipeData[] => {
  if (!Array.isArray(recipes)) return [];
  
  const seenIds = new Set();
  return recipes
    .filter(recipe => 
      recipe && 
      typeof recipe === 'object' && 
      recipe.title && 
      recipe.id &&
      (Array.isArray(recipe.ingredients) || typeof recipe.ingredients === 'string') &&
      (Array.isArray(recipe.instructions) || typeof recipe.instructions === 'string')
    )
    .map(recipe => ({
      ...recipe,
      // Ensure ingredients and instructions are always arrays
      ingredients: Array.isArray(recipe.ingredients) 
        ? recipe.ingredients 
        : typeof recipe.ingredients === 'string'
          ? [recipe.ingredients] 
          : ['Add ingredients'],
      instructions: Array.isArray(recipe.instructions) 
        ? recipe.instructions 
        : typeof recipe.instructions === 'string'
          ? [recipe.instructions]
          : ['Add instructions'],
      id: recipe.id || crypto.randomUUID(),
      isConverted: true // Always ensure this flag is set
    }))
    .filter(recipe => {
      // Ensure we don't have duplicate IDs
      if (seenIds.has(recipe.id)) {
        return false;
      }
      seenIds.add(recipe.id);
      return true;
    })
    .sort((a, b) => {
      // Sort by updatedAt if available, newest first
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });
};

/**
 * Get recipes from localStorage backup
 */
const getRecipesFromLocalStorageBackup = (): RecipeData[] => {
  try {
    const json = localStorage.getItem('bread_recipes_backup');
    if (!json) return [];
    
    const data = JSON.parse(json);
    return processAndFilterRecipes(data);
  } catch (error) {
    logError('Error retrieving from localStorage backup', { error });
    return [];
  }
};

/**
 * Delete a recipe from storage
 */
export const deleteRecipe = async (recipeId: string): Promise<boolean> => {
  try {
    // Try primary method
    const success = await storageService.deleteRecipe(recipeId);
    
    // Also delete from backup storage
    try {
      const backupRecipes = getRecipesFromLocalStorageBackup();
      const filtered = backupRecipes.filter(recipe => recipe.id !== recipeId);
      localStorage.setItem('bread_recipes_backup', JSON.stringify(filtered));
    } catch (backupError) {
      // Ignore backup errors
    }
    
    return success;
  } catch (error) {
    logError('Error deleting recipe', { error });
    
    // Try deleting from backup if primary fails
    try {
      const backupRecipes = getRecipesFromLocalStorageBackup();
      const filtered = backupRecipes.filter(recipe => recipe.id !== recipeId);
      localStorage.setItem('bread_recipes_backup', JSON.stringify(filtered));
      return true;
    } catch (backupError) {
      return false;
    }
  }
};

/**
 * Clear all saved recipes
 */
export const clearAllRecipes = async (): Promise<boolean> => {
  try {
    // First try primary storage service
    try {
      // Get all recipes
      const recipes = await storageService.getAllRecipes();
      
      // Delete each recipe
      for (const recipe of recipes) {
        await storageService.deleteRecipe(recipe.id);
      }
    } catch (primaryError) {
      logError('Error clearing primary storage', { error: primaryError });
    }
    
    // Also clear backup storage
    try {
      localStorage.removeItem('bread_recipes_backup');
      localStorage.removeItem('bread_recipes');
      localStorage.removeItem('saved_recipes');
    } catch (backupError) {
      // Ignore backup errors
    }
    
    return true;
  } catch (error) {
    logError('Error clearing recipes', { error });
    return false;
  }
};
