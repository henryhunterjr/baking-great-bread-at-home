
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useFormContext } from 'react-hook-form';

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
  // Access the form context (will be provided by parent)
  const formContext = useFormContext();
  
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Textarea
        placeholder="Paste your recipe here..."
        value={recipeText}
        onChange={(e) => setRecipeText(e.target.value)}
        className="min-h-[200px] w-full p-4"
        disabled={isConverting}
      />
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isConverting || !recipeText.trim()}
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
    </form>
  );
};

export default TextInputTab;
