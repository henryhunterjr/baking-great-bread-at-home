
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
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
          <AlertTitle className="text-green-800 dark:text-green-300">Image Processed</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-400">
            Text has been successfully extracted. You can now edit it before converting.
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
              'Convert Recipe'
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
