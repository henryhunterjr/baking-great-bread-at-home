
import { AI_CONFIG } from './config';
import { logInfo, logError } from '@/utils/logger';

/**
 * Get the OpenAI API key from various sources
 * @returns The API key string or null if not found
 */
export const getOpenAIApiKey = (): string | null => {
  // First check environment variable (for development)
  const envApiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (envApiKey && envApiKey.trim() !== '') {
    return envApiKey;
  }
  
  // Then check localStorage (for user-provided keys)
  const localStorageKey = localStorage.getItem('openai_api_key');
  if (localStorageKey && localStorageKey.trim() !== '') {
    return localStorageKey;
  }
  
  // Return null if no API key is found
  return null;
};

/**
 * Configure the AI service with a new API key
 * @param apiKey The API key to configure
 */
export const configureAIKey = (apiKey: string): void => {
  if (!apiKey || apiKey.trim() === '') {
    logError('Attempted to configure AI service with empty API key');
    return;
  }
  
  localStorage.setItem('openai_api_key', apiKey);
  AI_CONFIG.openai.apiKey = apiKey;
  logInfo('AI Service configured with new API key');
};

/**
 * Check if the AI service is configured with a valid API key
 * @returns Boolean indicating if the service is configured
 */
export const isAIConfigured = (): boolean => {
  const apiKey = getOpenAIApiKey();
  return !!apiKey && apiKey.trim() !== '';
};

/**
 * Verify if the current API key is valid by making a test request
 * @returns Promise resolving to a boolean indicating if the key is valid
 */
export const verifyAPIKey = async (): Promise<boolean> => {
  const apiKey = getOpenAIApiKey();
  
  if (!apiKey) {
    return false;
  }
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: AI_CONFIG.openai.model,
        messages: [
          { role: 'system', content: 'This is a test message.' },
          { role: 'user', content: 'Test' }
        ],
        max_tokens: 5
      })
    });
    
    return response.ok;
  } catch (error) {
    logError('Error verifying API key:', { error });
    return false;
  }
};

/**
 * Check the status of the API key with detailed information
 */
export const checkAPIKeyStatus = (): { 
  hasKey: boolean; 
  keyFormat: boolean;
  source: string;
} => {
  const apiKey = getOpenAIApiKey();
  const status = {
    hasKey: !!apiKey,
    keyFormat: !!apiKey && apiKey.startsWith('sk-') && apiKey.length > 20,
    source: ''
  };
  
  if (apiKey) {
    if (import.meta.env.VITE_OPENAI_API_KEY === apiKey) {
      status.source = 'environment';
    } else if (localStorage.getItem('openai_api_key') === apiKey) {
      status.source = 'localStorage';
    } else {
      status.source = 'default';
    }
  }
  
  return status;
};

/**
 * Update the OpenAI API key in the configuration
 */
export const updateOpenAIApiKey = (): void => {
  AI_CONFIG.openai.apiKey = getOpenAIApiKey();
};
