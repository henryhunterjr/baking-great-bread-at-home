
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { logInfo } from '@/utils/logger';
import { useImageProcessing } from './useImageProcessing';
import { usePDFProcessing } from './usePDFProcessing';
import { useTextProcessing } from './useTextProcessing';
import { useClipboardUtils } from '../utils/clipboardUtils';

interface UseFileHandlersProps {
  setRecipeText: (text: string) => void;
}

export const useFileHandlers = ({ setRecipeText }: UseFileHandlersProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Import specialized hooks
  const { processImage } = useImageProcessing();
  const { processPDF } = usePDFProcessing();
  const { processTextFile } = useTextProcessing();
  const { handlePasteFromClipboard } = useClipboardUtils();
  
  // Track any ongoing processing task to allow cancellation
  const processingTask = useRef<{ cancel?: () => void } | null>(null);

  const cancelCurrentProcessing = () => {
    if (processingTask.current?.cancel) {
      processingTask.current.cancel();
      processingTask.current = null;
      logInfo("Cancelled current processing task");
    }
  };

  const handleImageFile = async (file: File): Promise<void> => {
    // Cancel any ongoing processing
    cancelCurrentProcessing();
    
    setIsProcessing(true);
    
    try {
      const task = await processImage(
        file,
        (extractedText) => setRecipeText(extractedText),
        (error) => {
          toast({
            variant: "destructive",
            title: "OCR Error",
            description: error,
          });
          throw new Error(error);
        }
      );
      
      if (task?.cancel) {
        processingTask.current = task;
      }
    } catch (error) {
      // Error is already handled in processImage
    } finally {
      setIsProcessing(false);
      if (!processingTask.current?.cancel) {
        processingTask.current = null;
      }
    }
  };
  
  const handlePDFFile = async (file: File): Promise<void> => {
    // Cancel any ongoing processing
    cancelCurrentProcessing();
    
    setIsProcessing(true);
    
    try {
      const task = await processPDF(
        file,
        (extractedText) => setRecipeText(extractedText),
        (error) => {
          toast({
            variant: "destructive",
            title: "PDF Error",
            description: error,
          });
          throw new Error(error);
        }
      );
      
      if (task?.cancel) {
        processingTask.current = task;
      }
    } catch (error) {
      // Error is already handled in processPDF
    } finally {
      setIsProcessing(false);
      if (!processingTask.current?.cancel) {
        processingTask.current = null;
      }
    }
  };
  
  const handleFileSelect = async (file: File): Promise<void> => {
    try {
      setIsProcessing(true);
      
      logInfo(`Processing file: ${file.name} (${file.type})`);
      
      if (file.type.includes('image/')) {
        await handleImageFile(file);
      } else if (file.type.includes('application/pdf')) {
        await handlePDFFile(file);
      } else {
        // Handle text files and other formats
        await processTextFile(
          file,
          (text) => setRecipeText(text),
          (error) => {
            toast({
              variant: "destructive",
              title: "File Error",
              description: error,
            });
          }
        );
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        variant: "destructive",
        title: "Processing Error",
        description: error instanceof Error 
          ? error.message
          : "Failed to process the file. Please try another file or format.",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const pasteFromClipboard = async (): Promise<void> => {
    await handlePasteFromClipboard(
      (text) => setRecipeText(text),
      (error) => {
        toast({
          variant: "destructive",
          title: "Clipboard Error",
          description: error,
        });
      }
    );
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
    clearText,
    cancelCurrentProcessing
  };
};
