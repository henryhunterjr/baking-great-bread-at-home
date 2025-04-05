
import { Recipe, StorageProvider } from './types';
import { logInfo, logError } from '@/utils/logger';
import { cloudStorageProvider } from './providers/cloud-storage';

class StorageService {
  private static instance: StorageService;
  
  private constructor() {}
  
  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }
  
  // Get current storage provider
  public getProvider(): StorageProvider {
    return (localStorage.getItem('storage_provider') as StorageProvider) || 'local';
  }
  
  // Set storage provider
  public async setProvider(provider: StorageProvider): Promise<boolean> {
    try {
      // Get all recipes from current provider
      const recipes = await this.getAllRecipes();
      
      // Set new provider
      localStorage.setItem('storage_provider', provider);
      
      // Log the change
      logInfo('Storage provider changed', { from: this.getProvider(), to: provider });
      
      // Migrate recipes to new provider
      for (const recipe of recipes) {
        await this.saveRecipe(recipe);
      }
      
      return true;
    } catch (error) {
      logError('Error switching storage provider:', { error });
      return false;
    }
  }
  
  // Save a recipe
  public async saveRecipe(recipe: Recipe): Promise<boolean> {
    const provider = this.getProvider();
    
    try {
      // Make sure recipe has the required fields
      const normalizedRecipe = this.normalizeRecipe(recipe);

      switch (provider) {
        case 'cloud':
          if (cloudStorageProvider.isConfigured()) {
            return await cloudStorageProvider.saveRecipe(normalizedRecipe);
          }
          // Fall through if cloud is not configured
          
        case 'firebase':
          // Firebase implementation would go here
          // Fall through for now
          
        case 'local':
        default:
          return await this.saveLocal(normalizedRecipe);
      }
    } catch (error) {
      logError('Error saving recipe:', { error, provider });
      return this.saveLocal(recipe); // Fallback to local
    }
  }
  
  // Get all recipes
  public async getAllRecipes(): Promise<Recipe[]> {
    const provider = this.getProvider();
    
    try {
      switch (provider) {
        case 'cloud':
          if (cloudStorageProvider.isConfigured()) {
            return await cloudStorageProvider.getAllRecipes();
          }
          // Fall through if cloud is not configured
          
        case 'firebase':
          // Firebase implementation would go here
          // Fall through for now
          
        case 'local':
        default:
          return await this.getLocalRecipes();
      }
    } catch (error) {
      logError('Error getting recipes:', { error, provider });
      return this.getLocalRecipes(); // Fallback to local
    }
  }
  
  // Get a recipe by ID
  public async getRecipe(id: string): Promise<Recipe | null> {
    try {
      const recipes = await this.getAllRecipes();
      return recipes.find(recipe => recipe.id === id) || null;
    } catch (error) {
      logError('Error getting recipe by ID:', { error, recipeId: id });
      return null;
    }
  }
  
  // Delete a recipe
  public async deleteRecipe(id: string): Promise<boolean> {
    const provider = this.getProvider();
    
    try {
      switch (provider) {
        case 'cloud':
          if (cloudStorageProvider.isConfigured()) {
            return await cloudStorageProvider.deleteRecipe(id);
          }
          // Fall through if cloud is not configured
          
        case 'firebase':
          // Firebase implementation would go here
          // Fall through for now
          
        case 'local':
        default:
          return await this.deleteLocal(id);
      }
    } catch (error) {
      logError('Error deleting recipe:', { error, recipeId: id, provider });
      return false;
    }
  }

  // Configure cloud provider
  public async configureCloudProvider(apiUrl: string, apiToken: string): Promise<boolean> {
    return cloudStorageProvider.configure(apiUrl, apiToken);
  }
  
  // Local storage implementations
  private async saveLocal(recipe: Recipe): Promise<boolean> {
    try {
      const recipes = await this.getLocalRecipes();
      const index = recipes.findIndex(r => r.id === recipe.id);
      
      if (index >= 0) {
        recipes[index] = { 
          ...recipe, 
          updatedAt: new Date().toISOString() 
        };
      } else {
        recipes.push({ 
          ...recipe, 
          id: recipe.id || crypto.randomUUID(),
          createdAt: recipe.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      
      localStorage.setItem('bread_recipes', JSON.stringify(recipes));
      return true;
    } catch (error) {
      logError('Error saving to local storage:', { error });
      return false;
    }
  }
  
  private async getLocalRecipes(): Promise<Recipe[]> {
    try {
      const recipesJson = localStorage.getItem('bread_recipes');
      return recipesJson ? JSON.parse(recipesJson) : [];
    } catch (error) {
      logError('Error getting from local storage:', { error });
      return [];
    }
  }
  
  private async deleteLocal(id: string): Promise<boolean> {
    try {
      const recipes = await this.getLocalRecipes();
      const filteredRecipes = recipes.filter(recipe => recipe.id !== id);
      localStorage.setItem('bread_recipes', JSON.stringify(filteredRecipes));
      return true;
    } catch (error) {
      logError('Error deleting from local storage:', { error });
      return false;
    }
  }

  private normalizeRecipe(recipe: Recipe): Recipe {
    return {
      ...recipe,
      id: recipe.id || crypto.randomUUID(),
      createdAt: recipe.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}

export const storageService = StorageService.getInstance();

// Re-export types for convenience
export type { Recipe, StorageProvider } from './types';
