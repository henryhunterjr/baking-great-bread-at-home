
import { useFileHandling } from './hooks/useFileHandling';
import { useRecipeProcessing } from './hooks/useRecipeProcessing';

interface UseConvertTabProps {
  setRecipeText: (text: string) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  setActiveTab: (tab: string) => void;
}

export const useConvertTab = (props: UseConvertTabProps) => {
  const {
    fileInputRef,
    cameraInputRef,
    handleFileSelect,
    handleCameraCapture,
    handlePasteFromClipboard,
    clearText
  } = useFileHandling(props);

  const {
    convertedRecipe,
    handleConvertRecipe,
    handleSaveRecipe,
    handleDownloadPDF,
    handleDownloadText
  } = useRecipeProcessing(props);

  return {
    fileInputRef,
    cameraInputRef,
    convertedRecipe,
    handleFileSelect,
    handleCameraCapture,
    handlePasteFromClipboard: () => handlePasteFromClipboard(props.setActiveTab),
    clearText,
    handleConvertRecipe,
    handleSaveRecipe,
    handleDownloadPDF,
    handleDownloadText
  };
};
