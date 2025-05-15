
import { RecipeData, RecipeType } from '@/types/unifiedRecipe';
import { logInfo } from '@/utils/logger';

/**
 * Identify recipe type based on ingredients and instructions
 */
export const identifyRecipeType = (recipeData: RecipeData): RecipeType => {
  logInfo("Classifying recipe type", { title: recipeData.title });
  
  // Convert ingredients to string for analysis
  const ingredientText = recipeData.ingredients
    .map(ing => typeof ing === 'string' ? ing : ing.name)
    .join(' ')
    .toLowerCase();
  
  // Combine instructions for analysis
  const instructionText = recipeData.instructions.join(' ').toLowerCase();
  const allText = ingredientText + ' ' + instructionText;
  
  // Check for sourdough indicators
  if (allText.includes('sourdough') || 
      allText.includes('starter') || 
      allText.includes('levain')) {
    logInfo("Recipe classified as sourdough");
    return RecipeType.SOURDOUGH;
  } 
  
  // Check for yeasted bread indicators
  else if ((allText.includes('yeast') || allText.includes('poolish')) &&
           (allText.includes('flour') || allText.includes('bread'))) {
    logInfo("Recipe classified as yeasted");
    return RecipeType.YEASTED;
  } 
  
  // Check for enriched dough indicators
  else if ((allText.includes('butter') && allText.includes('sugar')) ||
           allText.includes('brioche') || 
           allText.includes('enriched')) {
    logInfo("Recipe classified as enriched");
    return RecipeType.ENRICHED;
  } 
  
  // Check for quick bread indicators
  else if (allText.includes('baking powder') || 
           allText.includes('baking soda') || 
           allText.includes('quick bread')) {
    logInfo("Recipe classified as quickbread");
    return RecipeType.QUICKBREAD;
  }
  
  // Default to standard
  logInfo("Recipe classified as standard");
  return RecipeType.STANDARD;
};

/**
 * Get more detailed classification including hydration percentage
 */
export const getDetailedRecipeClassification = (
  recipeData: RecipeData
): { 
  type: RecipeType; 
  hydration?: number; 
  fermentationTime?: number;
} => {
  const baseType = identifyRecipeType(recipeData);
  
  // Default return value
  return {
    type: baseType
  };
};
