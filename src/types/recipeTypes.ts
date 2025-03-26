
export interface RecipeData {
  id?: string;
  title: string;
  introduction?: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  servings?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  cuisineType?: string;
  tags?: string[];
  ingredients: string[];
  equipment?: string[];
  instructions: string[];
  notes?: string[];
  tips?: string[];
  imageUrl?: string;
  createdBy?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  source?: string;
  isPublic?: boolean;
  rating?: number;
  calories?: number;
  nutrition?: {
    protein?: string;
    carbs?: string;
    fat?: string;
    sugar?: string;
    fiber?: string;
  };
}

export interface RecipeGenerationResponse {
  success: boolean;
  recipe?: RecipeData;
  error?: string;
}
