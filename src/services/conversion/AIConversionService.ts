
import { isOpenAIConfigured } from '@/lib/ai-services/ai-config';
import { logError, logInfo } from '@/utils/logger';
import { makeOpenAIRequest } from './openai/openai-service';
import { buildRecipePrompt } from './prompt/prompt-builder';
import { handleConversionError } from './error/error-handler';
import { parseRecipeFromText } from './utils/recipe-parser';
import { ConversionResult, ConversionErrorType } from './types';
import { generateSuggestions } from './AIRecommendationService';

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
    return isOpenAIConfigured();
  }
  
  public async processRecipeText(
    text: string, 
    options = { detailed: false }
  ): Promise<ConversionResult> {
    if (!this.hasApiKey()) {
      return {
        success: false,
        error: {
          type: ConversionErrorType.UNKNOWN,
          message: 'API key not configured. Please add your OpenAI API key in settings.'
        }
      };
    }
    
    try {
      const prompt = buildRecipePrompt(text, options);
      const response = await makeOpenAIRequest(prompt);
      const recipe = parseRecipeFromText(response.choices[0].message.content);
      
      if (!recipe) {
        throw new Error('Failed to parse recipe from AI response');
      }
      
      const suggestions = await generateSuggestions(recipe);
      
      return {
        success: true,
        data: recipe,
        aiSuggestions: suggestions
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

  public handleConversionError = handleConversionError;
}

export { AIConversionService, ConversionErrorType };
export type { ConversionResult };
