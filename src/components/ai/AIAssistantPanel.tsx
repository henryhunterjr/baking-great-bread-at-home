
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';
import { useAIAssistant } from '@/contexts/AIAssistantContext';
import { RecipeData } from '@/types/recipeTypes';

interface AIAssistantPanelProps {
  recipe?: RecipeData;
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ recipe }) => {
  const [question, setQuestion] = useState('');
  const { isProcessing, conversationHistory, askQuestion, analyzeRecipe } = useAIAssistant();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isProcessing) return;
    
    try {
      await askQuestion(question);
      setQuestion('');
    } catch (error) {
      console.error('Error sending question:', error);
    }
  };
  
  const handleAnalyzeRecipe = async () => {
    if (!recipe || isProcessing) return;
    
    try {
      await analyzeRecipe(recipe);
    } catch (error) {
      console.error('Error analyzing recipe:', error);
    }
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">Bread Assistant</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto">
        <div className="space-y-4">
          {conversationHistory.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Ask me anything about bread baking!
            </div>
          ) : (
            conversationHistory.map((message, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-bread-200 text-bread-900 ml-8' 
                    : 'bg-bread-800 text-white mr-8'
                }`}
              >
                {message.content}
              </div>
            ))
          )}
          
          {isProcessing && (
            <div className="flex items-center justify-center p-2">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">Thinking...</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            placeholder="Ask about bread baking..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isProcessing}
            className="flex-grow"
          />
          <Button type="submit" disabled={!question.trim() || isProcessing}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
      
      {recipe && (
        <CardFooter className="pt-0">
          <Button
            variant="outline"
            onClick={handleAnalyzeRecipe}
            disabled={isProcessing}
            className="w-full text-sm"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Analyze this recipe
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AIAssistantPanel;
