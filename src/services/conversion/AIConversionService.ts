
import { isOpenAIConfigured, getOpenAIApiKey } from '@/lib/ai-services/ai-config';
import { logError, logInfo } from '@/utils/logger';
import { parseRecipeFromText } from './utils/recipe-parser';
import { ConversionResult, ConversionErrorType } from './types';
import { generateSuggestions } from './AIRecommendationService';

/**
 * Service for AI-powered recipe conversion
 */
class AIConversionService {
  private static instance: AIConversionService;
  
  private constructor() {}
  
  public static getInstance(): AIConversionService {
    if (!AIConversionService.instance) {
      AIConversionService.instance = new AIConversionService();
    }
    return AIConversionService.instance;
  }
  
  /**
   * Check if API key is configured
   */
  public hasApiKey(): boolean {
    return isOpenAIConfigured();
  }
  
  /**
   * Process recipe text with AI
   */
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
      const apiKey = getOpenAIApiKey();
      
      // Enhanced prompt based on detail level
      const prompt = options.detailed
        ? 'Structure this recipe with explicit quantities, detailed instructions, and any special techniques:'
        : 'Convert this recipe text into a structured format with quantities and basic steps:';
      
      // Make OpenAI API call with improved context
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a culinary assistant specializing in structuring recipes. ' +
                'Format recipes with clear ingredients, quantities, and step-by-step instructions.'
            },
            { role: 'user', content: `${prompt}\n\n${text}` }
          ],
          temperature: 0.3,
          response_format: { type: 'json_object' }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API call failed');
      }
      
      const data = await response.json();
      const recipe = parseRecipeFromText(data.choices[0].message.content);
      
      if (!recipe) {
        throw new Error('Failed to parse recipe from AI response');
      }
      
      // Generate AI suggestions
      const suggestions = await generateSuggestions(recipe);
      
      logInfo('Recipe processed successfully', { 
        hasTitle: !!recipe.title,
        ingredientsCount: recipe.ingredients.length
      });
      
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
  
  /**
   * Handle conversion errors with AI assistance
   */
  public async handleConversionError(
    errorType: ConversionErrorType,
    originalText: string
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
      const apiKey = getOpenAIApiKey();
      
      // Create error-specific prompt
      const prompt = this.getErrorSpecificPrompt(errorType, originalText);
      
      // Make OpenAI API call with error-handling prompt
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a recipe parsing expert that can handle problematic inputs. ' +
                'Extract recipe data even from poorly formatted or partial text.'
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          response_format: { type: 'json_object' }
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI assistance for error recovery');
      }
      
      const data = await response.json();
      const recipe = parseRecipeFromText(data.choices[0].message.content);
      
      if (!recipe) {
        throw new Error('Failed to recover recipe data');
      }
      
      return {
        success: true,
        data: recipe,
        aiSuggestions: {
          tips: ['Recipe recovered with AI assistance - please review for accuracy'],
          improvements: ['Consider checking ingredient quantities']
        }
      };
      
    } catch (error) {
      logError('Error recovery failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        errorType
      });
      
      return {
        success: false,
        error: {
          type: errorType,
          message: 'Unable to recover recipe data. Please try manual entry.'
        }
      };
    }
  }
  
  /**
   * Get error-specific prompts for better handling
   */
  private getErrorSpecificPrompt(errorType: ConversionErrorType, text: string): string {
    switch (errorType) {
      case ConversionErrorType.PDF_EXTRACTION:
        return `This text was extracted from a PDF but may be poorly formatted. Please identify any recipe content and structure it properly:\n\n${text}`;
      case ConversionErrorType.IMAGE_PROCESSING:
        return `This text came from OCR and may have errors. Please extract and correct recipe content:\n\n${text}`;
      case ConversionErrorType.FORMAT_DETECTION:
        return `The standard parser failed with this text. Please extract recipe data in a structured format:\n\n${text}`;
      default:
        return `Please try to parse this text into a recipe format with ingredients and instructions:\n\n${text}`;
    }
  }
}

export { AIConversionService, ConversionErrorType };
export type { ConversionResult };
