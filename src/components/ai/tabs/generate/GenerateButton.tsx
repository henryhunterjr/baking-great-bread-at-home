
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';

interface GenerateButtonProps {
  isProcessing: boolean;
  recipePrompt: string;
  onGenerate: () => void;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({
  isProcessing,
  recipePrompt,
  onGenerate
}) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-sm border-t">
      <Button 
        onClick={onGenerate}
        disabled={!recipePrompt.trim() || isProcessing}
        className="w-full bg-bread-800 hover:bg-bread-700 shadow-md"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Recipe...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Recipe
          </>
        )}
      </Button>
    </div>
  );
};

export default GenerateButton;
