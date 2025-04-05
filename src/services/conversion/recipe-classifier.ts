
import { RecipeData, RecipeType } from './types';

/**
 * Identifies the recipe type based on ingredients and instructions
 */
export function identifyRecipeType(recipeData: RecipeData): RecipeType {
  const ingredientNames = recipeData.ingredients.map(i => i.name.toLowerCase());
  const instructionsText = recipeData.instructions.join(' ').toLowerCase();
  
  // Check for sourdough
  if (ingredientNames.some(name => 
    name.includes('starter') || 
    name.includes('levain') || 
    name.includes('sourdough'))) {
    return 'sourdough';
  }
  
  // Check for yeasted bread
  if (ingredientNames.some(name => 
    name.includes('yeast') || 
    name.includes('instant dry yeast') || 
    name.includes('active dry'))) {
    return 'yeasted';
  }
  
  // Check for enriched dough
  const hasEnrichments = [
    ingredientNames.some(name => name.includes('butter') || name.includes('margarine')),
    ingredientNames.some(name => name.includes('egg')),
    ingredientNames.some(name => name.includes('milk'))
  ];
  
  if (hasEnrichments.filter(Boolean).length >= 2) {
    return 'enriched';
  }
  
  // Check for quick bread
  if (ingredientNames.some(name => 
    name.includes('baking powder') || 
    name.includes('baking soda'))) {
    return 'quickbread';
  }
  
  // Default
  return 'standard';
}
