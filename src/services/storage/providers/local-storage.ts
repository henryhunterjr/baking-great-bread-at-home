
import { Recipe, IStorageProvider } from '../types';

export class LocalStorageProvider implements IStorageProvider {
  private readonly STORAGE_KEY = 'saved_recipes';

  async saveRecipe(recipeData: Recipe): Promise<boolean> {
    try {
      const existingRecipes = this.getRecipesFromStorage();
      
      const recipeIndex = existingRecipes.findIndex((r: Recipe) => r.id === recipeData.id);
      if (recipeIndex >= 0) {
        existingRecipes[recipeIndex] = recipeData;
      } else {
        existingRecipes.push(recipeData);
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingRecipes));
      return true;
    } catch (error) {
      console.error('Local storage save error:', error);
      return false;
    }
  }
  
  async getAllRecipes(): Promise<Recipe[]> {
    return this.getRecipesFromStorage();
  }
  
  async getRecipe(id: string): Promise<Recipe | null> {
    try {
      const recipes = this.getRecipesFromStorage();
      return recipes.find(recipe => recipe.id === id) || null;
    } catch (error) {
      console.error('Local recipe retrieval error:', error);
      return null;
    }
  }
  
  async deleteRecipe(id: string): Promise<boolean> {
    try {
      const recipes = this.getRecipesFromStorage();
      const filteredRecipes = recipes.filter((recipe: Recipe) => recipe.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredRecipes));
      return true;
    } catch (error) {
      console.error('Local recipe deletion error:', error);
      return false;
    }
  }

  clearStorage(): boolean {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Local storage clear error:', error);
      return false;
    }
  }
  
  private getRecipesFromStorage(): Recipe[] {
    try {
      const recipes = localStorage.getItem(this.STORAGE_KEY);
      return recipes ? JSON.parse(recipes) : [];
    } catch (error) {
      console.error('Local storage retrieval error:', error);
      return [];
    }
  }
}
