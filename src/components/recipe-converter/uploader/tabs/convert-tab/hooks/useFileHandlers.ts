
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { logInfo } from '@/utils/logger';
import { useImageHandler } from '../../../hooks/file-handlers/useImageHandler';
import { usePDFHandler } from '../../../hooks/file-handlers/usePDFHandler';
import { useTextHandler } from '../../../hooks/file-handlers/useTextHandler';
import { useClipboard } from '../../../hooks/file-handlers/useClipboard';

interface UseFileHandlersProps {
  setRecipeText: (text: string) => void;
}

export const useFileHandlers = ({ setRecipeText }: UseFileHandlersProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Import specialized hooks
  const { handleImageFile } = useImageHandler();
  const { handlePDFFile } = usePDFHandler();
  const { handleTextFile } = useTextHandler();
  const { handlePasteFromClipboard } = useClipboard();
  
  const handleFileSelect = async (file: File): Promise<void> => {
    try {
      setIsProcessing(true);
      
      logInfo(`Processing file: ${file.name} (${file.type})`);
      
      const onSuccess = (text: string) => setRecipeText(text);
      const onError = (error: string) => {
        toast({
          variant: "destructive",
          title: "Processing Error",
          description: error,
        });
      };
      
      if (file.type.includes('image/')) {
        await handleImageFile(file, { onSuccess, onError });
      } else if (file.type.includes('application/pdf')) {
        await handlePDFFile(file, { onSuccess, onError });
      } else {
        // Handle text files and other formats
        await handleTextFile(file, { onSuccess, onError });
      }
    } finally {
      setIsProcessing(false);
    }
  };
  
  const pasteFromClipboard = async (): Promise<void> => {
    await handlePasteFromClipboard({
      onSuccess: (text) => setRecipeText(text),
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Clipboard Error",
          description: error,
        });
      }
    });
  };
  
  const clearText = (): void => {
    setRecipeText('');
    toast({
      title: "Text Cleared",
      description: "Recipe text has been cleared.",
    });
  };

  return {
    isProcessing,
    handleFileSelect,
    handlePasteFromClipboard: pasteFromClipboard,
    clearText
  };
};
