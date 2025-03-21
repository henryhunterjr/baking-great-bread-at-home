
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RecipeData } from '@/pages/RecipeConverter';
import { 
  MessageSquare,
  Sparkles,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RecipeAssistantProps {
  recipe: RecipeData;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const RecipeAssistant: React.FC<RecipeAssistantProps> = ({ recipe }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hi there! I\'m your Recipe Assistant. I can help you with substitutions, answer baking questions, generate new recipes, and more. What would you like help with today?'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [recipePrompt, setRecipePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Add user message to history
    const userMessage = { role: 'user' as const, content: message };
    setChatHistory([...chatHistory, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    try {
      // Simulate AI thinking time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate response based on the question
      let response = "I'm not sure about that. Could you provide more details?";
      
      // Simple pattern matching for demo purposes
      // In a real implementation, this would call an AI service
      if (message.toLowerCase().includes('buttermilk substitute')) {
        response = "You can make a buttermilk substitute by adding 1 tablespoon of lemon juice or vinegar to 1 cup of milk. Let it sit for 5-10 minutes before using.";
      } else if (message.toLowerCase().includes('gluten free')) {
        response = "To make this recipe gluten-free, you can substitute the bread flour with a gluten-free flour blend. Look for one that contains xanthan gum, or add 1/4 teaspoon of xanthan gum per cup of flour to help with binding.";
      } else if (message.toLowerCase().includes('double')) {
        response = "You can double all ingredients in this recipe. The preparation steps remain the same, but you might need to adjust baking time by 5-10 minutes longer. Also consider if your mixing bowl and baking vessel are large enough to handle the increased volume.";
      } else if (message.toLowerCase().includes('overnight') || message.toLowerCase().includes('finish tomorrow')) {
        response = "Yes, you can pause this recipe overnight! After shaping the dough, place it in a banneton or bowl, cover it, and refrigerate. The cold fermentation will actually improve flavor. The next day, let it come to room temperature for about 1 hour before baking.";
      } else if (recipe.title && message.toLowerCase().includes('ingredient')) {
        response = `For this ${recipe.title} recipe, make sure all ingredients are at room temperature for best results. The most critical ingredient is the flour - use bread flour if specified as it has higher protein content which helps develop gluten structure.`;
      } else {
        response = "I'm happy to help with your baking questions! Feel free to ask about ingredient substitutions, timing adjustments, technique advice, or recipe modifications.";
      }
      
      // Add assistant response to history
      setChatHistory([
        ...chatHistory,
        userMessage,
        { role: 'assistant', content: response }
      ]);
    } catch (error) {
      console.error("Error generating response:", error);
      setChatHistory([
        ...chatHistory,
        userMessage,
        { 
          role: 'assistant', 
          content: "I'm sorry, I'm having trouble responding right now. Please try again later." 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGenerateRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipePrompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // Simulate AI thinking time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add messages to chat history
      setChatHistory([
        ...chatHistory,
        { role: 'user', content: `Generate a recipe for: ${recipePrompt}` },
        { 
          role: 'assistant', 
          content: `I've generated a new recipe idea for "${recipePrompt}"! Click the "Edit Recipe" button after conversion to view and customize it further.` 
        }
      ]);
      
      setRecipePrompt('');
      
    } catch (error) {
      console.error("Error generating recipe:", error);
      setChatHistory([
        ...chatHistory,
        { role: 'user', content: `Generate a recipe for: ${recipePrompt}` },
        { 
          role: 'assistant', 
          content: "I'm sorry, I couldn't generate that recipe right now. Please try again with a different request." 
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const suggestedQuestions = [
    "What's a good substitute for buttermilk?",
    "How can I make this gluten free?",
    "Can I finish this recipe tomorrow?",
    "What if I want to double this recipe?"
  ];
  
  return (
    <div className="space-y-4">
      <Card className="bg-secondary/50">
        <CardContent className="pt-6 pb-3">
          <h3 className="font-serif text-xl font-medium mb-4 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-bread-800" />
            Recipe Assistant
          </h3>
          
          <div className="h-64 overflow-y-auto mb-4 space-y-3 pr-2">
            {chatHistory.map((msg, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg ${
                  msg.role === 'assistant' 
                    ? 'bg-background border border-border' 
                    : 'bg-bread-800 text-white ml-4'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            ))}
            {isLoading && (
              <div className="p-3 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-bread-800" />
                  <p className="text-sm text-muted-foreground">Thinking...</p>
                </div>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              placeholder="Ask a question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
            />
            <Button 
              type="submit"
              disabled={!message.trim() || isLoading}
              className="bg-bread-800 hover:bg-bread-900"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
          
          {!chatHistory.some(msg => msg.role === 'user') && (
            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="text-xs bg-background border border-border rounded-full px-2 py-1 hover:bg-accent transition-colors"
                    onClick={() => setMessage(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
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
    </div>
  );
};

export default RecipeAssistant;
