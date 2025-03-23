
// Configuration for the AI service
export const AI_CONFIG = {
  apiUrl: 'https://api.openai.com/v1',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  models: {
    chat: 'gpt-4o-mini',
    recipeProcessor: 'gpt-4o-mini',
    recipeGenerator: 'gpt-4o-mini'
  }
};

// Helper to check if API key is configured
export const isApiKeyConfigured = (): boolean => {
  return Boolean(AI_CONFIG.apiKey && AI_CONFIG.apiKey.length > 0);
};
