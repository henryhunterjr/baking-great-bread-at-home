
import { 
  RecipeData, 
  ConversionResult, 
  MeasurementSystem, 
  RecipeType, 
  IRecipeConverter 
} from '@/types/unifiedRecipe';

// Import recipe type classifier
import { identifyRecipeType } from './recipe-classifier';

// For now, we'll create a simple converter that fulfills the interface
class StandardConverter implements IRecipeConverter {
  async convert(recipeData: RecipeData, targetSystem: MeasurementSystem): Promise<ConversionResult> {
    return {
      success: true,
      data: {
        ...recipeData as any,
        name: recipeData.title,
        ingredients: Array.isArray(recipeData.ingredients) 
          ? recipeData.ingredients.map(ing => {
              if (typeof ing === 'string') {
                return { quantity: '', unit: '', name: ing };
              }
              return ing as any;
            })
          : [],
        isConverted: true
      }
    };
  }
}

class ConversionService {
  private converters: Map<RecipeType, IRecipeConverter>;
  
  constructor() {
    // Initialize with a standard converter for all types
    this.converters = new Map();
    const standardConverter = new StandardConverter();
    
    // Map all recipe types to the standard converter
    Object.values(RecipeType).forEach(type => {
      this.converters.set(type, standardConverter);
    });
  }
  
  /**
   * Get the appropriate converter based on recipe type
   */
  private getConverter(recipeType: RecipeType): IRecipeConverter {
    const converter = this.converters.get(recipeType);
    
    if (!converter) {
      // Fallback to standard converter if no specialized one is found
      const fallback = this.converters.get(RecipeType.STANDARD);
      if (fallback) return fallback;
      throw new Error('No standard recipe converter is configured');
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
  async convert(recipeData: RecipeData, targetSystem: MeasurementSystem = MeasurementSystem.METRIC): Promise<ConversionResult> {
    // Identify recipe type
    const recipeType = this.identifyRecipeType(recipeData);
    
    // Get the appropriate converter
    const converter = this.getConverter(recipeType);
    
    // Convert the recipe
    return converter.convert(recipeData, targetSystem);
  }
}

// Use the same classifier for direct callers and the conversion service.
export { identifyRecipeType } from './recipe-classifier';

// Export a singleton instance
export const conversionService = new ConversionService();

// Export types for ease of use
export { RecipeType, MeasurementSystem, ConversionErrorType } from '@/types/unifiedRecipe';
export type { RecipeData, ConversionResult, Ingredient } from '@/types/unifiedRecipe';
