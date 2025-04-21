
export interface ConvertedRecipe {
  name: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  servings?: string;
  notes?: string[];
}

export interface Ingredient {
  quantity: string;
  unit: string;
  name: string;
}

// Re-export from existing recipe.ts to maintain compatibility
export * from './recipe';
