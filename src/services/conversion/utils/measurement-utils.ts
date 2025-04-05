
import { RecipeIngredient } from '../types';

// Conversion factors between different units
const conversionMap: Record<string, Record<string, number>> = {
  'g': { 'oz': 0.035274 },
  'oz': { 'g': 28.3495 },
  'kg': { 'lb': 2.20462 },
  'lb': { 'kg': 0.453592 },
  'ml': { 'fl oz': 0.033814 },
  'fl oz': { 'ml': 29.5735 },
  'l': { 'qt': 1.05669 },
  'qt': { 'l': 0.946353 },
  'c': { 'ml': 236.588 },
  'ml': { 'c': 0.00423 }
};

/**
 * Convert a value from one unit to another
 */
export function convertMeasurement(value: number, fromUnit: string, toUnit: string): number {
  // If units are the same, no conversion needed
  if (fromUnit === toUnit) return value;
  
  // Direct conversion if available
  if (conversionMap[fromUnit] && conversionMap[fromUnit][toUnit]) {
    return value * conversionMap[fromUnit][toUnit];
  }
  
  // If no direct conversion, try to go through a common unit (g or ml)
  if (fromUnit === 'c' && toUnit === 'oz') {
    return convertMeasurement(
      convertMeasurement(value, 'c', 'ml'),
      'ml',
      'oz'
    );
  }
  
  // If no conversion found, return original
  console.warn(`No conversion found from ${fromUnit} to ${toUnit}`);
  return value;
}

/**
 * Calculate baker's percentages from ingredients
 */
export function calculateBakersPercentages(ingredients: RecipeIngredient[]): Record<string, number> {
  // Find total flour weight
  const flourIngredients = ingredients.filter(i => 
    i.name.toLowerCase().includes('flour')
  );
  
  if (flourIngredients.length === 0) {
    return {};
  }
  
  const totalFlourWeight = flourIngredients.reduce(
    (sum, ingredient) => sum + ingredient.quantity,
    0
  );
  
  // Calculate percentages
  const percentages: Record<string, number> = {};
  
  ingredients.forEach(ingredient => {
    const percentage = (ingredient.quantity / totalFlourWeight) * 100;
    percentages[ingredient.name] = Math.round(percentage * 10) / 10;
  });
  
  return percentages;
}

/**
 * Calculate hydration (water to flour ratio)
 */
export function calculateHydration(ingredients: RecipeIngredient[]): number {
  const flourWeight = ingredients
    .filter(i => i.name.toLowerCase().includes('flour'))
    .reduce((sum, ingredient) => sum + ingredient.quantity, 0);
    
  const waterWeight = ingredients
    .filter(i => i.name.toLowerCase().includes('water'))
    .reduce((sum, ingredient) => sum + ingredient.quantity, 0);
  
  if (flourWeight === 0) return 0;
  
  return Math.round((waterWeight / flourWeight) * 1000) / 10;
}
