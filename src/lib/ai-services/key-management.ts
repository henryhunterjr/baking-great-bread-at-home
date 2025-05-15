
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
 * Remove the OpenAI API key from local storage
 */
export function removeOpenAIApiKey(): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
}
