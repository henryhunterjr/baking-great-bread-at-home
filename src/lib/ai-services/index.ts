
// Re-export all AI services functionality
export { 
  configureAIKey as configureAI, 
  isAIConfigured,
  getOpenAIApiKey,
  verifyAPIKey,
  checkAPIKeyStatus,
  updateOpenAIApiKey
} from './key-management';

export {
  generateRecipeWithOpenAI,
  processRecipeText,
  type RecipeGenerationResponse
} from './recipe-operations';

export {
  searchBlogWithAI,
  type BlogSearchResponse
} from './blog-operations';

export {
  processOCRWithAI,
  cleanOCRText
} from './ocr-processing';

// Basic response interface
export interface AIResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Import and re-export from initialization module
import { 
  initializeAIService, 
  verifyAIServiceStatus 
} from './initialization';

// Re-export initialization functions
export { 
  initializeAIService,
  verifyAIServiceStatus
};

// Initialize service immediately
initializeAIService().catch(error => {
  console.error('Error initializing AI service:', error);
});
