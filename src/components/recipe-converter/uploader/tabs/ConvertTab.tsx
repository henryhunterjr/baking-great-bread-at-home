
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Textarea } from "@/components/ui/textarea";
import ConvertButton from './convert-tab/components/ConvertButton';
import FileUploadOptions from './convert-tab/FileUploadOptions';
import RecipeHelp from './convert-tab/components/RecipeHelp';
import AlertMessages from './convert-tab/components/AlertMessages';
import { useConvertTab } from './convert-tab/hooks/useConvertTab';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useAIConversion } from '@/services/AIConversionService';
import { AlertCircle, Lightbulb } from 'lucide-react';
import { useBreakpoint } from '@/hooks/use-media-query';

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
  const [localError, setLocalError] = useState<string | null>(null);
  const { hasApiKey } = useAIConversion();
  const isMobile = useBreakpoint('smDown');
  
  // Combine local and prop errors
  const displayError = localError || error;
  
  return (
    <ErrorBoundary>
      <form onSubmit={onSubmit} className="space-y-4">
        <AlertMessages 
          showSuccess={showSuccess} 
          error={displayError} 
          showHelpTip={showHelpTip}
          isConverting={isConverting}
        />
        
        {hasApiKey && (
          <div className="flex items-start p-3 bg-green-50 border border-green-100 rounded-md">
            <Lightbulb className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
            <div>
              <p className="text-sm text-green-800">
                AI recipe assistant enabled! Paste your recipe and we'll analyze it to provide bread-specific tips and improvements.
              </p>
            </div>
          </div>
        )}
        
        {!hasApiKey && (
          <div className="flex items-start p-3 bg-amber-50 border border-amber-100 rounded-md">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
            <div>
              <p className="text-sm text-amber-800">
                Add your OpenAI API key in Settings to enable AI-powered recipe analysis and get baking tips specific to your recipe.
              </p>
            </div>
          </div>
        )}
        
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
            placeholder={isMobile ? "Paste your recipe here..." : "Paste your recipe here or use one of the upload options below..."}
            value={recipeText}
            onChange={(e) => setRecipeText(e.target.value)}
            className={`${isMobile ? 'min-h-[150px]' : 'min-h-[200px]'} w-full p-4 resize-y`}
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
    </ErrorBoundary>
  );
};

export default ConvertTab;
