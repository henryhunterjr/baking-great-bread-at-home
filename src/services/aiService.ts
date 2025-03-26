
// This file is maintained for backward compatibility
// It re-exports all functionality from the new modular structure

import { 
  AI_CONFIG,
  processRecipeText, 
  generateRecipeFromPrompt,
  generateIngredientsBasedOnPrompt,
  generateInstructionsBasedOnPrompt
} from './ai';

// Re-export everything
export { 
  AI_CONFIG,
  processRecipeText, 
  generateRecipeFromPrompt,
  generateIngredientsBasedOnPrompt,
  generateInstructionsBasedOnPrompt
};

// For default import compatibility
export default {
  AI_CONFIG,
  processRecipeText,
  generateRecipeFromPrompt
};
