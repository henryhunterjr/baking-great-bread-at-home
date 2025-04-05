
export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface BakersPercentages {
  percentages: Array<{ name: string; percentage: number }>;
  hydration: number;
  totalFlourWeight: number;
}

export interface BakersCalculatorProps {
  // Add any props if needed
}

export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface RecipeFormProps {
  onCalculate: (ingredients: Ingredient[]) => void;
}
