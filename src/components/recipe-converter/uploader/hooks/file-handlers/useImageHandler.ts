
import { useToast } from '@/hooks/use-toast';
import { logInfo, logError } from '@/utils/logger';
import { useFileProcessor, ProcessingOptions } from './useFileProcessor';

export const useImageHandler = () => {
  const { toast } = useToast();
  const { 
    isProcessing, 
    setIsProcessing, 
    processingTask, 
    cancelCurrentProcessing 
  } = useFileProcessor();
  
  const handleImageFile = async (
    file: File, 
    options: ProcessingOptions
  ): Promise<void> => {
    // Cancel any ongoing processing
    cancelCurrentProcessing();
    
    setIsProcessing(true);
    
    try {
      logInfo(`Processing image file: ${file.name} (${file.type})`);
      
      const { processImage } = await import('../../tabs/convert-tab/hooks/useImageProcessing');
      
      const task = await processImage(
        file,
        (extractedText) => {
          setIsProcessing(false);
          
          // Ensure extracted text is processed and properly formatted
          if (extractedText && extractedText.trim().length > 0) {
            // Make sure to mark this as ready for conversion
            options.onSuccess(extractedText);
          } else {
            options.onError("No text could be extracted from this image. Please try another image or format.");
          }
        },
        (error) => {
          setIsProcessing(false);
          toast({
            variant: "destructive",
            title: "OCR Error",
            description: error,
          });
          options.onError(error);
        }
      );
      
      if (task?.cancel) {
        processingTask.current = task;
      }
    } catch (error) {
      logError('Error processing image file:', { error });
      setIsProcessing(false);
      options.onError(error instanceof Error 
        ? error.message 
        : "Failed to process the image. Please try another image or format.");
    }
  };
  
  const cancelImageProcessing = (): boolean => {
    if (cancelCurrentProcessing()) {
      setIsProcessing(false);
      return true;
    }
    return false;
  };
  
  return {
    isProcessing,
    handleImageFile,
    cancelImageProcessing
  };
};
