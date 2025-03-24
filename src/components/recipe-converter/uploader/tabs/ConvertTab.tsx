
import React from 'react';
import FileUploadOptions from './convert-tab/FileUploadOptions';
import RecipeTextEditor from './convert-tab/RecipeTextEditor';
import AlertMessages from './convert-tab/components/AlertMessages';
import ConvertButton from './convert-tab/components/ConvertButton';
import RecipeHelp from './convert-tab/components/RecipeHelp';
import { useConvertTab } from './convert-tab/hooks/useConvertTab';

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

  return (
    <div className="space-y-6">
      <FileUploadOptions 
        setRecipeText={setRecipeText} 
        isConverting={isConverting}
      />
      
      <AlertMessages
        error={error}
        showSuccess={showSuccess}
        showHelpTip={showHelpTip}
        isConverting={isConverting}
      />
      
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
      
      <RecipeHelp />
    </div>
  );
};

export default ConvertTab;
