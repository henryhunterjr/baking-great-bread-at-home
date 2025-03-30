
export interface Recipe {
  id: string;
  title: string;
  description?: string;
  ingredients?: string[];
  instructions?: string[];
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  servings?: number;
  calories?: number;
  difficulty?: string;
  cuisine?: string;
  mealType?: string;
  imageUrl?: string;
  author?: string;
  publishDate?: string;
  source?: string;
  link?: string;
  tags?: string[];
  notes?: string;
  isConverted?: boolean;
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
