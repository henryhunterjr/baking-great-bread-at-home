
import { useState } from 'react';
import { logError, logInfo } from '@/utils/logger';
import { AIConversionService, ConversionErrorType, ConversionResult } from './AIConversionService';

/**
 * Hook for component integration with the AI Conversion Service
 */
export function useAIConversion() {
  const service = AIConversionService.getInstance();
  const [isProcessing, setIsProcessing] = useState(false);
  
  /**
   * Process recipe text and handle state
   */
  const processRecipe = async (text: string, options = { detailed: false }): Promise<ConversionResult> => {
    if (!text || text.trim() === '') {
      return {
        success: false,
        error: {
          type: ConversionErrorType.UNKNOWN,
          message: 'No recipe text provided for processing.'
        }
      };
    }
    
    setIsProcessing(true);
    logInfo('Starting AI recipe processing', { textLength: text.length });
    
    try {
      const result = await service.processRecipeText(text, options);
      logInfo('AI processing completed', { success: result.success });
      return result;
    } catch (error) {
      logError('AI conversion failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        textLength: text.length
      });
      
      return {
        success: false,
        error: {
          type: ConversionErrorType.UNKNOWN,
          message: error instanceof Error 
            ? `AI processing error: ${error.message}` 
            : 'An unexpected error occurred during recipe processing.'
        }
      };
    } finally {
      setIsProcessing(false);
    }
  };
  
  /**
   * Handle conversion errors and recovery attempts
   */
  const handleError = async (
    errorType: ConversionErrorType, 
    originalText: string
  ): Promise<ConversionResult> => {
    if (!originalText || originalText.trim() === '') {
      return {
        success: false,
        error: {
          type: ConversionErrorType.UNKNOWN,
          message: 'No recipe text provided for error recovery.'
        }
      };
    }
    
    setIsProcessing(true);
    logInfo('Attempting AI error recovery', { errorType, textLength: originalText.length });
    
    try {
      const result = await service.handleConversionError(errorType, originalText);
      logInfo('AI error recovery completed', { success: result.success });
      return result;
    } catch (error) {
      logError('Error recovery failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      return {
        success: false,
        error: {
          type: errorType,
          message: error instanceof Error 
            ? `Recovery failed: ${error.message}` 
            : 'Unable to recover from conversion error.'
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
