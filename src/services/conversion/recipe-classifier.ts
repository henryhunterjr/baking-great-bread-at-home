
import { RecipeData, RecipeType, RecipeIngredient } from './types';

/**
 * Identifies the recipe type based on ingredients and instructions
 */
export function identifyRecipeType(recipeData: RecipeData): RecipeType {
  const ingredientTexts: string[] = recipeData.ingredients.map(i => {
    if (typeof i === 'string') {
      return i.toLowerCase();
    } else {
      return i.name.toLowerCase();
    }
  });
  
  const instructionsText = recipeData.instructions.join(' ').toLowerCase();
  
  // Check for sourdough
  if (ingredientTexts.some(name => 
    name.includes('starter') || 
    name.includes('levain') || 
    name.includes('sourdough'))) {
    return 'sourdough';
  }
  
  // Check for yeasted bread
  if (ingredientTexts.some(name => 
    name.includes('yeast') || 
    name.includes('instant dry yeast') || 
    name.includes('active dry'))) {
    return 'yeasted';
  }
  
  // Check for enriched dough
  const hasEnrichments = [
    ingredientTexts.some(name => name.includes('butter') || name.includes('margarine')),
    ingredientTexts.some(name => name.includes('egg')),
    ingredientTexts.some(name => name.includes('milk'))
  ];
  
  if (hasEnrichments.filter(Boolean).length >= 2) {
    return 'enriched';
  }
  
  // Check for quick bread
  if (ingredientTexts.some(name => 
    name.includes('baking powder') || 
    name.includes('baking soda'))) {
    return 'quickbread';
  }
  
  // Default
  return 'standard';
}
