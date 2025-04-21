
import { ConvertedRecipe } from '@/types/Recipe';

export enum ConversionErrorType {
  PARSING_ERROR = 'PARSING_ERROR',
  API_ERROR = 'API_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN = 'UNKNOWN',
  EMPTY_INPUT = 'EMPTY_INPUT', // Added missing type
  CONVERSION_ERROR = 'CONVERSION_ERROR' // Added missing type
}

export interface ConversionError {
  type: ConversionErrorType;
  message: string;
  details?: any;
}

export interface ConversionResult {
  success: boolean;
  data?: ConvertedRecipe;
  error?: ConversionError;
  aiSuggestions?: AISuggestions;
  original?: RecipeData; // Added for base-converter.ts
  converted?: RecipeData; // Added for converter files
  bakersPercentages?: Record<string, number>; // Added for converter files
  hydration?: number; // Added for converter files
  recipeType?: RecipeType; // Added for converter files
  timings?: Record<string, string>; // Added for converter files
}

export interface AISuggestions {
  tips: string[];
  improvements: string[];
  alternativeMethods?: string[];
}

export type MeasurementSystem = 'metric' | 'imperial';
export type RecipeType = 'standard' | 'sourdough' | 'quickbread' | 'yeasted' | 'enriched';

export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface RecipeData {
  id?: string;
  title: string;
  description?: string;
  ingredients: (string | RecipeIngredient)[];
  instructions: string[];
  prepTime?: number;
  cookTime?: number;
  totalTime?: number;
  servings?: number;
  yield?: string;
  notes?: string[];
  tags?: string[];
  author?: string;
  url?: string;
  imageUrl?: string;
  isConverted?: boolean;
  recipeType?: RecipeType;
  name?: string; // Added for compatibility with ConvertedRecipe
}

// Add the IRecipeConverter interface that was missing
export interface IRecipeConverter {
  convert(recipeData: RecipeData, targetSystem: MeasurementSystem): Promise<ConversionResult>;
}
