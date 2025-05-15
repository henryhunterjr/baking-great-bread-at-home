
import { useState } from 'react';
import { AIConversionService as ConversionService, ConversionErrorType, ConversionResult } from './conversion/AIConversionService';

// Export the service and error type
export { ConversionErrorType };
export { ConversionService };

// Hook for using the AI conversion service
export const useAIConversion = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const service = ConversionService.getInstance();
  
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
