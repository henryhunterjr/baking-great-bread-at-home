
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

// Export context-aware AI functionality
export { 
  contextAwareAI,
  initializeContextAwareAI,
  type ContextAwareResponse
} from './context-aware-ai';

// Export content indexing functionality
export {
  contentIndexer,
  initializeContentIndexer
} from './content-indexing/content-indexer';

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
