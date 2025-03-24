
import { useToast } from '@/hooks/use-toast';
import { logInfo, logError } from '@/utils/logger';

interface ClipboardOptions {
  onSuccess: (text: string) => void;
  onError: (error: string) => void;
}

export const useClipboard = () => {
  const { toast } = useToast();
  
  const handlePasteFromClipboard = async (options: ClipboardOptions): Promise<void> => {
    try {
      logInfo('Attempting to paste from clipboard');
      
      const clipboardText = await navigator.clipboard.readText();
      
      if (!clipboardText.trim()) {
        const errorMsg = 'No text found in clipboard';
        logInfo(errorMsg);
        options.onError(errorMsg);
        return;
      }
      
      options.onSuccess(clipboardText);
      
      toast({
        title: "Text Pasted",
        description: "Content pasted from clipboard successfully.",
      });
    } catch (error) {
      const errorMsg = 'Unable to read clipboard. Please paste the text manually.';
      logError(errorMsg, { error });
      options.onError(errorMsg);
    }
  };
  
  return {
    handlePasteFromClipboard
  };
};
