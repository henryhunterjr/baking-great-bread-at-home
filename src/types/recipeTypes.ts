
export interface EquipmentItem {
  id: string;
  name: string;
  affiliateLink?: string;
}

export interface RecipeFormValues {
  title: string;
  introduction?: string;
  ingredients: string[];
  prepTime?: string;
  restTime?: string;
  bakeTime?: string;
  totalTime?: string;
  instructions: string[];
  tips: string[];
  proTips: string[];
  equipmentNeeded: EquipmentItem[];
  imageUrl?: string;
  tags: string[];
  isPublic: boolean;
  isConverted: boolean;
}
