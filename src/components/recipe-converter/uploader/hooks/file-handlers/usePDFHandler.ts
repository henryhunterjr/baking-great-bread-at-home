
import { useToast } from '@/hooks/use-toast';
import { logInfo, logError } from '@/utils/logger';
import { useFileProcessor, ProcessingOptions } from './useFileProcessor';

export const usePDFHandler = () => {
  const { toast } = useToast();
  const { 
    isProcessing, 
    setIsProcessing, 
    processingTask, 
    cancelCurrentProcessing 
  } = useFileProcessor();
  
  const handlePDFFile = async (
    file: File, 
    options: ProcessingOptions
  ): Promise<void> => {
    // Cancel any ongoing processing
    cancelCurrentProcessing();
    
    setIsProcessing(true);
    
    try {
      logInfo(`Processing PDF file: ${file.name} (${file.type})`);
      
      const { processPDF } = await import('../../tabs/convert-tab/hooks/usePDFProcessing');
      
      const task = await processPDF(
        file,
        (extractedText) => options.onSuccess(extractedText),
        (error) => {
          toast({
            variant: "destructive",
            title: "PDF Error",
            description: error,
          });
          options.onError(error);
        }
      );
      
      if (task?.cancel) {
        processingTask.current = task;
      }
    } catch (error) {
      logError('Error processing PDF file:', { error });
      options.onError(error instanceof Error 
        ? error.message 
        : "Failed to process the PDF. Please try another file or format.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    isProcessing,
    handlePDFFile
  };
};
