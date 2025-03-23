
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
