
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

// Initialize the service immediately
const initializeAIService = () => {
  const { updateOpenAIApiKey } = require('./key-management');
  updateOpenAIApiKey();
  return isAIConfigured();
};

const verifyAIServiceStatus = async () => {
  const { verifyAPIKey } = require('./key-management');
  return await verifyAPIKey();
};

// Re-export initialization functions
export { 
  initializeAIService,
  verifyAIServiceStatus
};

// Initialize service
initializeAIService();
