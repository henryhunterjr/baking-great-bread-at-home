
import { RecipeData } from '@/pages/RecipeConverter';
import { StandardRecipe, StandardRecipeIngredientSection, StandardRecipeInstructionStep } from '@/types/standardRecipeFormat';
import { v4 as uuidv4 } from 'uuid';

/**
 * Convert from internal RecipeData format to StandardRecipe JSON format
 */
export const convertToStandardFormat = (recipe: RecipeData): StandardRecipe => {
  // Process ingredients into sections
  const mainSection: StandardRecipeIngredientSection = {
    section: "Main Dough",
    items: recipe.ingredients.map(ing => {
      // Try to split ingredient into amount and name
      const match = ing.match(/^([\d./]+\s*[a-zA-Z]*)\s+(.+)$/);
      if (match) {
        return {
          amount: match[1].trim(),
          ingredient: match[2].trim()
        };
      }
      
      return {
        amount: "",
        ingredient: ing
      };
    })
  };
  
  // Process instructions into step objects
  const instructions: StandardRecipeInstructionStep[] = recipe.instructions.map((instruction, index) => {
    return {
      step: index + 1,
      title: `Step ${index + 1}`,
      description: instruction
    };
  });
  
  return {
    name: recipe.title,
    summary: recipe.introduction || "",
    metadata: {
      prep_time: recipe.prepTime || "0 minutes",
      proof_time: recipe.restTime || undefined,
      bake_time: recipe.bakeTime || "0 minutes",
      total_time: recipe.totalTime || "0 minutes",
      yield: "1 loaf", // Default value, could be customized
      difficulty: "Intermediate" // Default value, could be customized
    },
    ingredients: [mainSection],
    equipment: recipe.equipmentNeeded.map(item => item.name),
    instructions: instructions,
    notes: [...recipe.tips, ...recipe.proTips],
    tags: recipe.tags
  };
};

/**
 * Convert from StandardRecipe JSON format to internal RecipeData format
 */
export const convertFromStandardFormat = (standardRecipe: StandardRecipe): RecipeData => {
  // Flatten ingredient sections into a single array
  const ingredients = standardRecipe.ingredients.flatMap(section => 
    section.items.map(item => `${item.amount} ${item.ingredient}`.trim())
  );
  
  // Convert instructions to simple strings
  const instructions = standardRecipe.instructions.map(step => step.description);
  
  // Split notes into tips and proTips
  const tips = standardRecipe.notes.slice(0, Math.ceil(standardRecipe.notes.length / 2));
  const proTips = standardRecipe.notes.slice(Math.ceil(standardRecipe.notes.length / 2));
  
  // Convert equipment to equipment items with IDs
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
    restTime: standardRecipe.metadata.proof_time || "",
    bakeTime: standardRecipe.metadata.bake_time,
    totalTime: standardRecipe.metadata.total_time,
    instructions,
    tips,
    proTips,
    equipmentNeeded,
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
    tags: standardRecipe.tags,
    isPublic: false,
    isConverted: true
  };
};

/**
 * Parse a JSON string to StandardRecipe object
 */
export const parseRecipeJson = (jsonString: string): StandardRecipe | null => {
  try {
    const parsed = JSON.parse(jsonString);
    
    // Validate essential fields
    if (!parsed.name || !parsed.ingredients || !parsed.instructions) {
      console.error("Missing required fields in recipe JSON");
      return null;
    }
    
    return parsed as StandardRecipe;
  } catch (error) {
    console.error("Error parsing recipe JSON:", error);
    return null;
  }
};

/**
 * Convert a recipe to JSON string
 */
export const recipeToJsonString = (recipe: RecipeData): string => {
  const standardFormat = convertToStandardFormat(recipe);
  return JSON.stringify(standardFormat, null, 2); // Pretty print with 2 spaces
};
