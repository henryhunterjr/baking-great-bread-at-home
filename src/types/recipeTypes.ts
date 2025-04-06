
export interface RecipeData {
  id?: string;
  title: string;
  introduction?: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  restTime?: string;
  bakeTime?: string;
  servings?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  cuisineType?: string;
  tags?: string[];
  ingredients: string[];
  equipment?: string[];
  instructions: string[];
  notes?: string[];
  tips?: string[];
  proTips?: string[];
  imageUrl?: string;
  createdBy?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  source?: string;
  isPublic?: boolean;
  isConverted?: boolean;
  rating?: number;
  calories?: number;
  equipmentNeeded?: EquipmentItem[];
  originalUrl?: string;
  nutrition?: {
    protein?: string;
    carbs?: string;
    fat?: string;
    sugar?: string;
    fiber?: string;
  };
}

export interface EquipmentItem {
  id?: string;
  name: string;
  affiliateLink?: string;
}

export interface RecipeFormValues extends RecipeData {
  // Any additional fields specific to form handling
}

export interface RecipeGenerationResponse {
  success: boolean;
  recipe?: RecipeData;
  error?: string;
}
