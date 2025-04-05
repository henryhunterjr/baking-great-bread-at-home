
import { Recipe, IStorageProvider } from '../types';
import { logError, logInfo } from '@/utils/logger';

export class CloudStorageProvider implements IStorageProvider {
  private apiUrl: string = '';
  private apiToken: string | null = null;

  constructor(apiUrl?: string, apiToken?: string) {
    if (apiUrl) this.apiUrl = apiUrl;
    if (apiToken) this.apiToken = apiToken;
  }

  async configure(apiUrl: string, apiToken: string): Promise<boolean> {
    try {
      this.apiUrl = apiUrl;
      this.apiToken = apiToken;
      return true;
    } catch (error) {
      logError('Error configuring cloud storage', { error });
      return false;
    }
  }

  async saveRecipe(recipe: Recipe): Promise<boolean> {
    try {
      if (!this.apiUrl || !this.apiToken) {
        throw new Error('Cloud storage not configured');
      }

      const response = await fetch(`${this.apiUrl}/recipes`, {
        method: recipe.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiToken}`
        },
        body: JSON.stringify(recipe)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      logInfo('Recipe saved to cloud storage', { id: recipe.id, title: recipe.title });
      return true;
    } catch (error) {
      logError('Error saving recipe to cloud storage', { error, recipeId: recipe.id });
      return false;
    }
  }

  async getAllRecipes(): Promise<Recipe[]> {
    try {
      if (!this.apiUrl || !this.apiToken) {
        throw new Error('Cloud storage not configured');
      }

      const response = await fetch(`${this.apiUrl}/recipes`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const recipes = await response.json();
      logInfo('Recipes fetched from cloud storage', { count: recipes.length });
      return recipes;
    } catch (error) {
      logError('Error getting recipes from cloud storage', { error });
      return [];
    }
  }

  async getRecipe(id: string): Promise<Recipe | null> {
    try {
      if (!this.apiUrl || !this.apiToken) {
        throw new Error('Cloud storage not configured');
      }

      const response = await fetch(`${this.apiUrl}/recipes/${id}`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`API error: ${response.status}`);
      }

      const recipe = await response.json();
      logInfo('Recipe fetched from cloud storage', { id });
      return recipe;
    } catch (error) {
      logError('Error getting recipe from cloud storage', { error, recipeId: id });
      return null;
    }
  }

  async deleteRecipe(id: string): Promise<boolean> {
    try {
      if (!this.apiUrl || !this.apiToken) {
        throw new Error('Cloud storage not configured');
      }

      const response = await fetch(`${this.apiUrl}/recipes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      logInfo('Recipe deleted from cloud storage', { id });
      return true;
    } catch (error) {
      logError('Error deleting recipe from cloud storage', { error, recipeId: id });
      return false;
    }
  }

  isConfigured(): boolean {
    return !!(this.apiUrl && this.apiToken);
  }
}

export const cloudStorageProvider = new CloudStorageProvider();
