
import React from 'react';
import { useGenerateTab } from './generate/useGenerateTab';
import RecipePromptInput from './generate/RecipePromptInput';
import GeneratedRecipeCard from './generate/GeneratedRecipeCard';
import GenerateButton from './generate/GenerateButton';

interface GenerateTabProps {
  recipePrompt: string;
  setRecipePrompt: (prompt: string) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  setActiveTab: (tab: string) => void;
}

const GenerateTab: React.FC<GenerateTabProps> = ({
  recipePrompt,
  setRecipePrompt,
  isProcessing,
  setIsProcessing,
  setMessages,
  setActiveTab
}) => {
  const {
    generatedRecipe,
    isFavorite,
    handleGenerateRecipe,
    handleSaveRecipe,
    handleToggleFavorite,
    handleDownloadPDF,
    handleDownloadText
  } = useGenerateTab({
    setRecipePrompt,
    setIsProcessing,
    setMessages,
    setActiveTab
  });

  return (
    <div className="flex-1 p-4 flex flex-col h-full relative pb-20">
      <div className="flex-1 overflow-y-auto space-y-6">
        <RecipePromptInput 
          recipePrompt={recipePrompt}
          setRecipePrompt={setRecipePrompt}
          isProcessing={isProcessing}
        />
        
        {generatedRecipe && (
          <GeneratedRecipeCard 
            recipe={generatedRecipe}
            isFavorite={isFavorite}
            handleSaveRecipe={handleSaveRecipe}
            handleToggleFavorite={handleToggleFavorite}
            handleDownloadPDF={handleDownloadPDF}
            handleDownloadText={handleDownloadText}
          />
        )}
      </div>
      
      <GenerateButton 
        isProcessing={isProcessing}
        recipePrompt={recipePrompt}
        onGenerate={() => handleGenerateRecipe(recipePrompt)}
      />
    </div>
  );
};

export default GenerateTab;
