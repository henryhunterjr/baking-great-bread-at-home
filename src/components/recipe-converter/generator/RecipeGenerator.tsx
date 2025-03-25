
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types/chat';
import { generateRecipe } from '@/lib/ai-services'; // Updated import
import { useToast } from '@/hooks/use-toast';

interface RecipeGeneratorProps {
  addToChatHistory: (messages: ChatMessage[]) => void;
}

const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({ addToChatHistory }) => {
  const [recipePrompt, setRecipePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  const handleGenerateRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipePrompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // Add user message to chat history
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
        content: `I've generated a new recipe for "${generatedRecipe.title}" based on your request for "${recipePrompt}". It has been saved to your recipes. You can edit it further or start cooking right away!` 
      };
      
      // Add messages to chat history
      addToChatHistory([userMessage, assistantMessage]);
      
      // Show success notification
      toast({
        title: "Recipe Generated!",
        description: `Your recipe for "${generatedRecipe.title}" has been created.`,
      });
      
      // Reset the prompt
      setRecipePrompt('');
      
    } catch (error) {
      console.error("Error generating recipe:", error);
      const userMessage = { role: 'user' as const, content: `Generate a recipe for: ${recipePrompt}` };
      const errorMessage = { 
        role: 'assistant' as const, 
        content: "I'm sorry, I couldn't generate that recipe right now. Please try again with a different request." 
      };
      
      addToChatHistory([userMessage, errorMessage]);
      
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "There was a problem generating your recipe. Please try again.",
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
        
        <form onSubmit={handleGenerateRecipe} className="space-y-3">
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
