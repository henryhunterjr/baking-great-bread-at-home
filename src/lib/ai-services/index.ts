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
    // More verbose logging for debugging
    console.group('OpenAI API Key Initialization');
    console.log('Environment Variable:', import.meta.env.VITE_OPENAI_API_KEY);
    console.log('AI Config Key:', AI_CONFIG.openai.apiKey);
    console.log('Stored LocalStorage Key:', localStorage.getItem('openai_api_key'));

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
        console.log('Configuration Successful ✅');
        console.groupEnd();
        return true;
      } else {
        logError('AI service configuration failed despite having an API key');
        console.log('Configuration Failed ❌');
        console.groupEnd();
        return false;
      }
    } else {
      logInfo('No API key found, AI service not initialized');
      console.log('No API Key Found ❌');
      console.groupEnd();
      return false;
    }
  } catch (error) {
    logError('Error initializing AI service:', { error });
    console.error('Initialization Error:', error);
    console.groupEnd();
    return false;
  }
};

// Export the entire service as default
export { default } from './ai-service';
