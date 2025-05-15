
import { useState } from 'react';
import { logInfo, logError } from '@/utils/logger';
import { isAIConfigured } from '@/lib/ai-services/key-management';
import { ConversionResult, ConversionErrorType, ConvertedRecipe } from '@/types/unifiedRecipe';

// Service class for AI-powered recipe conversion
class AIConversionService {
  private static instance: AIConversionService;
  
  private constructor() {}
  
  public static getInstance(): AIConversionService {
    if (!AIConversionService.instance) {
      AIConversionService.instance = new AIConversionService();
    }
    return AIConversionService.instance;
  }
  
  public hasApiKey(): boolean {
    return isAIConfigured();
  }
  
  public async processRecipeText(
    text: string, 
    options = { detailed: false }
  ): Promise<ConversionResult> {
    if (!this.hasApiKey()) {
      return {
        success: false,
        error: {
          type: ConversionErrorType.API_KEY_MISSING,
          message: 'API key not configured. Please add your OpenAI API key in settings.'
        }
      };
    }
    
    try {
      // For now, we'll just return a mock response
      const mockRecipe: ConvertedRecipe = {
        name: "Sample Recipe",
        title: "Sample Recipe",
        ingredients: [
          { quantity: "500", unit: "g", name: "bread flour" },
          { quantity: "350", unit: "ml", name: "water" },
          { quantity: "10", unit: "g", name: "salt" },
          { quantity: "7", unit: "g", name: "yeast" }
        ],
        instructions: [
          "Mix all ingredients together",
          "Knead for 10 minutes",
          "Let rise for 2 hours",
          "Shape and bake at 230°C for 30 minutes"
        ],
        prepTime: "15 minutes",
        cookTime: "30 minutes",
        totalTime: "2 hours 45 minutes",
        servings: "1 loaf"
      };
      
      return {
        success: true,
        data: mockRecipe
      };
    } catch (error) {
      logError('AI processing error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        textLength: text.length
      });
      
      return {
        success: false,
        error: {
          type: ConversionErrorType.PARSING_ERROR,
          message: error instanceof Error 
            ? error.message 
            : 'Failed to process recipe. Please try a different format.'
        }
      };
    }
  }
  
  public handleConversionError(
    errorType: ConversionErrorType,
    originalText: string
  ): Promise<ConversionResult> {
    logError('Handling conversion error', { errorType, textLength: originalText.length });
    
    // Basic recovery implementation
    return Promise.resolve({
      success: false,
      error: {
        type: errorType,
        message: 'Could not process the recipe text. Please try a different format.'
      }
    });
  }
}

// Hook for using the AI conversion service
export const useAIConversion = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const service = AIConversionService.getInstance();
  
  const processRecipe = async (text: string): Promise<ConversionResult> => {
    setIsProcessing(true);
    try {
      const result = await service.processRecipeText(text);
      return result;
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleError = async (
    errorType: ConversionErrorType, 
    text: string
  ): Promise<ConversionResult> => {
    return service.handleConversionError(errorType, text);
  };
  
  return {
    hasApiKey: service.hasApiKey(),
    isProcessing,
    processRecipe,
    handleError
  };
};

export { AIConversionService, ConversionErrorType };
export type { ConversionResult };
export const ConversionService = AIConversionService; // Alias for backward compatibility
