
import { RecipeData, ConversionResult, MeasurementSystem, RecipeType, IRecipeConverter } from './types';
import { identifyRecipeType } from './recipe-classifier';
import { SourdoughConverter } from './converters/sourdough-converter';
import { YeastedConverter } from './converters/yeasted-converter';
import { EnrichedConverter } from './converters/enriched-converter';
import { QuickBreadConverter } from './converters/quickbread-converter';
import { StandardConverter } from './converters/standard-converter';

class ConversionService {
  private converters: Map<RecipeType, IRecipeConverter>;
  
  constructor() {
    // Initialize specialized converters
    this.converters = new Map();
    this.converters.set('sourdough', new SourdoughConverter());
    this.converters.set('yeasted', new YeastedConverter());
    this.converters.set('enriched', new EnrichedConverter());
    this.converters.set('quickbread', new QuickBreadConverter());
    this.converters.set('standard', new StandardConverter());
  }
  
  /**
   * Get the appropriate converter based on recipe type
   */
  private getConverter(recipeType: RecipeType): IRecipeConverter {
    const converter = this.converters.get(recipeType);
    
    if (!converter) {
      // Fallback to standard converter if no specialized one is found
      return this.converters.get('standard')!;
    }
    
    return converter;
  }
  
  /**
   * Identify recipe type
   */
  identifyRecipeType(recipeData: RecipeData): RecipeType {
    return identifyRecipeType(recipeData);
  }
  
  /**
   * Main conversion method
   */
  async convert(recipeData: RecipeData, targetSystem: MeasurementSystem = 'metric'): Promise<ConversionResult> {
    // Identify recipe type
    const recipeType = this.identifyRecipeType(recipeData);
    
    // Get the appropriate converter
    const converter = this.getConverter(recipeType);
    
    // Convert the recipe
    return converter.convert(recipeData, targetSystem);
  }
}

// Export a singleton instance
export const conversionService = new ConversionService();

// Export types for ease of use
export type { 
  RecipeData, 
  ConversionResult,
  MeasurementSystem,
  RecipeType,
  RecipeIngredient 
} from './types';
