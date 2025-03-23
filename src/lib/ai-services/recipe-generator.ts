import { Recipe } from '@/types/recipe';
import { generateRecipeWithAI } from './openai-service';

/**
 * Generate a recipe from a text prompt
 * @param {string} prompt - Description of the recipe to generate
 * @returns {Promise<Recipe>} - Generated recipe object
 */
export const generateRecipe = async (prompt: string): Promise<Recipe> => {
  try {
    return await generateRecipeWithAI(prompt);
  } catch (error) {
    console.error('Error generating recipe:', error);
    throw error;
  }
};
