
import { RecipeData, ConversionResult, MeasurementSystem, RecipeType, RecipeIngredient } from './types';
import { convertMeasurement, calculateBakersPercentages, calculateHydration } from './utils/measurement-utils';

/**
 * Base converter class that handles common conversion functionality
 */
export abstract class BaseConverter {
  protected recipeType: RecipeType;
  
  constructor(recipeType: RecipeType) {
    this.recipeType = recipeType;
  }

  /**
   * Convert the recipe measurements based on target system
   */
  protected convertMeasurements(recipeData: RecipeData, targetSystem: MeasurementSystem): RecipeData {
    // Clone the recipe
    const converted: RecipeData = JSON.parse(JSON.stringify(recipeData));
    
    // Convert units if needed
    if (targetSystem === 'metric') {
      converted.ingredients = converted.ingredients.map(ingredient => {
        // Skip string-based ingredients
        if (typeof ingredient === 'string') {
          return ingredient;
        }
        
        // Convert imperial to metric
        if (['oz', 'lb', 'fl oz', 'qt', 'c'].includes(ingredient.unit)) {
          const newUnit = ingredient.unit === 'oz' || ingredient.unit === 'lb' ? 'g' : 'ml';
          return {
            ...ingredient,
            quantity: convertMeasurement(ingredient.quantity, ingredient.unit, newUnit),
            unit: newUnit
          };
        }
        return ingredient;
      });
    } else {
      converted.ingredients = converted.ingredients.map(ingredient => {
        // Skip string-based ingredients
        if (typeof ingredient === 'string') {
          return ingredient;
        }
        
        // Convert metric to imperial
        if (['g', 'kg', 'ml', 'l'].includes(ingredient.unit)) {
          const newUnit = ingredient.unit === 'g' || ingredient.unit === 'kg' ? 'oz' : 'fl oz';
          return {
            ...ingredient,
            quantity: convertMeasurement(ingredient.quantity, ingredient.unit, newUnit),
            unit: newUnit
          };
        }
        return ingredient;
      });
    }
    
    return converted;
  }
  
  /**
   * Base conversion method to be extended by specialized converters
   */
  async convert(recipeData: RecipeData, targetSystem: MeasurementSystem): Promise<ConversionResult> {
    const converted = this.convertMeasurements(recipeData, targetSystem);
    
    // Extract RecipeIngredient objects from the ingredients array for calculations
    const ingredientObjects = converted.ingredients
      .filter((item): item is RecipeIngredient => typeof item !== 'string');
    
    const bakersPercentages = calculateBakersPercentages(ingredientObjects);
    const hydration = calculateHydration(ingredientObjects);
    
    return {
      success: true,
      converted,
      bakersPercentages,
      hydration,
      recipeType: this.recipeType
    };
  }
}
