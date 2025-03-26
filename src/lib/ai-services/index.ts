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
import { AI_CONFIG } from './ai-config';

// Initialize the AI service with any stored API key
export const initializeAIService = (): boolean => {
  try {
    // Log the raw value of the API key for debugging
    console.log('Raw OpenAI API Key:', import.meta.env.VITE_OPENAI_API_KEY);
    console.log('AI Config OpenAI Key:', AI_CONFIG.openai.apiKey);

    // Check if there's a stored API key in localStorage
    const storedApiKey = localStorage.getItem('openai_api_key');
    
    // Prefer the environment variable, then localStorage
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY || storedApiKey;
    
    if (apiKey && apiKey.trim() !== '') {
      // Configure the AI service with the API key
      configureAI(apiKey);
      
      // Verify configuration was successful
      if (isAIConfigured()) {
        logInfo('AI service successfully initialized with API key', { 
          keySource: import.meta.env.VITE_OPENAI_API_KEY ? 'environment' : 'localStorage',
          keyLength: apiKey.length 
        });
        return true;
      } else {
        logError('AI service configuration failed despite having an API key');
        return false;
      }
    } else {
      logInfo('No API key found, AI service not initialized');
      return false;
    }
  } catch (error) {
    logError('Error initializing AI service:', { error });
    return false;
  }
};

// Export the entire service as default
export { default } from './ai-service';
