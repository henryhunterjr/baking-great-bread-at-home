
import { useToast } from '@/hooks/use-toast';

export const useClipboardUtils = () => {
  const { toast } = useToast();
  
  const handlePasteFromClipboard = async (
    onSuccess: (text: string) => void,
    onError: (error: string) => void
  ): Promise<void> => {
    try {
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
      console.error('Failed to read clipboard:', error);
      onError("Unable to access clipboard. Please paste the text manually.");
      toast({
        variant: "destructive",
        title: "Clipboard Error",
        description: "Unable to access clipboard. Please paste the text manually.",
      });
    }
  };
  
  return {
    handlePasteFromClipboard
  };
};
