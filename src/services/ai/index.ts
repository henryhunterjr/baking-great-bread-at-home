
// Main AI service file that exports all functionality

// Export configuration
export { AI_CONFIG } from './config';

// Export recipe processing functionality
export { processRecipeText } from './recipeProcessor';

// Export recipe generation functionality
export { generateRecipeFromPrompt } from './recipeGenerator';

// Export helpers for direct use if needed
export { 
  generateIngredientsBasedOnPrompt,
  generateInstructionsBasedOnPrompt 
} from './helpers';

/**
 * Main AI service object with all functionality
 */
export default {
  config: AI_CONFIG,
  processRecipeText,
  generateRecipeFromPrompt
};

// Import the functions for usage within this file
import { AI_CONFIG } from './config';
import { processRecipeText } from './recipeProcessor';
import { generateRecipeFromPrompt } from './recipeGenerator';
