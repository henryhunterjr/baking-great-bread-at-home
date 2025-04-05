
import { useState } from 'react';
import { logError } from '@/utils/logger';
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
  
  /**
   * Handle conversion errors and recovery attempts
   */
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
