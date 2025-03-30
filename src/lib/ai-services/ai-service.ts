
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
