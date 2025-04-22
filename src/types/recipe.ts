
// Make sure RecipeData is exported from recipe.ts
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

// Export RecipeData interface that was missing
export interface RecipeData {
  id?: string;
  title: string;
  introduction?: string;
  ingredients: string[];
  prepTime?: string;
  restTime?: string;
  bakeTime?: string;
  cookTime?: string;
  totalTime?: string;
  instructions: string[];
  tips?: string[];
  proTips?: string[];
  equipmentNeeded?: EquipmentItem[];
  imageUrl?: string;
  tags?: string[];
  isPublic?: boolean;
  isConverted?: boolean;
  notes?: string[];
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
