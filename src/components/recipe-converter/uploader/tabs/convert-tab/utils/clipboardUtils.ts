
import { useToast } from '@/hooks/use-toast';
import { logError } from '@/utils/logger';

export const useClipboardUtils = () => {
  const { toast } = useToast();
  
  const handlePasteFromClipboard = async (
    onSuccess: (text: string) => void,
    onError: (error: string) => void
  ): Promise<void> => {
    try {
      // Check if clipboard API is available
      if (!navigator.clipboard) {
        throw new Error("Clipboard access not available in this browser or context.");
      }
      
      const clipboardText = await navigator.clipboard.readText();
      
      if (clipboardText && clipboardText.trim().length > 0) {
        onSuccess(clipboardText);
        
        toast({
          title: "Text Pasted",
          description: "Recipe text pasted from clipboard.",
        });
      } else {
        onError("No text found in clipboard. Try copying some text first.");
        toast({
          variant: "destructive",
          title: "Clipboard Empty",
          description: "No text found in clipboard. Try copying some text first.",
        });
      }
    } catch (error) {
      logError('Failed to read clipboard:', error);
      
      let errorMessage = "Unable to access clipboard. ";
      
      // Add specific guidance based on error context
      if (error instanceof Error) {
        if (error.message.includes('secure context')) {
          errorMessage += "This feature requires a secure (HTTPS) connection.";
        } else if (error.message.includes('permission')) {
          errorMessage += "You may need to grant clipboard permission in your browser.";
        } else {
          errorMessage += "Please paste the text manually.";
        }
      } else {
        errorMessage += "Please paste the text manually.";
      }
      
      onError(errorMessage);
      toast({
        variant: "destructive",
        title: "Clipboard Error",
        description: errorMessage,
      });
    }
  };
  
  return {
    handlePasteFromClipboard
  };
};
