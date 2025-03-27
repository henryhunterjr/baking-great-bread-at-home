
import React, { useState, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FileUploadOptions from './convert-tab/FileUploadOptions';
import RecipeTextEditor from './convert-tab/RecipeTextEditor';
import AlertMessages from './convert-tab/components/AlertMessages';
import ConvertButton from './convert-tab/components/ConvertButton';
import RecipeHelp from './convert-tab/components/RecipeHelp';
import { useConvertTab } from './convert-tab/hooks/useConvertTab';
import ErrorBoundary from '@/components/ErrorBoundary';

interface ConvertTabProps {
  recipeText: string;
  setRecipeText: (text: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isConverting: boolean;
  error: string | null;
}

const ConvertTab: React.FC<ConvertTabProps> = ({
  recipeText,
  setRecipeText,
  onSubmit,
  isConverting,
  error
}) => {
  const { showSuccess, showHelpTip } = useConvertTab({ recipeText });
  const [localError, setLocalError] = useState<string | null>(null);
  const localForm = useForm(); // Create a local form instance for this component
  
  // Combine local and prop errors
  const displayError = localError || error;
  
  // Reset error state
  const handleReset = useCallback(() => {
    setLocalError(null);
  }, []);

  return (
    <ErrorBoundary onReset={handleReset}>
      <div className="space-y-6">
        <FileUploadOptions 
          setRecipeText={setRecipeText} 
          isConverting={isConverting}
          onError={setLocalError}
        />
        
        <AlertMessages
          error={displayError}
          showSuccess={showSuccess}
          showHelpTip={showHelpTip}
          isConverting={isConverting}
        />
        
        <FormProvider {...localForm}>
          <form onSubmit={onSubmit}>
            <RecipeTextEditor 
              recipeText={recipeText} 
              setRecipeText={setRecipeText}
              isConverting={isConverting}
            />
            
            <ConvertButton 
              isConverting={isConverting} 
              isDisabled={!recipeText.trim()} 
            />
          </form>
        </FormProvider>
        
        <RecipeHelp />
      </div>
    </ErrorBoundary>
  );
};

export default ConvertTab;
