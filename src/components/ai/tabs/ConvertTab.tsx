
import React from 'react';
import { useConvertTab } from './convert/useConvertTab';
import ConvertOptions from './convert/ConvertOptions';
import RecipeTextArea from './convert/RecipeTextArea';
import ConvertActions from './convert/ConvertActions';

interface ConvertTabProps {
  recipeText: string;
  setRecipeText: (text: string) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  setActiveTab: (tab: string) => void;
}

const ConvertTab: React.FC<ConvertTabProps> = ({
  recipeText,
  setRecipeText,
  isProcessing,
  setIsProcessing,
  setMessages,
  setActiveTab
}) => {
  const {
    fileInputRef,
    cameraInputRef,
    convertedRecipe,
    handleFileSelect,
    handleCameraCapture,
    handlePasteFromClipboard,
    clearText,
    handleConvertRecipe,
    handleSaveRecipe,
    handleDownloadPDF,
    handleDownloadText
  } = useConvertTab({
    setRecipeText,
    setIsProcessing,
    setMessages,
    setActiveTab
  });

  return (
    <div className="flex-1 p-4 space-y-6 overflow-y-auto">
      <ConvertOptions 
        fileInputRef={fileInputRef}
        cameraInputRef={cameraInputRef}
        handleFileSelect={handleFileSelect}
        handleCameraCapture={handleCameraCapture}
        handlePasteFromClipboard={handlePasteFromClipboard}
        clearText={clearText}
        hasText={!!recipeText.trim()}
      />
      
      <RecipeTextArea 
        recipeText={recipeText}
        setRecipeText={setRecipeText}
        isProcessing={isProcessing}
      />
      
      <ConvertActions 
        recipeText={recipeText}
        convertedRecipe={convertedRecipe}
        isProcessing={isProcessing}
        handleConvertRecipe={() => handleConvertRecipe(recipeText)}
        handleSaveRecipe={handleSaveRecipe}
        handleDownloadPDF={handleDownloadPDF}
        handleDownloadText={handleDownloadText}
      />
    </div>
  );
};

export default ConvertTab;
