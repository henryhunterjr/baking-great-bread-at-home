
export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface RecipeData {
  title: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  notes?: string[];
}

export type RecipeType = 'sourdough' | 'yeasted' | 'enriched' | 'quickbread' | 'standard';

export type MeasurementSystem = 'metric' | 'imperial';

export interface ConversionResult {
  original: RecipeData;
  converted: RecipeData;
  bakersPercentages?: Record<string, number>;
  hydration?: number;
  recipeType: RecipeType;
  timings?: Record<string, string>;
}

export interface IRecipeConverter {
  convert(recipeData: RecipeData, targetSystem: MeasurementSystem): Promise<ConversionResult>;
}

export interface UnitConversion {
  from: string;
  to: string;
  factor: number;
}
