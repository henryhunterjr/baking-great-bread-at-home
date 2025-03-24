
import { useToast } from '@/hooks/use-toast';
import { logError, logInfo } from '@/utils/logger';

export const useTextProcessing = () => {
  const { toast } = useToast();
  
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        // Check if we have valid result data
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error("Failed to read file: No data returned"));
        }
      };
      
      reader.onerror = (error) => {
        // Pass an object with error property instead of just the string
        logError('Error reading file as text:', { error });
        reject(new Error("Failed to read file: " + (error?.target as any)?.error?.message || "Unknown error"));
      };
      
      // Set a timeout to prevent hanging on large files
      const timeout = setTimeout(() => {
        reader.abort();
        reject(new Error("Reading file timed out. The file may be too large."));
      }, 30000);
      
      // Clean up the timeout if reading completes
      reader.onloadend = () => clearTimeout(timeout);
      
      // Start reading the file
      try {
        reader.readAsText(file);
      } catch (error) {
        clearTimeout(timeout);
        // Pass an object with error property instead of just the string
        logError('Exception when reading file:', { error });
        reject(new Error(`Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    });
  };

  const processTextFile = async (
    file: File,
    onSuccess: (text: string) => void,
    onError: (error: string) => void
  ): Promise<void> => {
    logInfo('Processing text file:', { fileName: file.name });
    
    try {
      const text = await readFileAsText(file);
      
      if (text && text.trim().length > 0) {
        // Clean up the text a bit - remove extra whitespace, normalize line endings
        const cleanedText = text
          .replace(/\r\n/g, '\n')
          .replace(/\n{3,}/g, '\n\n')
          .replace(/[ \t]+/g, ' ')
          .trim();
        
        onSuccess(cleanedText);
        
        toast({
          title: "File Loaded",
          description: "Text has been successfully loaded from the file.",
        });
      } else {
        onError("The file appears to be empty. Please try another file.");
        
        toast({
          variant: "destructive",
          title: "Empty File",
          description: "The file appears to be empty. Please try another file.",
        });
      }
    } catch (error) {
      // Pass an object with error property instead of just a string
      logError('Failed to read text file:', { error });
      
      const errorMessage = error instanceof Error
        ? `Failed to read file: ${error.message}`
        : "Failed to read file. Please try another format.";
      
      onError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "File Error",
        description: errorMessage,
      });
    }
  };
  
  return {
    readFileAsText,
    processTextFile
  };
};
