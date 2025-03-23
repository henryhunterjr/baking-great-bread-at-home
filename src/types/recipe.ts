
export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface Recipe {
  id?: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  steps: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  tags: string[];
  notes: string;
  imageUrl: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
}
