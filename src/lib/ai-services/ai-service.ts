import { RecipeData } from '@/types/recipeTypes';
import { AI_CONFIG } from './ai-config';
import { logInfo, logError } from '@/utils/logger';
import { cleanOCRText } from './text-cleaner';

export interface AIResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface BlogSearchResponse extends AIResponse {
  results?: {
    title: string;
    excerpt: string;
    link: string;
    imageUrl?: string;
  }[];
}

export interface RecipeGenerationResponse extends AIResponse {
  recipe?: RecipeData;
  error?: string;
}

class AIService {
  private static instance: AIService;
  private apiKey: string;
  private isConfigured: boolean = false;
  
  constructor() {
    this.apiKey = AI_CONFIG.openai.apiKey || '';
    this.isConfigured = !!this.apiKey;
    
    if (!this.isConfigured) {
      logError('AI Service NOT configured with API key');
    } else {
      logInfo('AI Service initialized with API key', { 
        keyPresent: !!this.apiKey, 
        keyLength: this.apiKey?.length 
      });
    }
  }
  
  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }
  
  configure(apiKey: string): void {
    if (!apiKey || apiKey.trim() === '') {
      logError('Attempted to configure AI service with empty API key');
      return;
    }
    
    this.apiKey = apiKey;
    this.isConfigured = true;
    logInfo('AI Service configured with new API key');
  }
  
  isReady(): boolean {
    return this.isConfigured && !!this.apiKey && this.apiKey.trim() !== '';
  }
  
  async searchBlog(query: string): Promise<BlogSearchResponse> {
    if (!this.isReady()) {
      return {
        success: false,
        error: 'AI service not configured with valid API key'
      };
    }
    
    try {
      const cleanQuery = query.toLowerCase()
        .replace(/do you have a/i, '')
        .replace(/can you find/i, '')
        .replace(/will you find me a/i, '')
        .replace(/find me a/i, '')
        .replace(/me/i, '')
        .replace(/please/i, '')
        .trim();
      
      logInfo('Searching blog for:', { query: cleanQuery });
      
      const fallbackResults = this.getFallbackResults(cleanQuery);
      if (fallbackResults.length > 0) {
        return {
          success: true,
          results: fallbackResults
        };
      }
      
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
              content: `Find bread recipes related to: ${cleanQuery}`
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
      
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        const jsonString = jsonMatch ? jsonMatch[0] : '[]';
        const results = JSON.parse(jsonString);
        
        return {
          success: true,
          results: results.map((result: any) => ({
            title: result.title || `Recipe for ${cleanQuery}`,
            excerpt: result.description || 'A delicious bread recipe.',
            link: result.link || '#',
            imageUrl: result.imageUrl || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a'
          }))
        };
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', parseError);
        
        if (fallbackResults.length > 0) {
          return {
            success: true,
            results: fallbackResults
          };
        }
        
        return {
          success: true,
          results: [{
            title: `${cleanQuery.charAt(0).toUpperCase() + cleanQuery.slice(1)} Recipe`,
            excerpt: `A delicious ${cleanQuery} recipe perfect for home bakers.`,
            link: '#',
            imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a'
          }]
        };
      }
    } catch (error) {
      logError('Error searching blog with AI:', { error });
      
      const fallbackResults = this.getFallbackResults(query);
      if (fallbackResults.length > 0) {
        return {
          success: true,
          results: fallbackResults
        };
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  
  private getFallbackResults(query: string): any[] {
    const cleanQuery = query.toLowerCase().trim();
    
    const fallbackRecipes: Record<string, any[]> = {
      'banana bread': [
        {
          title: 'Henry\'s Classic Banana Bread',
          excerpt: 'A moist and flavorful banana bread that\'s perfect for using up overripe bananas. This family recipe has been perfected over generations.',
          link: '/recipes/classic-banana-bread',
          imageUrl: 'https://images.unsplash.com/photo-1594086385051-a72d28c7b99a?q=80&w=1000&auto=format&fit=crop'
        },
        {
          title: 'Whole Wheat Banana Bread',
          excerpt: 'A healthier take on the classic, using whole wheat flour and less sugar while maintaining that delicious banana flavor.',
          link: '/recipes/whole-wheat-banana-bread',
          imageUrl: 'https://images.unsplash.com/photo-1585023657880-8d726c65ba4e?q=80&w=1000&auto=format&fit=crop'
        }
      ],
      'sourdough': [
        {
          title: 'Basic Sourdough Bread',
          excerpt: 'A simple and reliable sourdough recipe for beginners.',
          link: '/recipes/sourdough-basic',
          imageUrl: 'https://images.unsplash.com/photo-1585478259715-94acd1a91687?q=80&w=1000&auto=format&fit=crop'
        },
        {
          title: 'Rustic Sourdough Boule',
          excerpt: 'A rustic round loaf with a crisp crust and open crumb.',
          link: '/recipes/sourdough-boule',
          imageUrl: 'https://images.unsplash.com/photo-1559548331-f9cb98280344?q=80&w=1000&auto=format&fit=crop'
        }
      ],
      'challah': [
        {
          title: 'Traditional Challah Bread',
          excerpt: 'A beautiful braided Jewish bread that\'s slightly sweet and perfect for special occasions.',
          link: '/recipes/traditional-challah',
          imageUrl: 'https://images.unsplash.com/photo-1603818652201-1c5a3fb9aa7c?q=80&w=1000&auto=format&fit=crop'
        }
      ],
      'cinnamon roll': [
        {
          title: 'Cardamom-Infused Cinnamon Rolls',
          excerpt: 'Indulgent cinnamon rolls with a unique cardamom twist.',
          link: '/recipes/cardamom-cinnamon-rolls',
          imageUrl: '/lovable-uploads/379f3564-8f61-454c-9abe-3c7394d3794d.png'
        }
      ]
    };
    
    for (const [key, recipes] of Object.entries(fallbackRecipes)) {
      if (cleanQuery.includes(key) || key.includes(cleanQuery)) {
        return recipes;
      }
    }
    
    if (cleanQuery.includes('banana')) {
      return fallbackRecipes['banana bread'];
    }
    
    if (cleanQuery.includes('cinnamon')) {
      return fallbackRecipes['cinnamon roll'];
    }
    
    return [];
  }
  
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
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          const jsonString = jsonMatch ? jsonMatch[0] : content;
          const recipeData = JSON.parse(jsonString);
          
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
  
  async processOCRText(text: string): Promise<string> {
    if (!this.isReady()) {
      return text;
    }
    
    try {
      logInfo('Processing OCR text with AI', { textLength: text.length });
      
      return cleanOCRText(text);
    } catch (error) {
      logError('Error processing OCR text with AI:', { error });
      return text;
    }
  }
}

const aiServiceInstance = new AIService();

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

export default aiServiceInstance;
