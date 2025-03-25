
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

import { configureAI, isAIConfigured } from './ai-service';
import { logInfo, logError } from '@/utils/logger';

// Initialize the AI service with any stored API key
export const initializeAIService = (): boolean => {
  try {
    // Check if there's a stored API key in localStorage
    const storedApiKey = localStorage.getItem('openai_api_key');
    
    if (storedApiKey && storedApiKey.trim() !== '') {
      // Configure the AI service with the stored API key
      configureAI(storedApiKey);
      
      // Verify configuration was successful
      if (isAIConfigured()) {
        logInfo('AI service successfully initialized with stored API key');
        return true;
      } else {
        logError('AI service configuration failed despite having an API key');
        return false;
      }
    } else {
      logInfo('No API key found in localStorage, AI service not initialized');
      return false;
    }
  } catch (error) {
    logError('Error initializing AI service:', { error });
    return false;
  }
};

// Export the entire service as default
export { default } from './ai-service';
