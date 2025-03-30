
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
