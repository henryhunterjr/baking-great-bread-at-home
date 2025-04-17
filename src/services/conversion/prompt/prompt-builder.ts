
import { logInfo } from '@/utils/logger';

/**
 * Build a prompt for recipe conversion
 */
export const buildRecipePrompt = (
  recipeText: string, 
  options: { detailed: boolean } = { detailed: false }
): string => {
  logInfo('Building recipe prompt', { 
    textLength: recipeText.length, 
    detailed: options.detailed 
  });
  
  const basePrompt = `
You are an AI assistant that extracts structured recipe information from user input.

Please analyze the following recipe text and extract the structured information:

${recipeText}

Return a structured recipe with the following information (if available):
- Title
- Description/introduction
- Ingredients list with quantities and units
- Step-by-step instructions
- Preparation time
- Cooking/baking time
- Rest/rise time (if applicable)
- Total time
- Servings
- Any tips or notes

Format your response as a JSON object with these fields. Make sure your JSON is valid and properly structured.
`.trim();

  // Add more detailed instructions if requested
  if (options.detailed) {
    return `
${basePrompt}

Additionally, please extract the following detailed information when present:
- Equipment needed
- Nutritional information
- Dietary tags or categories (e.g., vegetarian, gluten-free)
- Difficulty level
- Source or author
- Storage instructions
- Variations or substitutions

Ensure all text is properly cleaned and formatted. For ingredients, ensure quantities, units, and ingredient names are clearly distinguished.
`.trim();
  }

  return basePrompt;
};

/**
 * Get error-specific prompts for recovery attempts
 */
export const getErrorSpecificPrompt = (errorType: string, recipeText: string): string => {
  switch (errorType) {
    case 'parsing_error':
      return `
I'm having trouble parsing this recipe text. Please format it as a valid JSON object with clear structure.

Recipe text:
${recipeText}

Return ONLY a valid JSON object with at minimum: title, ingredients (as array), and instructions (as array).
`.trim();
      
    case 'formatting_error':
      return `
This recipe text needs better formatting. Convert it to a clear JSON structure.

Recipe text:
${recipeText}

Return ONLY a valid JSON with fields: title, ingredients (array), instructions (array).
`.trim();
      
    default:
      return `
Please convert this recipe text to a structured JSON format:

${recipeText}

Return ONLY a valid JSON object with fields: title, ingredients (array), instructions (array).
`.trim();
  }
};
