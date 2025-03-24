
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronRight } from 'lucide-react';
import FileUploadOptions from './convert-tab/FileUploadOptions';
import RecipeTextEditor from './convert-tab/RecipeTextEditor';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  const [showSuccess, setShowSuccess] = useState(false);
  const [showHelpTip, setShowHelpTip] = useState(false);
  
  // Show success message when text is extracted from an image or PDF
  useEffect(() => {
    if (recipeText.trim().length > 50) {
      setShowSuccess(true);
      
      // Auto-hide success after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [recipeText]);
  
  // Show help tip if recipe text is empty
  useEffect(() => {
    if (!recipeText.trim()) {
      // Show tip after 2 seconds
      const timer = setTimeout(() => {
        setShowHelpTip(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      setShowHelpTip(false);
    }
  }, [recipeText]);

  return (
    <div className="space-y-6">
      <FileUploadOptions 
        setRecipeText={setRecipeText} 
        isConverting={isConverting}
      />
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {showSuccess && (
        <Alert className="mb-4 bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800">
          <AlertTitle className="text-green-800 dark:text-green-300">Text Extracted</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-400">
            Text has been successfully extracted. You can now edit it before converting to a recipe.
          </AlertDescription>
        </Alert>
      )}
      
      {showHelpTip && !isConverting && !error && (
        <Alert className="mb-4 bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-800">
          <AlertTitle className="text-blue-800 dark:text-blue-300">Getting Started</AlertTitle>
          <AlertDescription className="text-blue-700 dark:text-blue-400">
            Upload a recipe image or PDF, take a photo, or paste text from your clipboard using the options above.
          </AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={onSubmit}>
        <RecipeTextEditor 
          recipeText={recipeText} 
          setRecipeText={setRecipeText}
          isConverting={isConverting}
        />
        
        <div className="flex justify-end mt-4">
          <Button 
            type="submit" 
            disabled={isConverting || !recipeText.trim()} 
            className="bg-bread-800 hover:bg-bread-900 text-white"
          >
            {isConverting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                Convert Recipe
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
      
      <div className="text-xs text-muted-foreground mt-4 bg-muted/50 p-3 rounded-md">
        <p className="font-medium mb-1">🔍 Where to find your converted recipes:</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>After converting, you'll see your recipe in the main view</li>
          <li>Click "Save Recipe" to store it permanently</li>
          <li>Saved recipes appear in the "My Recipes" tab on the right side</li>
        </ol>
      </div>
    </div>
  );
};

export default ConvertTab;
