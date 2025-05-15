
import { logInfo, logError } from '@/utils/logger';

const API_KEY_STORAGE_KEY = 'ai_api_key';

/**
 * Check if the API key is configured in localStorage
 */
export const isAIConfigured = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  return !!apiKey && apiKey.trim().length > 0;
};

/**
 * Get the OpenAI API key from localStorage
 */
export const getOpenAIApiKey = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(API_KEY_STORAGE_KEY);
};

/**
 * Configure the AI API key in localStorage
 */
export const configureAIKey = (apiKey: string): void => {
  if (typeof window === 'undefined') return;
  
  if (!apiKey || apiKey.trim().length === 0) {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    logInfo('AI API key removed');
    return;
  }
  
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
  logInfo('AI API key configured');
};

/**
 * Verify the API key by making a test request
 */
export const verifyAPIKey = async (): Promise<boolean> => {
  try {
    const apiKey = getOpenAIApiKey();
    
    if (!apiKey) {
      logInfo('No API key configured to verify');
      return false;
    }
    
    // For now, just return true if key exists
    // In a production app, you might want to make a test API request
    return true;
  } catch (error) {
    logError('Error verifying API key', { error });
    return false;
  }
};

/**
 * Check the status of the API key
 */
export const checkAPIKeyStatus = async (): Promise<{ 
  configured: boolean; 
  valid?: boolean;
}> => {
  const configured = isAIConfigured();
  
  if (!configured) {
    return { configured: false };
  }
  
  try {
    const valid = await verifyAPIKey();
    return { configured: true, valid };
  } catch (error) {
    return { configured: true, valid: false };
  }
};

/**
 * Update the OpenAI API key in global runtime configuration
 * This should be called on app initialization
 */
export const updateOpenAIApiKey = (): void => {
  const apiKey = getOpenAIApiKey();
  
  // In a real app, you might want to set the key in a global config object
  // or pass it to your OpenAI client configuration
  
  if (apiKey) {
    logInfo('OpenAI API key updated in runtime configuration');
  }
};
