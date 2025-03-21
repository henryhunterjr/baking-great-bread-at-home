
export interface EquipmentItem {
  id: string;
  name: string;
}

export interface RecipeFormValues {
  title?: string;
  ingredients?: string[];
  instructions?: string[];
  tips?: string[];
  proTips?: string[];
  tags?: string[];
  introduction?: string;
  prepTime?: string;
  restTime?: string;
  bakeTime?: string;
  totalTime?: string;
  equipmentNeeded?: EquipmentItem[];
  imageUrl?: string;
  isPublic?: boolean;
  isConverted?: boolean;
}
