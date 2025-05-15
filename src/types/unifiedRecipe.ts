
// Common recipe types to be used throughout the application

/**
 * Represents an ingredient with quantity, unit, and name
 */
export interface Ingredient {
  quantity: string;
  unit: string;
  name: string;
}

// Add RecipeIngredient type for compatibility
export interface RecipeIngredient {
  quantity: number | string;
  unit: string;
  name: string;
}

/**
 * Base recipe data structure
 */
export interface RecipeData {
  id?: string;
  title: string;
  description?: string;
  ingredients: Array<string | Ingredient | RecipeIngredient>;
  instructions: string[];
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  servings?: string | number;
  yields?: string;
  notes?: string[];
  tags?: string[];
  equipment?: string[];
  imageUrl?: string;
  source?: string;
  originalUrl?: string;
  isConverted?: boolean;
}

/**
 * Converted recipe with additional metadata
 */
export interface ConvertedRecipe extends RecipeData {
  name: string;
  title: string;
  ingredients: Ingredient[];
  instructions: string[];
}

/**
 * Recipe converter interface
 */
export interface IRecipeConverter {
  convert(recipeData: RecipeData, targetSystem: MeasurementSystem): Promise<ConversionResult>;
}

/**
 * Available measurement systems
 */
export enum MeasurementSystem {
  METRIC = 'metric',
  IMPERIAL = 'imperial'
}

/**
 * Recipe types
 */
export enum RecipeType {
  SOURDOUGH = 'sourdough',
  YEASTED = 'yeasted',
  QUICKBREAD = 'quickbread',
  PASTRY = 'pastry',
  ENRICHED = 'enriched',
  STANDARD = 'standard',
  OTHER = 'other'
}

/**
 * Conversion error types
 */
export enum ConversionErrorType {
  API_KEY_MISSING = 'api_key_missing',
  PARSING_ERROR = 'parsing_error',
  INVALID_INPUT = 'invalid_input',
  API_ERROR = 'api_error',
  VALIDATION_ERROR = 'validation_error',
  UNKNOWN = 'unknown',
  EMPTY_INPUT = 'empty_input',
  CONVERSION_ERROR = 'conversion_error'
}

/**
 * Result of a conversion operation
 */
export interface ConversionResult {
  success: boolean;
  data?: ConvertedRecipe;
  error?: {
    type: ConversionErrorType;
    message: string;
    details?: any;
  };
  aiSuggestions?: {
    tips: string[];
    improvements: string[];
    alternativeMethods?: string[];
  };
  original?: RecipeData; 
  converted?: RecipeData; 
  bakersPercentages?: Record<string, number>; 
  hydration?: number; 
  recipeType?: RecipeType; 
  timings?: Record<string, string>;
}
