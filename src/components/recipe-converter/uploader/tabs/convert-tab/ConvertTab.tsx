
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import ConvertButton from './components/ConvertButton';
import FileUploadOptions from './FileUploadOptions';
import RecipeHelp from './components/RecipeHelp';
import AlertMessages from './components/AlertMessages';
import { useConvertTab } from './hooks/useConvertTab';

interface ConvertTabProps {
  recipeText: string;
  setRecipeText: (text: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isConverting: boolean;
  error?: string | null;
}

const ConvertTab: React.FC<ConvertTabProps> = ({
  recipeText,
  setRecipeText,
  onSubmit,
  isConverting,
  error
}) => {
  const formContext = useFormContext();
  const { showSuccess, showHelpTip } = useConvertTab({ recipeText });
  
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <AlertMessages 
        showSuccess={showSuccess} 
        error={error} 
      />
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="recipe-text" className="text-sm font-medium">
            Recipe Text
          </label>
          {recipeText && (
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setRecipeText('')}
            >
              Clear
            </button>
          )}
        </div>
        
        <Textarea
          id="recipe-text"
          placeholder="Paste your recipe here or use one of the upload options below..."
          value={recipeText}
          onChange={(e) => setRecipeText(e.target.value)}
          className="min-h-[200px] w-full p-4 resize-y"
          disabled={isConverting}
        />
      </div>
      
      {!recipeText && showHelpTip && (
        <RecipeHelp />
      )}
      
      <FileUploadOptions 
        recipeText={recipeText} 
        setRecipeText={setRecipeText} 
        isProcessing={isConverting}
      />
      
      <ConvertButton 
        isConverting={isConverting} 
        isDisabled={!recipeText.trim()}
      />
    </form>
  );
};

export default ConvertTab;
