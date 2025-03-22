
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types/chat';

interface RecipeGeneratorProps {
  addToChatHistory: (messages: ChatMessage[]) => void;
}

const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({ addToChatHistory }) => {
  const [recipePrompt, setRecipePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerateRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipePrompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // Simulate AI thinking time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add messages to chat history
      const userMessage = { role: 'user' as const, content: `Generate a recipe for: ${recipePrompt}` };
      const assistantMessage = { 
        role: 'assistant' as const, 
        content: `I've generated a new recipe idea for "${recipePrompt}"! Click the "Edit Recipe" button after conversion to view and customize it further.` 
      };
      
      addToChatHistory([userMessage, assistantMessage]);
      setRecipePrompt('');
      
    } catch (error) {
      console.error("Error generating recipe:", error);
      const userMessage = { role: 'user' as const, content: `Generate a recipe for: ${recipePrompt}` };
      const errorMessage = { 
        role: 'assistant' as const, 
        content: "I'm sorry, I couldn't generate that recipe right now. Please try again with a different request." 
      };
      
      addToChatHistory([userMessage, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Card className="bg-secondary/50">
      <CardContent className="pt-6">
        <h3 className="font-serif text-xl font-medium mb-4 flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-bread-800" />
          Generate New Recipe
        </h3>
        
        <Alert className="mb-4 bg-accent/20 border-accent text-accent-foreground">
          <AlertDescription className="text-xs">
            Describe the recipe you want to create. Be specific about ingredients, flavors, or techniques you'd like to include.
          </AlertDescription>
        </Alert>
        
        <form onSubmit={handleGenerateRecipe} className="space-y-3">
          <Textarea
            placeholder="Cinnamon rolls with walnuts and cream cheese frosting..."
            value={recipePrompt}
            onChange={(e) => setRecipePrompt(e.target.value)}
            disabled={isGenerating}
            className="min-h-[80px]"
          />
          <Button 
            type="submit"
            disabled={!recipePrompt.trim() || isGenerating}
            className="w-full bg-bread-800 hover:bg-bread-900"
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
