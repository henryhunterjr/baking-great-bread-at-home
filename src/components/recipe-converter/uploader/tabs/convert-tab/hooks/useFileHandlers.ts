
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { logInfo, logError } from '@/utils/logger';
import { useImageHandler } from '../../../hooks/file-handlers/useImageHandler';
import { usePDFHandler } from '../../../hooks/file-handlers/usePDFHandler';
import { useTextHandler } from '../../../hooks/file-handlers/useTextHandler';
import { useClipboard } from '../../../hooks/file-handlers/useClipboard';

interface UseFileHandlersProps {
  setRecipeText: (text: string) => void;
  onError?: (error: string | null) => void;
}

export const useFileHandlers = ({ setRecipeText, onError }: UseFileHandlersProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Import specialized hooks
  const { handleImageFile, cancelImageProcessing, isProcessing: isImageProcessing } = useImageHandler();
  const { handlePDFFile, cancelPDFProcessing, isProcessing: isPDFProcessing } = usePDFHandler();
  const { handleTextFile, isProcessing: isTextProcessing } = useTextHandler();
  const { handlePasteFromClipboard } = useClipboard();
  
  // Consolidated processing state
  const combinedProcessingState = isProcessing || isImageProcessing || isPDFProcessing || isTextProcessing;
  
  const handleError = (error: string) => {
    logError('File handling error', { error });
    
    if (onError) onError(error);
    
    toast({
      variant: "destructive",
      title: "Processing Error",
      description: error,
    });
  };
  
  const cancelProcessing = () => {
    // Try both cancellation methods - one will work depending on file type
    const canceled = cancelImageProcessing() || cancelPDFProcessing();
    
    if (canceled) {
      setIsProcessing(false);
      if (onError) onError(null); // Clear any existing errors
      
      toast({
        title: "Processing Canceled",
        description: "File processing has been canceled.",
      });
    }
    
    return canceled;
  };
  
  const handleFileSelect = async (file: File): Promise<void> => {
    try {
      // Clear any previous errors
      if (onError) onError(null);
      
      setIsProcessing(true);
      
      logInfo(`Processing file: ${file.name} (${file.type})`);
      
      const onSuccess = (text: string) => {
        // Validate extracted text
        if (!text || text.trim() === '') {
          handleError('The extracted text is empty. Please try another file or format.');
          return;
        }
        
        setRecipeText(text);
        setIsProcessing(false);
        
        toast({
          title: "Text Extracted",
          description: `Successfully extracted text from ${file.name}`,
        });
      };
      
      if (file.type.includes('image/')) {
        await handleImageFile(file, { 
          onSuccess, 
          onError: handleError 
        });
      } else if (file.type.includes('application/pdf')) {
        await handlePDFFile(file, { 
          onSuccess, 
          onError: handleError 
        });
      } else {
        // Handle text files and other formats
        await handleTextFile(file, { 
          onSuccess, 
          onError: handleError 
        });
      }
    } catch (error) {
      setIsProcessing(false);
      handleError(error instanceof Error ? error.message : String(error));
    }
  };
  
  const pasteFromClipboard = async (): Promise<void> => {
    // Clear any previous errors
    if (onError) onError(null);
    
    await handlePasteFromClipboard({
      onSuccess: (text) => {
        if (text && text.trim() !== '') {
          setRecipeText(text);
          
          toast({
            title: "Clipboard Content Pasted",
            description: "Text successfully pasted from clipboard.",
          });
        } else {
          handleError('No usable text found in clipboard.');
        }
      },
      onError: handleError
    });
  };
  
  const clearText = (): void => {
    setRecipeText('');
    if (onError) onError(null); // Clear any existing errors
    
    toast({
      title: "Text Cleared",
      description: "Recipe text has been cleared.",
    });
  };

  return {
    isProcessing: combinedProcessingState,
    handleFileSelect,
    handlePasteFromClipboard: pasteFromClipboard,
    clearText,
    cancelProcessing
  };
};
