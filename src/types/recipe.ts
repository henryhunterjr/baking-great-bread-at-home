
export interface Recipe {
  id?: string;
  title: string;
  description: string;
  ingredients: {
    name: string;
    quantity: string;
    unit: string;
  }[];
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
