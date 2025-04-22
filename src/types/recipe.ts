
export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  affiliateLink?: string;
}

export interface Recipe {
  title: string;
  description: string;
  servings: number;
  prepTime: number; // in minutes
  cookTime?: number; // in minutes
  ingredients: Ingredient[];
  steps: string[];
  tags: string[];
  notes?: string;
  imageUrl?: string;
  author?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isPublic?: boolean;
}

// Add the ConvertedRecipe interface that was missing in the lowercase file
export interface ConvertedRecipe {
  name: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  servings?: string;
  notes?: string[];
  title?: string; // Added for compatibility with RecipeData
}
