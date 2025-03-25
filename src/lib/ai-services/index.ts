
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

// Initialize the AI service with any stored API key
export const initializeAIService = (): boolean => {
  // Check if there's a stored API key in localStorage
  const storedApiKey = localStorage.getItem('openai_api_key');
  
  if (storedApiKey) {
    // Configure the AI service with the stored API key
    configureAI(storedApiKey);
    return true;
  }
  
  return false;
};

// Export the entire service as default
export { default } from './ai-service';
