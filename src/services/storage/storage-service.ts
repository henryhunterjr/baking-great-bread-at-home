
import { StorageProvider, Recipe, IStorageProvider } from './types';
import { LocalStorageProvider } from './providers/local-storage';
import { FirebaseStorageProvider } from './providers/firebase-storage';
import { CloudStorageProvider } from './providers/cloud-storage';

class StorageService {
  private providers: Record<StorageProvider, IStorageProvider> = {
    local: new LocalStorageProvider(),
    firebase: new FirebaseStorageProvider(),
    cloud: new CloudStorageProvider()
  };
  
  // Get current storage provider based on user settings
  private getProvider(): StorageProvider {
    return (localStorage.getItem('storage_provider') as StorageProvider) || 'local';
  }
  
  // Get provider instance
  private getProviderInstance(): IStorageProvider {
    const providerType = this.getProvider();
    return this.providers[providerType];
  }
  
  // Switch storage provider
  async switchProvider(newProvider: StorageProvider): Promise<boolean> {
    try {
      const currentProvider = this.getProvider();
      if (currentProvider === newProvider) return true;
      
      // Get all recipes from current provider
      const recipes = await this.getAllRecipes();
      
      // Store preference
      localStorage.setItem('storage_provider', newProvider);
      
      // Migrate data if needed
      if (recipes.length > 0) {
        const newProviderInstance = this.providers[newProvider];
        
        for (const recipe of recipes) {
          await newProviderInstance.saveRecipe(recipe);
        }
        
        // Clear old storage if switching from local
        if (currentProvider === 'local' && newProvider !== 'local') {
          (this.providers.local as LocalStorageProvider).clearStorage();
        }
      }
      
      return true;
    } catch (error) {
      console.error('Provider switch error:', error);
      return false;
    }
  }
  
  // Save a recipe using current provider
  async saveRecipe(recipeData: Recipe): Promise<boolean> {
    try {
      return await this.getProviderInstance().saveRecipe(recipeData);
    } catch (error) {
      console.error('Save recipe error:', error);
      return this.providers.local.saveRecipe(recipeData);
    }
  }
  
  // Get all recipes from current provider
  async getAllRecipes(): Promise<Recipe[]> {
    try {
      return await this.getProviderInstance().getAllRecipes();
    } catch (error) {
      console.error('Get all recipes error:', error);
      return this.providers.local.getAllRecipes();
    }
  }
  
  // Get a specific recipe from current provider
  async getRecipe(id: string): Promise<Recipe | null> {
    try {
      return await this.getProviderInstance().getRecipe(id);
    } catch (error) {
      console.error('Get recipe error:', error);
      return this.providers.local.getRecipe(id);
    }
  }
  
  // Delete a recipe using current provider
  async deleteRecipe(id: string): Promise<boolean> {
    try {
      return await this.getProviderInstance().deleteRecipe(id);
    } catch (error) {
      console.error('Delete recipe error:', error);
      return this.providers.local.deleteRecipe(id);
    }
  }
}

// Export a singleton instance
export const storageService = new StorageService();
