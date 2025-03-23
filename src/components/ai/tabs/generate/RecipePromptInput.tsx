
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { recipeExamples } from '../../utils/data';

interface RecipePromptInputProps {
  recipePrompt: string;
  setRecipePrompt: (prompt: string) => void;
  isProcessing: boolean;
}

const RecipePromptInput: React.FC<RecipePromptInputProps> = ({
  recipePrompt,
  setRecipePrompt,
  isProcessing
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="recipe-prompt">Describe Your Ideal Recipe</Label>
        <Textarea
          id="recipe-prompt"
          placeholder="Describe the bread recipe you want me to create..."
          className="min-h-[150px] bg-white/90 dark:bg-slate-800/90 border-2 border-bread-700/40 focus:border-bread-700 focus:ring-2 focus:ring-bread-600/30 shadow-md placeholder:text-slate-500 dark:placeholder:text-slate-400"
          value={recipePrompt}
          onChange={(e) => setRecipePrompt(e.target.value)}
          disabled={isProcessing}
        />
      </div>
      
      <Alert className="bg-accent/20 border-accent">
        <AlertDescription className="text-xs">
          Be specific about ingredients, flavors, or techniques you'd like to include.
          I'll create a recipe inspired by Henry's baking philosophy that's tailored to your request!
        </AlertDescription>
      </Alert>
      
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Recipe inspiration:</p>
        <div className="flex flex-wrap gap-2">
          {recipeExamples.map((example, index) => (
            <button
              key={index}
              className="text-xs bg-secondary/80 rounded-full px-3 py-1.5 hover:bg-bread-100 transition-colors"
              onClick={() => setRecipePrompt(example)}
              disabled={isProcessing}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipePromptInput;
