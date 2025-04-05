
export type StorageProvider = 'local' | 'firebase' | 'cloud';

export interface Recipe {
  id: string;
  title: string;
  ingredients: any[];
  instructions: string[];
  notes: string[];
  [key: string]: any;
}

export interface IStorageProvider {
  saveRecipe(recipeData: Recipe): Promise<boolean>;
  getAllRecipes(): Promise<Recipe[]>;
  getRecipe(id: string): Promise<Recipe | null>;
  deleteRecipe(id: string): Promise<boolean>;
}
