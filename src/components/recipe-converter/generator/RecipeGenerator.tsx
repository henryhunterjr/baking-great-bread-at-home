
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { RecipeData } from '@/types/recipeTypes';
import { Loader2, Sparkles } from 'lucide-react';
import { generateRecipe } from '@/lib/ai-services';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RecipeGeneratorProps {
  onGenerateRecipe: (recipe: RecipeData) => void;
}

const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({ onGenerateRecipe }) => {
  const [recipePrompt, setRecipePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipePrompt.trim()) {
      toast({
        variant: "destructive",
        title: "Empty Prompt",
        description: "Please describe the recipe you want to generate."
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Store the user's prompt as a message
      const userMessage = { role: 'user' as const, content: `Generate a recipe for: ${recipePrompt}` };
      
      // Call the AI service to generate a recipe
      const response = await generateRecipe(recipePrompt);
      
      if (!response.success || !response.recipe) {
        throw new Error("Failed to generate recipe");
      }
      
      const generatedRecipe = response.recipe;
      
      // Create assistant message with generated recipe info
      const assistantMessage = { 
        role: 'assistant' as const, 
        content: `I've generated a recipe for ${generatedRecipe.title} based on your prompt.`
      };
      
      // Pass the generated recipe back to the parent
      onGenerateRecipe(generatedRecipe);
      
      // Clear the text input
      setRecipePrompt('');
      
      toast({
        title: "Recipe Generated",
        description: "Your recipe has been generated successfully."
      });
    } catch (error) {
      console.error('Error generating recipe:', error);
      toast({
        variant: "destructive",
        title: "Generation Error",
        description: error instanceof Error ? error.message : "Error generating recipe. Please try again."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="bg-secondary/50 dark:bg-slate-800/70 dark:border-slate-700">
      <CardContent className="pt-6">
        <h3 className="font-serif text-xl font-medium mb-4 flex items-center dark:text-white">
          <Sparkles className="h-5 w-5 mr-2 text-bread-800 dark:text-bread-400" />
          Generate New Recipe
        </h3>
        
        <Alert className="mb-4 bg-accent/20 border-accent text-accent-foreground dark:bg-accent/10 dark:border-accent/40 dark:text-slate-200">
          <AlertDescription className="text-xs dark:text-slate-300">
            Describe the recipe you want to create. Be specific about ingredients, flavors, or techniques you'd like to include.
          </AlertDescription>
        </Alert>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            placeholder="Cinnamon rolls with walnuts and cream cheese frosting..."
            value={recipePrompt}
            onChange={(e) => setRecipePrompt(e.target.value)}
            disabled={isGenerating}
            className="min-h-[80px] bg-secondary/50 dark:bg-slate-700 border-2 border-accent/30 dark:border-accent/20 focus:border-bread-700 shadow-sm dark:text-white"
          />
          <Button 
            type="submit"
            disabled={!recipePrompt.trim() || isGenerating}
            className="w-full bg-bread-800 hover:bg-bread-700 shadow-md dark:bg-bread-700 dark:hover:bg-bread-600"
          >
            {isGenerating ? (
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
        </form>
      </CardContent>
    </Card>
  );
};

export default RecipeGenerator;
