
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
  if (envApiKey) {
    return envApiKey;
  }
  
  // Then check localStorage (for user-provided keys)
  const localStorageKey = localStorage.getItem('openai_api_key');
  if (localStorageKey && localStorageKey.trim() !== '') {
    return localStorageKey;
  }
  
  return null;
};

// Function to check if the OpenAI integration can be used
export const isOpenAIConfigured = (): boolean => {
  return getOpenAIApiKey() !== null;
};

// Function to update the OpenAI API key in the configuration
export const updateOpenAIApiKey = (): void => {
  AI_CONFIG.openai.apiKey = getOpenAIApiKey();
};

// Function to configure the AI service with a provided API key
export const configureAI = (apiKey: string): void => {
  if (!apiKey || apiKey.trim() === '') {
    console.error('Invalid API key provided');
    return;
  }
  
  // Store the API key in localStorage
  localStorage.setItem('openai_api_key', apiKey);
  
  // Update the configuration
  AI_CONFIG.openai.apiKey = apiKey;
  
  console.log('AI service configured with API key');
};

// New function to verify the API key
export const verifyAPIKey = async (): Promise<boolean> => {
  const apiKey = getOpenAIApiKey();
  
  if (!apiKey) {
    return false;
  }
  
  try {
    // Simple validation - check if API key has the expected format
    // For OpenAI, keys typically start with "sk-"
    if (apiKey.startsWith('sk-') && apiKey.length > 20) {
      // In a real implementation, you would make a lightweight API call here
      // to verify the key is valid with OpenAI
      updateOpenAIApiKey(); // Update the key in the configuration
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error verifying API key:', error);
    return false;
  }
};
