
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Textarea } from "@/components/ui/textarea";
import ConvertButton from './components/ConvertButton';
import FileUploadOptions from './FileUploadOptions';
import RecipeHelp from './components/RecipeHelp';
import AlertMessages from './components/AlertMessages';
import { useConvertTab } from './hooks/useConvertTab';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useAIConversion } from '@/services/AIConversionService';
import { AlertCircle, Lightbulb, Ban } from 'lucide-react';
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
        
        {!hasApiKey && (
          <div className="flex items-start p-3 bg-red-50 border border-red-200 rounded-md">
            <Ban className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
            <div>
              <p className="text-sm font-medium text-red-800">
                Recipe Uploads Disabled
              </p>
              <p className="text-xs text-red-700 mt-1">
                AI recipe processing is temporarily disabled in this preview version. 
                Manual recipe entry is still available.
              </p>
            </div>
          </div>
        )}
        
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
          uploadDisabled={!hasApiKey}
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
