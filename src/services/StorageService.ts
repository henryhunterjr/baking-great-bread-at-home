
type StorageProvider = 'local' | 'firebase' | 'cloud';
type Recipe = {
  id: string;
  title: string;
  ingredients: any[];
  instructions: string[];
  notes: string[];
  [key: string]: any;
};

class StorageService {
  // Get current storage provider based on user settings
  private getProvider(): StorageProvider {
    return (localStorage.getItem('storage_provider') as StorageProvider) || 'local';
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
        for (const recipe of recipes) {
          await this.saveRecipe(recipe);
        }
        
        // Clear old storage if switching from local
        if (currentProvider === 'local') {
          localStorage.removeItem('saved_recipes');
        }
      }
      
      return true;
    } catch (error) {
      console.error('Provider switch error:', error);
      return false;
    }
  }
  
  // Save a recipe
  async saveRecipe(recipeData: Recipe): Promise<boolean> {
    const provider = this.getProvider();
    
    try {
      switch(provider) {
        case 'local':
          // Get existing recipes or create empty array
          const existingRecipes = JSON.parse(localStorage.getItem('saved_recipes') || '[]');
          
          // Update if exists, otherwise add new
          const recipeIndex = existingRecipes.findIndex((r: Recipe) => r.id === recipeData.id);
          if (recipeIndex >= 0) {
            existingRecipes[recipeIndex] = recipeData;
          } else {
            existingRecipes.push(recipeData);
          }
          
          localStorage.setItem('saved_recipes', JSON.stringify(existingRecipes));
          return true;
          
        case 'firebase':
          // Firebase implementation would go here
          console.log('Firebase storage not yet implemented');
          // Fallback to local
          return this.fallbackToLocal(recipeData);
          
        case 'cloud':
          // Cloud API implementation would go here
          console.log('Cloud storage not yet implemented');
          // Fallback to local
          return this.fallbackToLocal(recipeData);
          
        default:
          return this.fallbackToLocal(recipeData);
      }
    } catch (error) {
      console.error('Storage error:', error);
      return this.fallbackToLocal(recipeData);
    }
  }
  
  // Get all recipes
  async getAllRecipes(): Promise<Recipe[]> {
    const provider = this.getProvider();
    
    try {
      switch(provider) {
        case 'local':
          const recipes = localStorage.getItem('saved_recipes');
          return recipes ? JSON.parse(recipes) : [];
          
        case 'firebase':
          // Firebase implementation would go here
          console.log('Firebase retrieval not yet implemented');
          // Fallback to local
          return this.getLocalRecipes();
          
        case 'cloud':
          // Cloud API implementation would go here
          console.log('Cloud retrieval not yet implemented');
          // Fallback to local
          return this.getLocalRecipes();
          
        default:
          return this.getLocalRecipes();
      }
    } catch (error) {
      console.error('Retrieval error:', error);
      return this.getLocalRecipes();
    }
  }
  
  // Get a specific recipe
  async getRecipe(id: string): Promise<Recipe | null> {
    try {
      const allRecipes = await this.getAllRecipes();
      return allRecipes.find(recipe => recipe.id === id) || null;
    } catch (error) {
      console.error('Recipe retrieval error:', error);
      return null;
    }
  }
  
  // Delete a recipe
  async deleteRecipe(id: string): Promise<boolean> {
    const provider = this.getProvider();
    
    try {
      switch(provider) {
        case 'local':
          const recipes = JSON.parse(localStorage.getItem('saved_recipes') || '[]');
          const filteredRecipes = recipes.filter((recipe: Recipe) => recipe.id !== id);
          localStorage.setItem('saved_recipes', JSON.stringify(filteredRecipes));
          return true;
          
        case 'firebase':
          // Firebase implementation would go here
          console.log('Firebase deletion not yet implemented');
          return this.deleteLocalRecipe(id);
          
        case 'cloud':
          // Cloud API implementation would go here
          console.log('Cloud deletion not yet implemented');
          return this.deleteLocalRecipe(id);
          
        default:
          return this.deleteLocalRecipe(id);
      }
    } catch (error) {
      console.error('Deletion error:', error);
      return this.deleteLocalRecipe(id);
    }
  }
  
  // Helper methods
  private async fallbackToLocal(recipeData: Recipe): Promise<boolean> {
    try {
      const existingRecipes = JSON.parse(localStorage.getItem('saved_recipes') || '[]');
      const recipeIndex = existingRecipes.findIndex((r: Recipe) => r.id === recipeData.id);
      
      if (recipeIndex >= 0) {
        existingRecipes[recipeIndex] = recipeData;
      } else {
        existingRecipes.push(recipeData);
      }
      
      localStorage.setItem('saved_recipes', JSON.stringify(existingRecipes));
      return true;
    } catch (error) {
      console.error('Local storage fallback error:', error);
      return false;
    }
  }
  
  private getLocalRecipes(): Recipe[] {
    try {
      const recipes = localStorage.getItem('saved_recipes');
      return recipes ? JSON.parse(recipes) : [];
    } catch (error) {
      console.error('Local retrieval error:', error);
      return [];
    }
  }
  
  private async deleteLocalRecipe(id: string): Promise<boolean> {
    try {
      const recipes = JSON.parse(localStorage.getItem('saved_recipes') || '[]');
      const filteredRecipes = recipes.filter((recipe: Recipe) => recipe.id !== id);
      localStorage.setItem('saved_recipes', JSON.stringify(filteredRecipes));
      return true;
    } catch (error) {
      console.error('Local deletion error:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const storageService = new StorageService();
