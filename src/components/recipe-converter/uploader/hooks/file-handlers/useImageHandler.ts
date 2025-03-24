
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
        (extractedText) => options.onSuccess(extractedText),
        (error) => {
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
      options.onError(error instanceof Error 
        ? error.message 
        : "Failed to process the image. Please try another image or format.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    isProcessing,
    handleImageFile
  };
};
