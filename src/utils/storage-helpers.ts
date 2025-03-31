import { RecipeData } from '@/types/recipeTypes';
import { logError, logInfo } from '@/utils/logger';

/**
 * Save a recipe to localStorage with error handling
 */
export const saveRecipeToStorage = (recipe: RecipeData): boolean => {
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
    
    // Get existing recipes
    const savedRecipes = getSavedRecipes();
    
    // Create a unique identifier for this recipe if it doesn't have one
    const recipeToSave = {
      ...recipe,
      id: recipe.id || crypto.randomUUID(),
      updatedAt: new Date().toISOString()
    };
    
    // Check if this recipe already exists by ID
    const existingIndex = savedRecipes.findIndex(r => r.id === recipeToSave.id);
    
    // Create new array of recipes
    let updatedRecipes;
    
    if (existingIndex >= 0) {
      // Update existing recipe
      updatedRecipes = [...savedRecipes];
      updatedRecipes[existingIndex] = recipeToSave;
      logInfo('Updating existing recipe', { id: recipeToSave.id, title: recipeToSave.title });
    } else {
      // Check for duplicate titles to avoid confusion
      const duplicateTitleIndex = savedRecipes.findIndex(
        r => r.title.toLowerCase() === recipeToSave.title.toLowerCase() && r.id !== recipeToSave.id
      );
      
      if (duplicateTitleIndex >= 0) {
        // Append a number to make the title unique
        recipeToSave.title = `${recipeToSave.title} (${new Date().toLocaleTimeString()})`;
      }
      
      // Add new recipe
      updatedRecipes = [...savedRecipes, recipeToSave];
      logInfo('Adding new recipe', { id: recipeToSave.id, title: recipeToSave.title });
    }
    
    // Save back to localStorage with error handling
    try {
      localStorage.setItem('savedRecipes', JSON.stringify(updatedRecipes));
      
      // Verify the save worked by reading it back
      const savedData = localStorage.getItem('savedRecipes');
      if (!savedData) {
        throw new Error('Verification failed: saved data not found');
      }
      
      logInfo('Recipe saved successfully', { 
        id: recipeToSave.id,
        title: recipeToSave.title,
        recipeCount: updatedRecipes.length
      });
      
      return true;
    } catch (storageError) {
      // Handle storage errors (quota exceeded, etc.)
      logError('localStorage error', { error: storageError });
      
      // If storage is full, try to remove old recipes
      if (updatedRecipes.length > 10) {
        try {
          // Keep only the 5 most recent recipes
          const recentRecipes = updatedRecipes.slice(-5);
          localStorage.setItem('savedRecipes', JSON.stringify(recentRecipes));
          logInfo('Cleaned up storage by removing old recipes', { 
            removed: updatedRecipes.length - recentRecipes.length,
            remaining: recentRecipes.length
          });
          
          // Try to save the current recipe again
          recentRecipes.push(recipeToSave);
          localStorage.setItem('savedRecipes', JSON.stringify(recentRecipes));
          return true;
        } catch (retryError) {
          logError('Failed to save recipe after cleanup', { error: retryError });
          return false;
        }
      }
      
      return false;
    }
  } catch (error) {
    logError('Error saving recipe', { error });
    return false;
  }
};

/**
 * Get all saved recipes from localStorage with error handling
 */
export const getSavedRecipes = (): RecipeData[] => {
  try {
    const savedRecipesJson = localStorage.getItem('savedRecipes');
    if (!savedRecipesJson) return [];
    
    const savedRecipes = JSON.parse(savedRecipesJson);
    
    // Validate the data structure is an array
    if (!Array.isArray(savedRecipes)) {
      logError('Saved recipes data is not an array', { data: typeof savedRecipes });
      return [];
    }
    
    // Filter out invalid recipes and ensure they have unique IDs
    const seenIds = new Set();
    const validRecipes = savedRecipes
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
    return validRecipes;
  } catch (error) {
    logError('Error retrieving saved recipes', { error });
    return [];
  }
};

/**
 * Delete a recipe from localStorage
 */
export const deleteRecipe = (recipeId: string): boolean => {
  try {
    const savedRecipes = getSavedRecipes();
    const filteredRecipes = savedRecipes.filter(recipe => recipe.id !== recipeId);
    
    if (filteredRecipes.length === savedRecipes.length) {
      // Recipe not found
      return false;
    }
    
    localStorage.setItem('savedRecipes', JSON.stringify(filteredRecipes));
    return true;
  } catch (error) {
    logError('Error deleting recipe', { error });
    return false;
  }
};

/**
 * Clear all saved recipes
 */
export const clearAllRecipes = (): boolean => {
  try {
    localStorage.removeItem('savedRecipes');
    return true;
  } catch (error) {
    logError('Error clearing recipes', { error });
    return false;
  }
};
