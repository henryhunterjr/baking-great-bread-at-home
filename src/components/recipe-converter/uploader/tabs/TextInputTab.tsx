
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import ConvertButton from '../ConvertButton';

interface TextInputTabProps {
  recipeText: string;
  setRecipeText: (text: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isConverting: boolean;
}

const TextInputTab: React.FC<TextInputTabProps> = ({ 
  recipeText,
  setRecipeText,
  onSubmit,
  isConverting
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="recipe-text">Enter your recipe text</Label>
        <Textarea
          id="recipe-text"
          placeholder="Paste or type your recipe here..."
          className="min-h-[200px]"
          value={recipeText}
          onChange={(e) => setRecipeText(e.target.value)}
        />
      </div>
      
      <div className="flex justify-end">
        <ConvertButton 
          onClick={() => onSubmit({ preventDefault: () => {} } as React.FormEvent)}
          isConverting={isConverting} 
          disabled={!recipeText.trim()}
        />
      </div>
    </form>
  );
};

export default TextInputTab;
