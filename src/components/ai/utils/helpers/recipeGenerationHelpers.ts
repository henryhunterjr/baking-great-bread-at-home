
import { generateRecipeWithOpenAI } from '@/lib/ai-services';

/**
 * Process and handle recipe generation
 * @param prompt The recipe generation prompt
 */
export const handleGenerateRecipe = async (prompt: string) => {
  try {
    const response = await generateRecipeWithOpenAI(prompt);
    return response;
  } catch (error) {
    console.error('Error generating recipe:', error);
    return {
      success: false,
      error: 'Failed to generate recipe'
    };
  }
};
