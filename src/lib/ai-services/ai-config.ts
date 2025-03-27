
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
  
  return null;
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

// Improved function to verify the API key with proper error handling
export const verifyAPIKey = async (): Promise<boolean> => {
  const apiKey = getOpenAIApiKey();
  
  if (!apiKey) {
    console.error('No API key found to verify');
    return false;
  }
  
  try {
    // Simple validation - check if API key has the expected format
    // For OpenAI, keys typically start with "sk-"
    if (!apiKey.startsWith('sk-') || apiKey.length < 20) {
      console.error('API key has invalid format');
      return false;
    }
    
    // In a production app, you might want to make a lightweight API call here
    // to verify the key is valid with OpenAI, something like:
    /*
    const response = await fetch(`${AI_CONFIG.openai.apiUrl}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error('API key verification failed with status:', response.status);
      return false;
    }
    */
    
    // Update the key in the configuration
    updateOpenAIApiKey();
    return true;
  } catch (error) {
    console.error('Error verifying API key:', error);
    return false;
  }
};

// Function to check if the OpenAI API key is valid and log detailed information
export const checkAPIKeyStatus = (): { 
  hasKey: boolean; 
  keyFormat: boolean; 
  source: string | null;
} => {
  const apiKey = getOpenAIApiKey();
  
  // Check if we have a key
  const hasKey = !!apiKey && apiKey.trim() !== '';
  
  // Check key format if we have a key
  const keyFormat = hasKey ? apiKey!.startsWith('sk-') && apiKey!.length >= 20 : false;
  
  // Determine the source of the key
  let source = null;
  if (hasKey) {
    if (import.meta.env.VITE_OPENAI_API_KEY && import.meta.env.VITE_OPENAI_API_KEY.trim() !== '') {
      source = 'environment';
    } else if (localStorage.getItem('openai_api_key') && localStorage.getItem('openai_api_key')!.trim() !== '') {
      source = 'localStorage';
    }
  }
  
  // Log detailed information about the key status
  console.log(`API Key Status: hasKey=${hasKey}, validFormat=${keyFormat}, source=${source || 'none'}`);
  
  return { hasKey, keyFormat, source };
};

// Initialize the OpenAI API key on module load
updateOpenAIApiKey();

// Log initial API key status for debugging
setTimeout(() => {
  checkAPIKeyStatus();
}, 0);
