
import { RecipeData } from '@/pages/RecipeConverter';
import { StandardRecipe } from '@/types/standardRecipeFormat';
import { v4 as uuidv4 } from 'uuid';

/**
 * Convert a recipe to a JSON string
 */
export const recipeToJsonString = (recipe: RecipeData): string => {
  const standardRecipe = recipeToStandardFormat(recipe);
  return JSON.stringify(standardRecipe, null, 2);
};

/**
 * Convert an internal RecipeData to the StandardRecipe format
 */
export const recipeToStandardFormat = (recipe: RecipeData): StandardRecipe => {
  // Parse the ingredients into the structured format
  const ingredientSection: StandardRecipe['ingredients'][0] = {
    section: 'Main Ingredients',
    items: recipe.ingredients.map(ingredientText => {
      // Try to extract amount and ingredient name
      const match = ingredientText.match(/^([\d\/\.\s]+[\w\s]*)\s+(.+)$/);
      
      if (match && match.length >= 3) {
        return {
          amount: match[1].trim(),
          ingredient: match[2].trim()
        };
      }
      
      // Fallback if parsing fails
      return {
        amount: '',
        ingredient: ingredientText
      };
    })
  };
  
  // Parse instructions into step format
  const instructions = recipe.instructions.map((instruction, index) => ({
    step: index + 1,
    title: `Step ${index + 1}`,
    description: instruction
  }));
  
  // Create the standard recipe object
  return {
    name: recipe.title,
    summary: recipe.introduction,
    metadata: {
      prep_time: recipe.prepTime || '0 minutes',
      proof_time: recipe.restTime || undefined,
      bake_time: recipe.bakeTime || '0 minutes',
      total_time: recipe.totalTime || '0 minutes',
      yield: '1 serving',
      difficulty: 'Intermediate'
    },
    ingredients: [ingredientSection],
    equipment: recipe.equipmentNeeded.map(item => item.name),
    instructions: instructions,
    notes: [...recipe.tips, ...recipe.proTips],
    tags: recipe.tags
  };
};

/**
 * Convert a StandardRecipe to our internal RecipeData format
 */
export const convertFromStandardFormat = (standardRecipe: StandardRecipe): RecipeData => {
  // Flatten ingredients from all sections
  const ingredients = standardRecipe.ingredients.flatMap(section => 
    section.items.map(item => `${item.amount} ${item.ingredient}`.trim())
  );
  
  // Convert instructions to simple strings
  const instructions = standardRecipe.instructions.map(step => step.description);
  
  // Split notes into tips and proTips (for simplicity, put all in tips)
  const tips = standardRecipe.notes || [];
  
  // Create equipment items with IDs
  const equipmentNeeded = standardRecipe.equipment.map(name => ({
    id: uuidv4(),
    name,
    affiliateLink: undefined
  }));
  
  return {
    title: standardRecipe.name,
    introduction: standardRecipe.summary,
    ingredients,
    prepTime: standardRecipe.metadata.prep_time,
    restTime: standardRecipe.metadata.proof_time || '',
    bakeTime: standardRecipe.metadata.bake_time,
    totalTime: standardRecipe.metadata.total_time,
    instructions,
    tips,
    proTips: [],
    equipmentNeeded,
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
    tags: standardRecipe.tags,
    isPublic: false,
    isConverted: true
  };
};

/**
 * Try to parse a string as JSON and check if it matches our StandardRecipe format
 */
export const parseRecipeJson = (text: string): StandardRecipe | null => {
  try {
    const parsed = JSON.parse(text);
    
    // Validate that this is our StandardRecipe format
    if (
      parsed &&
      typeof parsed === 'object' &&
      parsed.name &&
      parsed.metadata &&
      Array.isArray(parsed.ingredients) &&
      Array.isArray(parsed.instructions)
    ) {
      return parsed as StandardRecipe;
    }
    
    return null;
  } catch (error) {
    return null;
  }
};
