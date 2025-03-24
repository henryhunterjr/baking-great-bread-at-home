
/**
 * Standard recipe format used for JSON recipe interchange
 */
export interface StandardRecipe {
  title: string;
  description?: string;
  ingredients: Array<string | { quantity?: string; unit?: string; name: string }>;
  prepTime?: number;
  cookTime?: number;
  restTime?: number;
  totalTime?: number;
  steps: string[];
  notes?: string | string[];
  equipment?: Array<string | EquipmentItem>;
  imageUrl?: string;
  tags?: string[];
}

export interface EquipmentItem {
  name: string;
  required?: boolean;
  alternative?: string;
}
