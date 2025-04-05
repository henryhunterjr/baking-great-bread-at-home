
import { useState } from 'react';
import { isOpenAIConfigured, getOpenAIApiKey } from '@/lib/ai-services/ai-config';
import { logError, logInfo } from '@/utils/logger';

// Types
export enum ConversionErrorType {
  PDF_EXTRACTION = 'pdf_extraction',
  IMAGE_PROCESSING = 'image_processing',
  FORMAT_DETECTION = 'format_detection',
  UNIT_CONVERSION = 'unit_conversion',
  PARSING_ERROR = 'parsing_error',
  UNKNOWN = 'unknown'
}

export interface ConversionResult {
  success: boolean;
  data?: any;
  error?: {
    type: ConversionErrorType;
    message: string;
    details?: any;
  };
  aiSuggestions?: {
    tips: string[];
    improvements: string[];
    alternativeMethods?: string[];
  };
}

// Service implementation
class AIConversionService {
  private static instance: AIConversionService;
  
  private constructor() {}
  
  public static getInstance(): AIConversionService {
    if (!AIConversionService.instance) {
      AIConversionService.instance = new AIConversionService();
    }
    return AIConversionService.instance;
  }
  
  // Check if API key is set
  public hasApiKey(): boolean {
    return isOpenAIConfigured();
  }
  
  // Process recipe text with AI
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
      
      // Prepare prompt based on detail level
      const prompt = options.detailed
        ? `Parse this bread recipe in detail, identifying all ingredients with quantities, instructions, and any special techniques:`
        : `Parse this bread recipe, extracting ingredients with quantities and basic instructions:`;
      
      // Make OpenAI API call
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
              content: 'You are a helpful assistant that specializes in bread baking. ' +
                'Parse recipes into structured JSON format with ingredients, quantities, units, and instructions.'
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
      const parsedRecipe = JSON.parse(data.choices[0].message.content);
      
      // Validate parsed data
      if (!parsedRecipe.ingredients || !parsedRecipe.instructions) {
        throw new Error('Failed to extract recipe structure');
      }
      
      // Generate AI suggestions
      const suggestions = await this.generateSuggestions(parsedRecipe);
      
      return {
        success: true,
        data: parsedRecipe,
        aiSuggestions: suggestions
      };
    } catch (error) {
      // Log error
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
            : 'Failed to process recipe. Please check the format and try again.'
        }
      };
    }
  }
  
  // Handle conversion errors with AI assistance
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
      let prompt = '';
      switch (errorType) {
        case ConversionErrorType.PDF_EXTRACTION:
          prompt = 'The text was extracted from a PDF but seems to be poorly formatted. ' +
            'Please try to identify any bread recipe content in the following text, even if formatting is messy:';
          break;
        case ConversionErrorType.IMAGE_PROCESSING:
          prompt = 'This text was extracted from an image using OCR and may contain errors. ' +
            'Please identify any bread recipe ingredients and instructions, correcting obvious OCR errors:';
          break;
        case ConversionErrorType.FORMAT_DETECTION:
          prompt = 'This text contains a bread recipe, but the standard format parser failed. ' +
            'Please extract ingredients, quantities, and instructions in a structured JSON format:';
          break;
        default:
          prompt = 'Please try to parse this text into a bread recipe format, ' +
            'extracting ingredients with quantities, units, and instructions:';
      }
      
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
              content: 'You are a helpful assistant that specializes in bread baking. ' +
                'You can extract recipe data even from poorly formatted or partially corrupted text. ' +
                'Generate a JSON response with the recipe structure, doing your best to infer missing information.'
            },
            { role: 'user', content: `${prompt}\n\n${originalText}` }
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
      const parsedRecipe = JSON.parse(data.choices[0].message.content);
      
      // Additional analysis for error recovery suggestions
      const recoverySuggestions = {
        tips: [
          'The recipe was recovered with AI assistance - please review for accuracy',
          'Some measurements may need adjustment based on your experience'
        ],
        improvements: [
          'Consider manually checking ingredient ratios',
          'Review instructions for completeness'
        ]
      };
      
      return {
        success: true,
        data: parsedRecipe,
        aiSuggestions: recoverySuggestions
      };
    } catch (error) {
      // Log error
      logError('AI error recovery failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        textLength: originalText.length
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
  
  // Generate suggestions based on recipe content
  private async generateSuggestions(recipe: any): Promise<{
    tips: string[];
    improvements: string[];
    alternativeMethods?: string[];
  }> {
    if (!this.hasApiKey()) {
      return {
        tips: [],
        improvements: []
      };
    }
    
    try {
      const apiKey = getOpenAIApiKey();
      
      // Make OpenAI API call for suggestions
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
              content: 'You are a master bread baker who provides insightful tips and improvements for bread recipes. ' +
                'Provide suggestions in JSON format with "tips", "improvements", and "alternativeMethods" arrays.'
            },
            { 
              role: 'user', 
              content: `Analyze this bread recipe and provide baking suggestions:\n${JSON.stringify(recipe)}` 
            }
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' }
        })
      });
      
      if (!response.ok) {
        return {
          tips: ['Check hydration levels for optimal texture'],
          improvements: ['Consider adjusting fermentation time based on room temperature']
        };
      }
      
      const data = await response.json();
      const suggestions = JSON.parse(data.choices[0].message.content);
      
      return {
        tips: suggestions.tips || [],
        improvements: suggestions.improvements || [],
        alternativeMethods: suggestions.alternativeMethods || []
      };
    } catch (error) {
      logError('Failed to generate AI suggestions', { 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      // Return default suggestions if AI generation fails
      return {
        tips: [
          'Ensure consistent hydration levels for best results',
          'Monitor fermentation based on dough behavior, not just time'
        ],
        improvements: [
          'Consider adjusting fermentation time based on room temperature',
          'Try scoring the dough differently for better oven spring'
        ]
      };
    }
  }
}

// Hook for component integration
export function useAIConversion() {
  const service = AIConversionService.getInstance();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const processRecipe = async (text: string, options = { detailed: false }): Promise<ConversionResult> => {
    setIsProcessing(true);
    
    try {
      return await service.processRecipeText(text, options);
    } catch (error) {
      logError('AI conversion failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        textLength: text.length
      });
      
      return {
        success: false,
        error: {
          type: ConversionErrorType.UNKNOWN,
          message: 'An unexpected error occurred during recipe processing.'
        }
      };
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleError = async (
    errorType: ConversionErrorType, 
    originalText: string
  ): Promise<ConversionResult> => {
    setIsProcessing(true);
    
    try {
      return await service.handleConversionError(errorType, originalText);
    } catch (error) {
      logError('Error recovery failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      return {
        success: false,
        error: {
          type: errorType,
          message: 'Unable to recover from conversion error.'
        }
      };
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    processRecipe,
    handleError,
    hasApiKey: service.hasApiKey(),
    isProcessing
  };
}

export default AIConversionService;
