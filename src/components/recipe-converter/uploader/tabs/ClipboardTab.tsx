
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Clipboard, Save } from 'lucide-react';
import { RecipeData } from '@/types/recipeTypes';
import { logInfo } from '@/utils/logger';

interface ClipboardTabProps {
  recipeText: string;
  handlePaste: () => Promise<void>;
  isConverting: boolean;
  onConvertRecipe: () => void;
  recipe?: RecipeData;
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
  // Determine if recipe can be saved
  const canSaveRecipe = React.useMemo(() => {
    if (!recipe) return false;
    
    const isValid = recipe.isConverted && 
      recipe.title && 
      Array.isArray(recipe.ingredients) && 
      recipe.ingredients.length > 0 && 
      Array.isArray(recipe.instructions) && 
      recipe.instructions.length > 0;
    
    return isValid;
  }, [recipe]);
  
  // Log save button state for debugging
  useEffect(() => {
    if (recipe) {
      logInfo("Save button state in ClipboardTab", {
        canSave: canSaveRecipe,
        isConverted: recipe.isConverted,
        hasTitle: !!recipe.title,
        hasIngredients: Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0,
        hasInstructions: Array.isArray(recipe.instructions) && recipe.instructions.length > 0
      });
    }
  }, [recipe, canSaveRecipe]);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">Paste from Clipboard</h3>
          <Button
            type="button"
            variant="outline"
            onClick={handlePaste}
            className="flex items-center"
          >
            <Clipboard className="mr-2 h-4 w-4" />
            Paste
          </Button>
        </div>
        
        <Textarea
          placeholder="Your recipe will appear here after pasting from clipboard..."
          value={recipeText}
          rows={10}
          className="font-mono"
          readOnly
        />
        
        <div className="flex justify-between gap-2 mt-2">
          <Button
            type="button"
            onClick={onConvertRecipe}
            disabled={!recipeText.trim() || isConverting}
            className="w-full"
          >
            {isConverting ? 'Converting...' : 'Convert Recipe'}
          </Button>
          
          {recipe?.isConverted && onSaveRecipe && (
            <Button
              type="button"
              variant="outline"
              onClick={onSaveRecipe}
              disabled={!canSaveRecipe}
              className="flex items-center"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Recipe
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClipboardTab;
