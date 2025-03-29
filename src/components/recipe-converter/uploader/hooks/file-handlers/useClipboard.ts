
import { logInfo, logError } from '@/utils/logger';

interface ClipboardOptions {
  onSuccess: (text: string) => void;
  onError: (error: string) => void;
}

export const useClipboard = () => {
  const handlePasteFromClipboard = async (options: ClipboardOptions): Promise<void> => {
    try {
      if (!navigator.clipboard) {
        options.onError('Clipboard access is not available in your browser or requires secure context (HTTPS)');
        return;
      }
      
      logInfo('Reading text from clipboard');
      
      const clipboardText = await navigator.clipboard.readText();
      
      if (!clipboardText || clipboardText.trim().length === 0) {
        options.onError('No text found in clipboard');
        return;
      }
      
      logInfo('Successfully read text from clipboard', { 
        textLength: clipboardText.length
      });
      
      options.onSuccess(clipboardText);
    } catch (error) {
      logError('Error accessing clipboard:', { error });
      
      let errorMessage = 'Failed to access clipboard';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Clipboard permission denied. Please allow clipboard access.';
        } else if (error.name === 'SecurityError') {
          errorMessage = 'Clipboard access requires secure context (HTTPS) or localhost.';
        } else {
          errorMessage = `Clipboard error: ${error.message}`;
        }
      }
      
      options.onError(errorMessage);
    }
  };
  
  return {
    handlePasteFromClipboard
  };
};
