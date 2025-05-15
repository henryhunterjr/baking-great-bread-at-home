
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useFileHandlers } from './hooks/useFileHandlers';
import FileUploadOptions from './FileUploadOptions';
import RecipeTextEditor from './RecipeTextEditor';
import { AlertMessages } from './components/AlertMessages';
import { ConvertButton } from './components/ConvertButton';
import RecipeHelp from './components/RecipeHelp';

interface ConvertTabProps {
  onConvertRecipe: (text: string) => void;
  isConverting?: boolean;
  conversionError?: string | null;
}

const ConvertTab: React.FC<ConvertTabProps> = ({
  onConvertRecipe,
  isConverting = false,
  conversionError = null,
}) => {
  const { toast } = useToast();
  const [recipeText, setRecipeText] = useState<string>('');
  const [internalError, setInternalError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Use our file handlers hook
  const { 
    isProcessing: fileProcessing, 
    handleFileSelect, 
    handlePasteFromClipboard,
    clearText,
    cancelProcessing
  } = useFileHandlers({ 
    setRecipeText, 
    onError: setInternalError
  });
  
  // Combined processing state
  const isBusy = isConverting || isProcessing || fileProcessing;
  
  // Handle convert button click
  const handleConvert = async () => {
    if (!recipeText.trim()) {
      setInternalError('Please enter a recipe to convert');
      return;
    }
    
    try {
      setIsProcessing(true);
      setInternalError(null);
      onConvertRecipe(recipeText);
    } catch (error) {
      setInternalError(error instanceof Error ? error.message : 'Failed to convert recipe');
      toast({
        variant: "destructive",
        title: "Conversion Error",
        description: error instanceof Error ? error.message : 'Failed to convert recipe',
      });
    } finally {
      // Always ensure processing state is reset
      setIsProcessing(false);
    }
  };
  
  // Get the error to display (prioritize API error over internal)
  const displayError = conversionError || internalError;
  
  return (
    <Card className="shadow-sm border">
      <CardContent className="p-6">
        <AlertMessages error={displayError} />
        
        <div className="mb-4">
          <FileUploadOptions 
            onFileSelect={handleFileSelect}
            onPasteFromClipboard={handlePasteFromClipboard}
            onClearText={clearText}
            isDisabled={isBusy}
            isProcessing={fileProcessing}
            onCancelProcessing={cancelProcessing}
          />
        </div>
        
        <RecipeTextEditor
          value={recipeText}
          onChange={setRecipeText}
          placeholder="Paste or type your recipe here... We accept recipes from websites, cookbooks, or family recipe cards."
          disabled={isBusy}
        />
        
        <div className="flex justify-between items-center mt-4">
          <RecipeHelp />
          <ConvertButton 
            onClick={handleConvert}
            isConverting={isBusy}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ConvertTab;
