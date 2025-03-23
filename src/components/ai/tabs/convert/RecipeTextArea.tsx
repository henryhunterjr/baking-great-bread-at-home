
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RecipeTextAreaProps {
  recipeText: string;
  setRecipeText: (text: string) => void;
  isProcessing: boolean;
}

const RecipeTextArea: React.FC<RecipeTextAreaProps> = ({
  recipeText,
  setRecipeText,
  isProcessing
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="recipe-text">Recipe Text</Label>
        <Textarea
          id="recipe-text"
          placeholder="Paste or type your recipe here..."
          className="min-h-[200px] bg-white/90 dark:bg-slate-800/90 border-2 border-bread-700/40 focus:border-bread-700 focus:ring-2 focus:ring-bread-600/30 shadow-md placeholder:text-slate-500 dark:placeholder:text-slate-400"
          value={recipeText}
          onChange={(e) => setRecipeText(e.target.value)}
          disabled={isProcessing}
        />
      </div>
      
      <Alert className="bg-accent/20 border-accent">
        <AlertDescription className="text-xs">
          Paste or upload your recipe, and I'll convert it into Henry's clear, structured format.
          I'll also suggest improvements based on Henry's baking principles. Works with handwritten recipes, photos, or text.
        </AlertDescription>
      </Alert>
    </>
  );
};

export default RecipeTextArea;
