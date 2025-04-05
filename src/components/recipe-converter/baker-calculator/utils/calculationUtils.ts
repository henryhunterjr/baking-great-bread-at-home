
import { Ingredient } from '../types';

/**
 * Calculate baker's percentages based on ingredients
 */
export const calculateBakersPercentages = (ingredients: Ingredient[]) => {
  // Get total flour weight
  const flourItems = ingredients.filter(i => 
    i.name.toLowerCase().includes('flour')
  );
  
  const flourWeight = flourItems.reduce((sum, i) => sum + i.quantity, 0);
  
  if (flourWeight === 0) return null;
  
  // Calculate percentages
  const percentages = ingredients.map(ingredient => ({
    name: ingredient.name,
    percentage: Math.round((ingredient.quantity / flourWeight) * 1000) / 10
  }));
  
  // Calculate hydration
  const waterItems = ingredients.filter(i => 
    i.name.toLowerCase().includes('water') || 
    i.name.toLowerCase().includes('milk') || 
    i.name.toLowerCase() === 'liquid'
  );
  
  const waterWeight = waterItems.reduce((sum, i) => sum + i.quantity, 0);
  
  const hydration = Math.round((waterWeight / flourWeight) * 1000) / 10;
  
  return {
    percentages,
    hydration,
    totalFlourWeight: flourWeight
  };
};

/**
 * Parse ingredients from string format to structured format
 */
export const parseIngredients = (ingredientsArray: string[]): Ingredient[] => {
  return ingredientsArray.map(ing => {
    const ingredientStr = typeof ing === 'string' ? ing : String(ing);
    
    // Simple parsing logic - can be enhanced
    const match = ingredientStr.match(/(\d+\.?\d*)([a-zA-Z]+)\s+(.+)/);
    if (match) {
      return {
        quantity: parseFloat(match[1]),
        unit: match[2],
        name: match[3]
      };
    }
    return { name: ingredientStr, quantity: 0, unit: 'g' };
  });
};
