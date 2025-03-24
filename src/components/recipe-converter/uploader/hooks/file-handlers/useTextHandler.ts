
import { useToast } from '@/hooks/use-toast';
import { logInfo, logError } from '@/utils/logger';
import { ProcessingOptions } from './useFileProcessor';

export const useTextHandler = () => {
  const { toast } = useToast();
  
  const readFileAsText = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string || "");
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };
  
  const handleTextFile = async (
    file: File, 
    options: ProcessingOptions
  ): Promise<void> => {
    try {
      logInfo(`Processing text file: ${file.name} (${file.type})`);
      
      // Simple text files don't need complex processing
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const text = await readFileAsText(file);
        if (text) {
          options.onSuccess(text);
          toast({
            title: "File Loaded",
            description: "Text has been successfully loaded from the file.",
          });
        } else {
          options.onError("The file appears to be empty. Please try another file.");
        }
      } else {
        // For other file types that might need processing
        const { processTextFile } = await import('../../tabs/convert-tab/hooks/useTextProcessing');
        
        await processTextFile(
          file,
          (text) => options.onSuccess(text),
          (error) => {
            toast({
              variant: "destructive",
              title: "File Error",
              description: error,
            });
            options.onError(error);
          }
        );
      }
    } catch (error) {
      logError('Error reading file', { error });
      options.onError("Failed to read file. Please try another format.");
    }
  };
  
  return {
    handleTextFile
  };
};
