
// Common recipe types to be used throughout the application

/**
 * Represents an ingredient with quantity, unit, and name
 */
export interface Ingredient {
  quantity: string;
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
  ingredients: Array<string | Ingredient>;
  instructions: string[];
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  servings?: string;
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
  OTHER = 'other'
}

/**
 * Conversion error types
 */
export enum ConversionErrorType {
  API_KEY_MISSING = 'api_key_missing',
  INVALID_INPUT = 'invalid_input',
  PARSING_ERROR = 'parsing_error',
  API_ERROR = 'api_error',
  UNKNOWN = 'unknown'
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
  };
}
