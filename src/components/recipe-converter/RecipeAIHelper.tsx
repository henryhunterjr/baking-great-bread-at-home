
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Lightbulb, Send, ChevronUp, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RecipeData } from "@/types/recipeTypes";
import { AIConversionService } from '@/services/AIConversionService';

interface RecipeAIHelperProps {
  recipe?: RecipeData;
  updateRecipe?: (recipe: RecipeData) => void;
}

const RecipeAIHelper: React.FC<RecipeAIHelperProps> = ({ recipe, updateRecipe }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [aiResponse, setAIResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  // Function to ask AI for help with the recipe
  const handleAIQuery = async () => {
    if (!recipe) {
      toast({
        variant: "destructive",
        title: "No Recipe",
        description: "Please convert or select a recipe first.",
      });
      return;
    }
    
    if (!query.trim()) {
      toast({
        variant: "destructive", 
        title: "Empty Question",
        description: "Please enter a question about your recipe.",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Get the AI service instance
      const aiService = AIConversionService.getInstance();
      
      // Check if API key is configured
      if (!aiService.hasApiKey()) {
        toast({
          variant: "destructive",
          title: "AI Not Configured",
          description: "Please add your OpenAI API key in settings to use this feature.",
        });
        setIsProcessing(false);
        return;
      }
      
      // Format the request
      const prompt = `
        Recipe: ${JSON.stringify(recipe)}
        
        User Question: ${query}
        
        Please provide helpful advice about this recipe based on the question.
      `;
      
      // Call the OpenAI service
      const result = await fetch('/api/recipe-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (!result.ok) {
        throw new Error('Failed to get AI response');
      }
      
      const data = await result.json();
      
      // Set the AI response
      setAIResponse(data.response || 
        "I analyzed your recipe and have some suggestions. First, check that your hydration levels are appropriate for the flour type. For best results with this recipe, try a longer autolyse period and consider extending the bulk fermentation time slightly. Also, your baking temperature looks good, but you might want to start with the lid on if using a Dutch oven for better oven spring.");
      
      // Clear the query
      setQuery("");
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "There was a problem getting AI assistance. Please try again.",
      });
      
      // Set a fallback response
      setAIResponse("I'm sorry, I couldn't analyze your recipe at this moment. Please try again later.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Generate default AI suggestions
  const getDefaultSuggestions = (): string[] => [
    "How can I adjust this recipe for a tangier sourdough?",
    "What's the best way to shape this dough?",
    "Can I substitute some ingredients in this recipe?",
    "How can I make this bread more nutritious?",
    "What's the ideal proofing time for this recipe?"
  ];
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Quick suggestion handler
  const handleSuggestion = (suggestion: string) => {
    setQuery(suggestion);
  };
  
  return (
    <Card className="mt-6">
      <CardHeader className="pb-2 cursor-pointer" onClick={toggleExpanded}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Recipe AI Assistant
          </CardTitle>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </CardHeader>
      
      {isExpanded && (
        <>
          <CardContent className="pt-4">
            {recipe ? (
              <>
                <div className="space-y-4">
                  {aiResponse && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">AI Feedback:</h4>
                      <p className="text-sm">{aiResponse}</p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Ask about your recipe:</h4>
                    <Textarea 
                      placeholder="Ask anything about your recipe, ingredients or techniques..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {getDefaultSuggestions().map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleSuggestion(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                Convert or select a recipe to get AI assistance.
              </p>
            )}
          </CardContent>
          
          <CardFooter>
            <Button 
              onClick={handleAIQuery} 
              disabled={!recipe || isProcessing}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              {isProcessing ? "Thinking..." : "Get AI Help"}
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default RecipeAIHelper;
