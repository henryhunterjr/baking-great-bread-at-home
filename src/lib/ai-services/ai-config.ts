
// Configuration for the AI service
export const AI_CONFIG = {
  apiUrl: 'https://api.youraiprovider.com/v1',
  apiKey: import.meta.env.VITE_AI_API_KEY || 'demo-api-key',
  models: {
    recipeProcessor: 'recipe-processor-v1',
    recipeGenerator: 'recipe-generator-v1',
    chatAssistant: 'kitchen-assistant-v1'
  },
  openai: {
    apiUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini', // Using a more reliable model for reliable results
    defaultSystemPrompt: 'You are a helpful assistant specializing in bread baking and recipes.',
    apiKey: null // This will be set by the getOpenAIApiKey function
  }
};

// Export a function to get the OpenAI API key from various sources
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
  
  // Hardcoded key for demo purposes - replace with your actual API key for deployment
  // This ensures the app works for demos without requiring user input
  return 'sk-demo1234567890abcdefghijklmnopqrstuvwxyz123456789';
};

// Function to check if the OpenAI integration can be used
export const isOpenAIConfigured = (): boolean => {
  const apiKey = getOpenAIApiKey();
  // Update AI_CONFIG with the current key
  if (apiKey) {
    AI_CONFIG.openai.apiKey = apiKey;
    return true;
  }
  return false;
};

// Update the configuration with the current key
isOpenAIConfigured();

// Function to update the OpenAI API key in the configuration
export const updateOpenAIApiKey = (): void => {
  AI_CONFIG.openai.apiKey = getOpenAIApiKey();
};

// Initialize the OpenAI API key on module load
updateOpenAIApiKey();
