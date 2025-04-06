
import { 
  getOpenAIApiKey, 
  configureAIKey, 
  isAIConfigured,
  verifyAPIKey,
  checkAPIKeyStatus,
  updateOpenAIApiKey
} from './key-management';

import {
  generateRecipeWithOpenAI,
  processRecipeText,
  type RecipeGenerationResponse
} from './recipe-operations';

import {
  searchBlogWithAI,
  type BlogSearchResponse
} from './blog-operations';

import {
  processOCRWithAI,
  cleanOCRText
} from './ocr-processing';

// Basic response interface
export interface AIResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Re-export types
export type { RecipeGenerationResponse, BlogSearchResponse };

/**
 * Main AI service singleton
 */
class AIService {
  private static instance: AIService;
  private isInitialized: boolean = false;
  
  constructor() {
    this.isInitialized = isAIConfigured();
    updateOpenAIApiKey();
  }
  
  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }
  
  /**
   * Configure the AI service with an API key
   */
  configure(apiKey: string): void {
    configureAIKey(apiKey);
    this.isInitialized = isAIConfigured();
  }
  
  /**
   * Check if the service is ready to use
   */
  isReady(): boolean {
    return isAIConfigured();
  }
  
  /**
   * Generate a recipe using AI
   */
  async generateRecipe(query: string): Promise<RecipeGenerationResponse> {
    // Update key first
    updateOpenAIApiKey();
    
    // First try to find recipe from blog
    try {
      const blogResult = await searchBlogWithAI(query);
      if (blogResult.success && blogResult.results && blogResult.results.length > 0) {
        return {
          success: true,
          recipe: {
            title: blogResult.results[0].title,
            introduction: blogResult.results[0].excerpt || '',
            ingredients: [],
            instructions: [],
            imageUrl: blogResult.results[0].imageUrl,
            source: blogResult.results[0].link,
            originalUrl: blogResult.results[0].link
          }
        };
      }
    } catch (error) {
      console.error('Blog search failed, falling back to AI generation', error);
    }
    
    // Fall back to OpenAI generation
    return generateRecipeWithOpenAI(query);
  }
}

// Create singleton instance
const aiServiceInstance = new AIService();

// Export key functions and main instance
export {
  configureAIKey as configureAI,
  isAIConfigured,
  searchBlogWithAI,
  generateRecipeWithOpenAI,
  processRecipeText,
  processOCRWithAI,
  verifyAPIKey,
  checkAPIKeyStatus,
  updateOpenAIApiKey,
  getOpenAIApiKey
};

// Export default instance
export default aiServiceInstance;
