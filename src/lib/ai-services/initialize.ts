
import { configureAI } from './ai-service';
import { logInfo, logError } from '@/utils/logger';

/**
 * Initialize the AI service with saved API keys
 */
export const initializeAIService = (): void => {
  try {
    // Check local storage for saved API key
    const savedKey = localStorage.getItem('openai_api_key');
    
    if (savedKey) {
      logInfo('Initializing AI service with saved API key');
      configureAI(savedKey);
    } else {
      logInfo('No saved API key found');
    }
  } catch (error) {
    logError('Failed to initialize AI service:', { error });
  }
};
