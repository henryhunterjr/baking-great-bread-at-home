
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FileUploadOptions from './convert-tab/FileUploadOptions';
import RecipeTextEditor from './convert-tab/RecipeTextEditor';
import ConvertButton from '../ConvertButton';

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
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FileUploadOptions 
        setRecipeText={setRecipeText}
        isConverting={isConverting}
      />
      
      <RecipeTextEditor
        recipeText={recipeText}
        setRecipeText={setRecipeText}
        isConverting={isConverting}
      />
      
      <Alert className="bg-accent/20 border-accent">
        <AlertDescription className="text-xs">
          Paste or upload your recipe, and it will be converted into a clear, structured format.
          The converter works with handwritten recipes, photos, or text.
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-end">
        <ConvertButton 
          onClick={() => onSubmit({ preventDefault: () => {} } as React.FormEvent)}
          isConverting={isConverting} 
          disabled={!recipeText.trim()}
          fullWidth={true}
        />
      </div>
    </form>
  );
};

export default ConvertTab;
