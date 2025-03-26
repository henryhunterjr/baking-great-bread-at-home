
import { configureAI } from './ai-service';
import { getOpenAIApiKey, updateOpenAIApiKey } from './ai-config';
import { logInfo, logError } from '@/utils/logger';

/**
 * Initialize the AI service with saved API keys
 */
export const initializeAIService = (): boolean => {
  try {
    // Get API key from the consolidated sources
    const apiKey = getOpenAIApiKey();
    
    // Log the initialization attempt for debugging
    console.group('OpenAI API Key Initialization');
    console.log('API Key Available:', !!apiKey);
    console.log('API Key Length:', apiKey ? apiKey.length : 0);
    
    if (apiKey) {
      logInfo('Initializing AI service with API key');
      configureAI(apiKey);
      // Update the OpenAI API key in the configuration
      updateOpenAIApiKey();
      console.log('Configuration Successful ✅');
      console.groupEnd();
      return true;
    } else {
      logInfo('No valid API key found for OpenAI integration');
      console.log('No Valid API Key Found ❌');
      console.groupEnd();
      return false;
    }
  } catch (error) {
    logError('Failed to initialize AI service:', { error });
    console.error('Initialization Error:', error);
    console.groupEnd();
    return false;
  }
};

// Add function to check initialization status
export const verifyAIServiceStatus = (): { 
  isConfigured: boolean; 
  keySource: string | null;
  model: string;
} => {
  const apiKey = getOpenAIApiKey();
  let keySource = null;
  
  if (import.meta.env.VITE_OPENAI_API_KEY) {
    keySource = 'environment';
  } else if (localStorage.getItem('openai_api_key')) {
    keySource = 'localStorage';
  }
  
  return {
    isConfigured: !!apiKey,
    keySource,
    model: 'gpt-4o-mini'
  };
};
