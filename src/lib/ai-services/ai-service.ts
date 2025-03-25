
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
}

// Create a class to handle all AI interactions
class AIService {
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
  
  // Configure the service with an API key
  configure(apiKey: string): void {
    this.apiKey = apiKey;
    this.isConfigured = true;
    logInfo('AI Service configured with new API key');
  }
  
  // Check if the service is properly configured
  isReady(): boolean {
    return this.isConfigured;
  }
  
  // Search the blog for relevant content
  async searchBlog(query: string): Promise<BlogSearchResponse> {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'AI service not configured with API key'
      };
    }
    
    try {
      logInfo('Searching blog for:', { query });
      
      // This would be replaced with an actual API call to OpenAI
      // For now, we'll simulate the response
      
      // In the real implementation we would:
      // 1. Call our blog API to get relevant posts
      // 2. Send those posts + query to OpenAI for relevance ranking
      // 3. Return the most relevant results
      
      const mockResults = [
        {
          title: `Results for "${query}"`,
          excerpt: 'This is a sample result from our blog search.',
          link: '/blog/sample-post',
          imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a'
        }
      ];
      
      return {
        success: true,
        results: mockResults
      };
    } catch (error) {
      logError('Error searching blog with AI:', { error });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  
  // Process recipe text with AI to convert to structured format
  async processRecipeText(text: string): Promise<RecipeGenerationResponse> {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'AI service not configured with API key'
      };
    }
    
    try {
      logInfo('Processing recipe text with AI', { textLength: text.length });
      
      // Clean the text if it came from OCR
      const cleanedText = cleanOCRText(text);
      
      // For now, we'll simulate the response
      // In the real implementation, we would call the OpenAI API
      
      const mockRecipe: RecipeData = {
        title: 'Sample Recipe from AI',
        introduction: 'This is a sample recipe generated from your text.',
        ingredients: [
          '200g flour',
          '100ml water',
          '10g salt',
          '5g yeast'
        ],
        instructions: [
          'Mix all ingredients',
          'Knead for 10 minutes',
          'Let rise for 1 hour',
          'Bake at 450°F for 30 minutes'
        ],
        prepTime: '20 minutes',
        bakeTime: '30 minutes',
        totalTime: '2 hours',
        equipmentNeeded: [
          { id: '1', name: 'Mixing Bowl' },
          { id: '2', name: 'Dutch Oven' }
        ],
        imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a',
        tags: ['bread', 'beginner'],
        isConverted: true,
        tips: [],
        proTips: [],
        restTime: '',
        isPublic: false
      };
      
      return {
        success: true,
        recipe: mockRecipe
      };
    } catch (error) {
      logError('Error processing recipe text with AI:', { error });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  
  // Generate a recipe from a prompt
  async generateRecipe(prompt: string): Promise<RecipeGenerationResponse> {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'AI service not configured with API key'
      };
    }
    
    try {
      logInfo('Generating recipe with AI from prompt', { prompt });
      
      // For now, we'll simulate the response
      // In the real implementation, we would call the OpenAI API
      
      const mockRecipe: RecipeData = {
        title: prompt.includes('sourdough') ? 'Artisan Sourdough Bread' : 'Custom Recipe',
        introduction: `A custom recipe based on your prompt: "${prompt}"`,
        ingredients: [
          '300g flour',
          '200ml water',
          '10g salt',
          prompt.includes('sourdough') ? '100g sourdough starter' : '7g instant yeast'
        ],
        instructions: [
          'Mix all ingredients in a large bowl',
          'Knead until smooth and elastic',
          'Let rise until doubled in size',
          'Shape and place in a proofing basket',
          'Bake in a preheated oven with steam'
        ],
        prepTime: '30 minutes',
        bakeTime: '45 minutes',
        totalTime: '4 hours',
        equipmentNeeded: [
          { id: '1', name: 'Mixing Bowl' },
          { id: '2', name: 'Dutch Oven' }
        ],
        imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a',
        tags: prompt.split(' ').filter(word => word.length > 3),
        isConverted: true,
        tips: ['Make sure your starter is active if using sourdough'],
        proTips: ['For best results, use a digital scale for precise measurements'],
        restTime: '2 hours',
        isPublic: false
      };
      
      return {
        success: true,
        recipe: mockRecipe
      };
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
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'AI service not configured with API key'
      };
    }
    
    try {
      logInfo('Generating recipe with OpenAI', { prompt });
      
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
          ]
        })
      });
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
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
        
        // Convert to our RecipeData format
        const recipe: RecipeData = {
          title: recipeData.title,
          introduction: recipeData.description,
          ingredients: recipeData.ingredients,
          instructions: recipeData.steps,
          prepTime: `${recipeData.prepTime} minutes`,
          bakeTime: `${recipeData.cookTime} minutes`,
          totalTime: `${parseInt(recipeData.prepTime) + parseInt(recipeData.cookTime)} minutes`,
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
        throw new Error(`Failed to parse OpenAI response: ${parseError.message}`);
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
    if (!this.isConfigured) {
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
  return aiServiceInstance.processRecipeText(text);
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
