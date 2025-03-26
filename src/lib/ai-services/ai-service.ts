
import { RecipeData } from '@/types/recipeTypes';
import { AI_CONFIG } from './ai-config';
import { logInfo, logError } from '@/utils/logger';
import { cleanOCRText } from './text-cleaner';

// Interface for AI service responses
export interface AIResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Blog search response
export interface BlogSearchResponse extends AIResponse {
  results?: {
    title: string;
    excerpt: string;
    link: string;
    imageUrl?: string;
  }[];
}

// Recipe generation response
export interface RecipeGenerationResponse extends AIResponse {
  recipe?: RecipeData;
  error?: string;
}

// Create a class to handle all AI interactions
class AIService {
  private static instance: AIService;
  private apiKey: string;
  private isConfigured: boolean = false;
  
  constructor() {
    this.apiKey = AI_CONFIG.openai.apiKey || '';
    this.isConfigured = !!this.apiKey;
    
    if (!this.isConfigured) {
      logInfo('AI Service not configured with API key');
    } else {
      logInfo('AI Service initialized with API key');
    }
  }
  
  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }
  
  // Configure the service with an API key
  configure(apiKey: string): void {
    if (!apiKey || apiKey.trim() === '') {
      logError('Attempted to configure AI service with empty API key');
      return;
    }
    
    this.apiKey = apiKey;
    this.isConfigured = true;
    logInfo('AI Service configured with new API key');
  }
  
  // Check if the service is properly configured
  isReady(): boolean {
    return this.isConfigured && !!this.apiKey && this.apiKey.trim() !== '';
  }
  
  // Search the blog for relevant content
  async searchBlog(query: string): Promise<BlogSearchResponse> {
    if (!this.isReady()) {
      return {
        success: false,
        error: 'AI service not configured with valid API key'
      };
    }
    
    try {
      logInfo('Searching blog for:', { query });
      
      // Real OpenAI call for blog search
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: AI_CONFIG.openai.model,
          messages: [
            {
              role: 'system',
              content: 'You are an assistant that searches for bread recipes. Return a simple JSON array of up to 3 most relevant recipes matching the query.'
            },
            {
              role: 'user',
              content: `Find bread recipes related to: ${query}`
            }
          ],
          temperature: 0.5,
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error (${response.status}): ${errorData.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      // Parse results from OpenAI
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        const jsonString = jsonMatch ? jsonMatch[0] : '[]';
        const results = JSON.parse(jsonString);
        
        return {
          success: true,
          results: results.map((result: any) => ({
            title: result.title || `Recipe for ${query}`,
            excerpt: result.description || 'A delicious bread recipe.',
            link: result.link || '#',
            imageUrl: result.imageUrl || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a'
          }))
        };
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', parseError);
        // Fallback response
        return {
          success: true,
          results: [{
            title: `${query.charAt(0).toUpperCase() + query.slice(1)} Recipe`,
            excerpt: `A delicious ${query} recipe perfect for home bakers.`,
            link: '#',
            imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a'
          }]
        };
      }
    } catch (error) {
      logError('Error searching blog with AI:', { error });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  
  // Generate a recipe from a prompt
  async generateRecipe(prompt: string): Promise<RecipeGenerationResponse> {
    if (!this.isReady()) {
      return {
        success: false,
        error: 'AI service not configured with valid API key'
      };
    }
    
    if (!prompt || prompt.trim() === '') {
      return {
        success: false,
        error: 'No prompt provided for recipe generation'
      };
    }
    
    try {
      logInfo('Generating recipe with AI from prompt', { prompt });
      
      return this.generateRecipeWithOpenAI(prompt);
    } catch (error) {
      logError('Error generating recipe with AI:', { error });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  
  // Integrate with OpenAI
  async generateRecipeWithOpenAI(prompt: string): Promise<RecipeGenerationResponse> {
    if (!this.isReady()) {
      return {
        success: false,
        error: 'AI service not configured with valid API key'
      };
    }
    
    if (!prompt || prompt.trim() === '') {
      return {
        success: false,
        error: 'No prompt provided for recipe generation'
      };
    }
    
    try {
      logInfo('Generating recipe with OpenAI', { prompt });
      
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: AI_CONFIG.openai.model,
            messages: [
              {
                role: 'system',
                content: `You are a professional baker specialized in creating detailed bread recipes. 
                Format your response as a JSON object with the following structure:
                {
                  "title": "Recipe name",
                  "description": "Brief introduction to the recipe",
                  "ingredients": ["ingredient 1", "ingredient 2", ...],
                  "steps": ["step 1", "step 2", ...],
                  "prepTime": "preparation time in minutes",
                  "cookTime": "cooking/baking time in minutes",
                  "tips": ["tip 1", "tip 2", ...],
                  "tags": ["tag1", "tag2", ...]
                }
                Do not include any explanations or markdown, just the JSON object.`
              },
              {
                role: 'user',
                content: `Create a detailed bread recipe for: ${prompt}`
              }
            ],
            temperature: 0.7
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const statusText = response.statusText || 'Unknown error';
          throw new Error(`OpenAI API error (${response.status}): ${statusText}. ${errorData.error?.message || ''}`);
        }
        
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        
        if (!content) {
          throw new Error('No content returned from OpenAI');
        }
        
        try {
          // Extract the JSON from the response
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          const jsonString = jsonMatch ? jsonMatch[0] : content;
          const recipeData = JSON.parse(jsonString);
          
          // Convert to our RecipeData format with defaults
          const recipe: RecipeData = {
            title: recipeData.title || 'New Recipe',
            introduction: recipeData.description || '',
            ingredients: recipeData.ingredients || [],
            instructions: recipeData.steps || [],
            prepTime: recipeData.prepTime ? `${recipeData.prepTime} minutes` : '',
            bakeTime: recipeData.cookTime ? `${recipeData.cookTime} minutes` : '',
            totalTime: recipeData.prepTime && recipeData.cookTime ? 
              `${parseInt(recipeData.prepTime) + parseInt(recipeData.cookTime)} minutes` : '',
            tips: recipeData.tips || [],
            proTips: [],
            equipmentNeeded: [],
            imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a',
            tags: recipeData.tags || [],
            isConverted: true,
            restTime: '',
            isPublic: false
          };
          
          return {
            success: true,
            recipe
          };
        } catch (parseError) {
          logError('Failed to parse OpenAI response:', { error: parseError, content });
          throw new Error(`Failed to parse OpenAI response: ${parseError.message}`);
        }
      } catch (apiError) {
        logError('OpenAI API error:', { error: apiError });
        throw new Error(`OpenAI API error: ${apiError.message}`);
      }
    } catch (error) {
      logError('Error generating recipe with OpenAI:', { error });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  
  // Process OCR results from images
  async processOCRText(text: string): Promise<string> {
    if (!this.isReady()) {
      return text;
    }
    
    try {
      logInfo('Processing OCR text with AI', { textLength: text.length });
      
      // For now, we'll just clean up the text
      // In the real implementation, we would send this to OpenAI for further processing
      return cleanOCRText(text);
    } catch (error) {
      logError('Error processing OCR text with AI:', { error });
      return text;
    }
  }
}

// Create singleton instance
const aiServiceInstance = new AIService();

// Export helper functions for easier use
export const configureAI = (apiKey: string): void => {
  aiServiceInstance.configure(apiKey);
};

export const isAIConfigured = (): boolean => {
  return aiServiceInstance.isReady();
};

export const searchBlogWithAI = async (query: string): Promise<BlogSearchResponse> => {
  return aiServiceInstance.searchBlog(query);
};

export const processRecipeText = async (text: string): Promise<RecipeGenerationResponse> => {
  // This is just a wrapper for generateRecipeWithOpenAI with text as input
  return aiServiceInstance.generateRecipeWithOpenAI(text);
};

export const generateRecipe = async (prompt: string): Promise<RecipeGenerationResponse> => {
  return aiServiceInstance.generateRecipe(prompt);
};

export const generateRecipeWithOpenAI = async (prompt: string): Promise<RecipeGenerationResponse> => {
  return aiServiceInstance.generateRecipeWithOpenAI(prompt);
};

export const processOCRWithAI = async (text: string): Promise<string> => {
  return aiServiceInstance.processOCRText(text);
};

// Export the service instance for direct access if needed
export default aiServiceInstance;
