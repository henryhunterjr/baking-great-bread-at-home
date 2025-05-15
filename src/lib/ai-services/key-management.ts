
/**
 * OpenAI API Key management utilities
 * Handles keys from local storage or environment variables
 */

const LOCAL_STORAGE_KEY = 'openai-api-key';

/**
 * Check if AI is configured with a valid API key
 */
export function isAIConfigured(): boolean {
  return !!getOpenAIApiKey();
}

/**
 * Get the OpenAI API key from available sources
 * Prioritizes Vite environment variables, then falls back to localStorage
 */
export function getOpenAIApiKey(): string | null {
  // First check import.meta.env (Vite's environment variables)
  if (import.meta.env.VITE_OPENAI_API_KEY) {
    return import.meta.env.VITE_OPENAI_API_KEY;
  }
  
  // Then check localStorage (user-provided key)
  const localKey = localStorage?.getItem(LOCAL_STORAGE_KEY);
  if (localKey) {
    return localKey;
  }
  
  // Finally check for a window.env object (sometimes used for browser env vars)
  const windowEnv = window as any;
  if (windowEnv.env?.OPENAI_API_KEY) {
    return windowEnv.env.OPENAI_API_KEY;
  }
  
  return null;
}

/**
 * Save the OpenAI API key to local storage
 */
export function saveOpenAIApiKey(apiKey: string): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, apiKey);
  }
}

/**
 * Configure and save the OpenAI API key
 * Alias for saveOpenAIApiKey for backward compatibility
 */
export const configureAIKey = saveOpenAIApiKey;

/**
 * Verify if the configured API key is valid by making a test request to OpenAI
 */
export async function verifyAPIKey(): Promise<boolean> {
  try {
    const apiKey = getOpenAIApiKey();
    if (!apiKey) return false;
    
    // Make a minimal request to OpenAI to verify the key
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.status === 200;
  } catch (error) {
    console.error('Error verifying API key:', error);
    return false;
  }
}

/**
 * Check the status of the API key
 * Returns information about the key's existence and format validity
 */
export function checkAPIKeyStatus(): { hasKey: boolean; keyFormat: boolean } {
  const apiKey = getOpenAIApiKey();
  
  return {
    hasKey: !!apiKey,
    keyFormat: !!apiKey && apiKey.startsWith('sk-') && apiKey.length > 20
  };
}

/**
 * Update the OpenAI API key if needed
 * This function is used to ensure the most up-to-date key is being used
 */
export function updateOpenAIApiKey(): void {
  // This is just a placeholder function that ensures we're using the most up-to-date key
  // It doesn't actually need to do anything since getOpenAIApiKey already checks all sources
  const apiKey = getOpenAIApiKey();
  if (!apiKey) {
    console.warn('No OpenAI API key found. Please configure one in settings.');
  }
}

/**
 * Remove the OpenAI API key from local storage
 */
export function removeOpenAIApiKey(): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
}
