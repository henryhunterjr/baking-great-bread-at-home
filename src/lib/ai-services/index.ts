
// Re-export all AI services functionality
export { 
  configureAI, 
  isAIConfigured,
  searchBlogWithAI, 
  processRecipeText, 
  generateRecipe,
  generateRecipeWithOpenAI,
  processOCRWithAI,
  type RecipeGenerationResponse,
  type AIResponse,
  type BlogSearchResponse
} from './ai-service';

import { initializeAIService, verifyAIServiceStatus } from './initialize';
import { getOpenAIApiKey, isOpenAIConfigured } from './ai-config';

// Re-export initialization functions
export { 
  initializeAIService,
  verifyAIServiceStatus,
  getOpenAIApiKey,
  isOpenAIConfigured
};

// Initialize the service immediately
initializeAIService();

// Export the entire service as default
export { default } from './ai-service';
