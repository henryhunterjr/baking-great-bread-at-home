
export enum ConversionErrorType {
  PDF_EXTRACTION = 'pdf_extraction',
  IMAGE_PROCESSING = 'image_processing',
  FORMAT_DETECTION = 'format_detection',
  UNIT_CONVERSION = 'unit_conversion',
  PARSING_ERROR = 'parsing_error',
  EMPTY_INPUT = 'empty_input',
  UNKNOWN = 'unknown'
}

export interface ConversionResult {
  success: boolean;
  data?: any;
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
  // Add these properties for the converters
  original?: RecipeData;
  converted?: RecipeData;
  bakersPercentages?: Record<string, number>;
  hydration?: number;
  recipeType?: RecipeType;
  timings?: Record<string, string>;
}

export interface AISuggestions {
  tips: string[];
  improvements: string[];
  alternativeMethods?: string[];
}

// Add the missing type definitions
export type RecipeType = 'sourdough' | 'yeasted' | 'enriched' | 'quickbread' | 'standard';

export type MeasurementSystem = 'metric' | 'imperial';

export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
  isFlour?: boolean;
  isLiquid?: boolean;
}

export interface RecipeData {
  id?: string;
  title: string;
  ingredients: (RecipeIngredient | string)[];
  instructions: string[];
  notes?: string[];
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  yield?: string;
  author?: string;
  source?: string;
  tags?: string[];
  isConverted?: boolean;
  updatedAt?: string;
  imageUrl?: string;
  hydration?: number;
}

// Add the missing interface for recipe converters
export interface IRecipeConverter {
  convert(recipeData: RecipeData, targetSystem: MeasurementSystem): Promise<ConversionResult>;
}
