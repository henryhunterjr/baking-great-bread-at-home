
/**
 * Configuration for the AI service
 */
export const AI_CONFIG = {
  apiUrl: 'https://api.youraiprovider.com/v1',
  apiKey: process.env.REACT_APP_AI_API_KEY,
  models: {
    recipeProcessor: 'recipe-processor-v1',
    recipeGenerator: 'recipe-generator-v1',
    chatAssistant: 'kitchen-assistant-v1'
  }
};
