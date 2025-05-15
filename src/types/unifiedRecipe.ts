
/**
 * Unified Recipe Types for the Recipe Converter
 * 
 * This file serves as the single source of truth for recipe-related types
 * throughout the application.
 */

// Basic ingredient interface
export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

// Equipment item structure
export interface EquipmentItem {
  id: string;
  name: string;
  affiliateLink?: string;
}

/**
 * ConvertedRecipe interface for standardized recipe structure
 * from AI conversion processes
 */
export interface ConvertedRecipe {
  name: string;
  title?: string;  // For compatibility with RecipeData
  ingredients: Ingredient[];
  instructions: string[];
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  servings?: string | number;
  notes?: string[] | string;
}

/**
 * Comprehensive RecipeData interface used throughout the application
 * Extends the base concepts of ConvertedRecipe with additional app-specific fields
 */
export interface RecipeData {
  id?: string;
  title: string;
  ingredients: Array<string | { quantity: string; unit: string; name: string }>;
  instructions: string[];
  notes?: string[] | string;
  prepTime?: string;
  cookTime?: string;
  restTime?: string;
  bakeTime?: string;
  totalTime?: string;
  servings?: number | string;
  imageUrl?: string;
  tags?: string[];
  introduction?: string;
  isConverted?: boolean;
  createdAt?: number | string;
  updatedAt?: number | string;
  userId?: string;
  tips?: string[];
  proTips?: string[];
  equipmentNeeded?: EquipmentItem[];
  source?: string;
  cuisineType?: string;
  difficulty?: string;
  isPublic?: boolean;
  originalUrl?: string;
  equipment?: string[];
  name?: string; // For compatibility with ConvertedRecipe
}

/**
 * Form values for recipe forms - extending RecipeData
 */
export type RecipeFormValues = RecipeData;

// Measurement systems for conversion
export type MeasurementSystem = 'metric' | 'imperial';

// Recipe types for specialized conversion logic
export type RecipeType = 'standard' | 'sourdough' | 'quickbread' | 'yeasted' | 'enriched';

/**
 * Recipe ingredient format used in conversion services
 */
export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
}

/**
 * Conversion error types
 */
export enum ConversionErrorType {
  PARSING_ERROR = 'PARSING_ERROR',
  API_ERROR = 'API_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN = 'UNKNOWN',
  EMPTY_INPUT = 'EMPTY_INPUT', 
  CONVERSION_ERROR = 'CONVERSION_ERROR' 
}

export interface ConversionError {
  type: ConversionErrorType;
  message: string;
  details?: any;
}

export interface AISuggestions {
  tips: string[];
  improvements: string[];
  alternativeMethods?: string[];
}

/**
 * Conversion result interface
 */
export interface ConversionResult {
  success: boolean;
  data?: ConvertedRecipe;
  error?: ConversionError;
  aiSuggestions?: AISuggestions;
  original?: RecipeData; 
  converted?: RecipeData; 
  bakersPercentages?: Record<string, number>; 
  hydration?: number; 
  recipeType?: RecipeType; 
  timings?: Record<string, string>; 
}

/**
 * Recipe converter interface
 */
export interface IRecipeConverter {
  convert(recipeData: RecipeData, targetSystem: MeasurementSystem): Promise<ConversionResult>;
}
