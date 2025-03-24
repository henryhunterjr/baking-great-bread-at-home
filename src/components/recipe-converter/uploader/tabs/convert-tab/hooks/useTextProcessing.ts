
import { useToast } from '@/hooks/use-toast';
import { logError } from '@/utils/logger';

export const useTextProcessing = () => {
  const { toast } = useToast();
  
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string || "");
      reader.onerror = (error) => {
        logError('Error reading file as text:', error);
        reject(new Error("Failed to read file"));
      }
      reader.readAsText(file);
    });
  };

  const processTextFile = async (
    file: File,
    onSuccess: (text: string) => void,
    onError: (error: string) => void
  ): Promise<void> => {
    try {
      const text = await readFileAsText(file);
      if (text && text.trim().length > 0) {
        onSuccess(text);
        toast({
          title: "File Loaded",
          description: "Text has been successfully loaded from the file.",
        });
      } else {
        onError("The file appears to be empty. Please try another file.");
      }
    } catch (error) {
      logError('Failed to read text file:', error);
      onError("Failed to read file. Please try another format.");
    }
  };
  
  return {
    readFileAsText,
    processTextFile
  };
};
