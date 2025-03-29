
import { logInfo, logError } from '@/utils/logger';
import { useFileProcessor, ProcessingOptions } from './useFileProcessor';

export const useTextHandler = () => {
  const { isProcessing, setIsProcessing } = useFileProcessor();
  
  const handleTextFile = async (
    file: File, 
    options: ProcessingOptions
  ): Promise<void> => {
    setIsProcessing(true);
    
    try {
      logInfo(`Processing text file: ${file.name} (${file.type})`);
      
      // Simple text file reader
      const text = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          if (event.target?.result) {
            resolve(event.target.result as string);
          } else {
            reject(new Error('Failed to read file contents'));
          }
        };
        
        reader.onerror = (error) => {
          reject(error);
        };
        
        reader.readAsText(file);
      });
      
      if (!text || text.trim().length === 0) {
        options.onError('The file appears to be empty');
        return;
      }
      
      options.onSuccess(text);
    } catch (error) {
      logError('Error processing text file:', { error });
      options.onError(error instanceof Error 
        ? error.message 
        : 'Failed to read text file');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    isProcessing,
    handleTextFile
  };
};
