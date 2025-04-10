
/**
 * Recipe data structure used throughout the application
 */
export interface RecipeData {
  id?: string;
  title: string;
  ingredients: Array<string | { quantity: string; unit: string; name: string }>;
  instructions: string[];
  notes?: string[] | string;
  prepTime?: string;
  cookTime?: string;
  servings?: number;
  imageUrl?: string;
  tags?: string[];
  introduction?: string;
  isConverted?: boolean;
  createdAt?: number;
  updatedAt?: number;
  userId?: string;
}
