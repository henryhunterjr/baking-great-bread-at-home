
// Re-export all AI services functionality
export { 
  configureAI, 
  isAIConfigured,
  searchBlogWithAI, 
  processRecipeText, 
  generateRecipeWithOpenAI,
  processOCRWithAI,
  verifyAPIKey,
  checkAPIKeyStatus,
  updateOpenAIApiKey,
  getOpenAIApiKey,
  type RecipeGenerationResponse,
  type AIResponse,
  type BlogSearchResponse
} from './ai-service';

import aiServiceInstance from './ai-service';

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

// Initialize the service immediately
const initializeAIService = () => {
  updateOpenAIApiKey();
  return aiServiceInstance.isReady();
};

const verifyAIServiceStatus = async () => {
  return await verifyAPIKey();
};

// Re-export initialization functions
export { 
  initializeAIService,
  verifyAIServiceStatus
};

// Export the entire service as default
export { default } from './ai-service';

// Initialize service
initializeAIService();
