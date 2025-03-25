
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { logInfo } from '@/utils/logger';
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
  const { handleImageFile, cancelImageProcessing } = useImageHandler();
  const { handlePDFFile, cancelPDFProcessing } = usePDFHandler();
  const { handleTextFile } = useTextHandler();
  const { handlePasteFromClipboard } = useClipboard();
  
  const handleError = (error: string) => {
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
        setRecipeText(text);
        setIsProcessing(false);
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
      onSuccess: (text) => setRecipeText(text),
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
    isProcessing,
    handleFileSelect,
    handlePasteFromClipboard: pasteFromClipboard,
    clearText,
    cancelProcessing
  };
};
