
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { logError, logInfo } from '@/utils/logger';

export const useTextProcessing = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const processTextFile = async (
    file: File,
    onSuccess: (text: string) => void,
    onError: (error: string) => void
  ): Promise<{ cancel: () => void } | null> => {
    const reader = new FileReader();
    let isCancelled = false;
    
    try {
      setIsProcessing(true);
      
      toast({
        title: "Processing Text File",
        description: "Reading your text file...",
      });
      
      logInfo('Starting to read text file', { filename: file.name, size: file.size });
      
      const readPromise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          if (reader.result) {
            resolve(reader.result as string);
          } else {
            reject(new Error("Failed to read file content"));
          }
        };
        
        reader.onerror = () => {
          reject(new Error("Error reading file"));
        };
        
        reader.readAsText(file);
      });
      
      // Add timeout protection
      const text = await Promise.race([
        readPromise,
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('File reading timed out')), 30000)
        )
      ]);
      
      if (isCancelled) return null;
      
      logInfo('Successfully read text file', { contentLength: text.length });
      
      onSuccess(text);
      
      toast({
        title: "Text Extracted",
        description: "Successfully read your text file.",
      });
      
      return {
        cancel: () => {
          isCancelled = true;
          reader.abort();
          logInfo('Text processing cancelled', { filename: file.name });
        }
      };
    } catch (error) {
      logError('Failed to process text file', { error });
      
      if (!isCancelled) {
        onError(error instanceof Error 
          ? `Failed to read text file: ${error.message}`
          : "Failed to read text file: Unknown error");
        
        toast({
          variant: "destructive",
          title: "Error Processing File",
          description: "Could not read the text file. Please try again or use a different file.",
        });
      }
      
      return null;
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    isProcessing,
    processTextFile
  };
};
