
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clipboard, Save, RefreshCw } from 'lucide-react';
import ConvertButton from '../ConvertButton';

interface ClipboardTabProps {
  recipeText: string;
  handlePaste: () => void;
  isConverting: boolean;
  onConvertRecipe: () => void;
  recipe?: any;
  onSaveRecipe?: () => void;
}

const ClipboardTab: React.FC<ClipboardTabProps> = ({ 
  recipeText, 
  handlePaste, 
  isConverting,
  onConvertRecipe,
  recipe,
  onSaveRecipe
}) => {
  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
        <Clipboard className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">Paste From Clipboard</h3>
        <p className="text-muted-foreground mb-4">
          Paste recipe text from your clipboard
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={handlePaste}
          >
            Paste From Clipboard
          </Button>
          
          {recipeText && (
            <Button
              type="button"
              variant="outline"
              onClick={() => window.location.reload()}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Try Another Recipe
            </Button>
          )}
        </div>
      </div>
      
      {recipeText && (
        <div className="mt-4 space-y-4">
          <ConvertButton 
            onClick={onConvertRecipe}
            isConverting={isConverting}
            fullWidth={true}
          />
          
          {recipe && recipe.isConverted && (
            <Button 
              onClick={onSaveRecipe}
              className="w-full flex items-center gap-2 bg-bread-800 hover:bg-bread-900"
            >
              <Save className="h-4 w-4" />
              Save Recipe To Collection
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ClipboardTab;
