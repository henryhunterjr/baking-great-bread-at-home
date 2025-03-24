
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface RecipeTextEditorProps {
  recipeText: string;
  setRecipeText: (text: string) => void;
  isConverting: boolean;
}

const RecipeTextEditor: React.FC<RecipeTextEditorProps> = ({ 
  recipeText, 
  setRecipeText,
  isConverting
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="recipe-text">Recipe Text</Label>
      <Textarea
        id="recipe-text"
        placeholder="Paste or type your recipe here..."
        className="min-h-[200px] bg-white/90 dark:bg-slate-800/90 border-2 border-bread-700/40 focus:border-bread-700 focus:ring-2 focus:ring-bread-600/30 shadow-md placeholder:text-slate-500 dark:placeholder:text-slate-400"
        value={recipeText}
        onChange={(e) => setRecipeText(e.target.value)}
        disabled={isConverting}
      />
    </div>
  );
};

export default RecipeTextEditor;
