
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import { recipeExamples } from '../utils/data';
import { handleGenerateRecipe } from '../utils/helpers';

interface GenerateTabProps {
  recipePrompt: string;
  setRecipePrompt: (prompt: string) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  setActiveTab: (tab: string) => void;
}

const GenerateTab: React.FC<GenerateTabProps> = ({
  recipePrompt,
  setRecipePrompt,
  isProcessing,
  setIsProcessing,
  setMessages,
  setActiveTab
}) => {
  const { toast } = useToast();
  
  const handleGenerateRecipeClick = async () => {
    if (!recipePrompt.trim()) {
      toast({
        variant: "destructive",
        title: "Empty Prompt",
        description: "Please describe the recipe you want to generate.",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const response = await handleGenerateRecipe(recipePrompt);
      
      if (!response.success || !response.recipe) {
        throw new Error("Failed to generate recipe");
      }
      
      const recipe = response.recipe;
      
      setRecipePrompt('');
      
      const assistantMessage = {
        role: 'assistant',
        content: `I've generated a recipe for "${recipe.title}" based on your request for "${recipePrompt}". You can find it in your saved recipes.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      toast({
        title: "Recipe Generated",
        description: "Your recipe has been generated and saved.",
      });
      
      setActiveTab('chat');
    } catch (error) {
      console.error('Error generating recipe:', error);
      toast({
        variant: "destructive",
        title: "Generation Error",
        description: "Failed to generate recipe. Please try with a different prompt.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 p-4 flex flex-col h-full relative pb-20">
      <div className="flex-1 overflow-y-auto space-y-6">
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
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-sm border-t">
        <Button 
          onClick={handleGenerateRecipeClick}
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
    </div>
  );
};

export default GenerateTab;
