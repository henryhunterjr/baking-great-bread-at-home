
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
  restTime?: string;
  bakeTime?: string;
  totalTime?: string;
  servings?: number | string;
  imageUrl?: string;
  tags?: string[];
  introduction?: string;
  isConverted?: boolean;
  createdAt?: number | string;
  updatedAt?: number | string;
  userId?: string;
  tips?: string[];
  proTips?: string[];
  equipmentNeeded?: Array<{
    id: string;
    name: string;
    affiliateLink?: string;
  }>;
  source?: string;
  cuisineType?: string;
  difficulty?: string;
  isPublic?: boolean;
  originalUrl?: string;
  equipment?: string[];
}

/**
 * Form values for recipe forms - extending RecipeData
 */
export type RecipeFormValues = RecipeData;

/**
 * Equipment item structure
 */
export interface EquipmentItem {
  id: string;
  name: string;
  affiliateLink?: string;
}
