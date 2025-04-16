
import { ConversionErrorType, ConversionResult } from '../types';
import { makeOpenAIRequest } from '../openai/openai-service';
import { getErrorSpecificPrompt } from '../prompt/prompt-builder';
import { parseRecipeFromText } from '../utils/recipe-parser';
import { logError, logInfo } from '@/utils/logger';

export async function handleConversionError(
  errorType: ConversionErrorType,
  originalText: string
): Promise<ConversionResult> {
  logInfo('Starting error recovery process', { errorType });
  
  try {
    const prompt = getErrorSpecificPrompt(errorType, originalText);
    const response = await makeOpenAIRequest(prompt, { temperature: 0.3 });
    const recipe = parseRecipeFromText(response.choices[0].message.content);
    
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
