
import React, { useState } from 'react';
import { useBreadAssistant } from '@/contexts/BreadAssistantContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RecipeData } from '@/types/recipeTypes';
import { MessageSquare, Book } from 'lucide-react';

interface BreadAssistantPanelProps {
  recipe?: RecipeData;
}

const BreadAssistantPanel: React.FC<BreadAssistantPanelProps> = ({ recipe }) => {
  const { 
    isAnalyzing, 
    recentSuggestions, 
    conversationHistory, 
    analyzeRecipe, 
    askQuestion,
    clearHistory,
    lastAnalysisResult
  } = useBreadAssistant();
  
  const [userQuestion, setUserQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleAnalyzeRecipe = async () => {
    if (!recipe) return;
    
    await analyzeRecipe(recipe);
  };
  
  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;
    
    setIsSubmitting(true);
    await askQuestion(userQuestion);
    setUserQuestion('');
    setIsSubmitting(false);
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center">
          <Book className="h-5 w-5 mr-2" />
          Bread Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {recipe && (
          <div className="space-y-4">
            <Button
              onClick={handleAnalyzeRecipe}
              disabled={isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? 'Analyzing Recipe...' : 'Analyze This Recipe'}
            </Button>
            
            {recentSuggestions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Bread Tips:</h3>
                
                {recentSuggestions.map((tip, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium">{tip.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                  </div>
                ))}
                
                {lastAnalysisResult?.hydration && (
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium">Hydration</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      This recipe has approximately {lastAnalysisResult.hydration}% hydration.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        <div className="border-t pt-4">
          <h3 className="flex items-center text-sm font-medium mb-2">
            <MessageSquare className="h-4 w-4 mr-1" />
            Ask about bread baking
          </h3>
          
          <form onSubmit={handleAskQuestion} className="space-y-2">
            <Textarea 
              placeholder="Ask a question about bread baking..." 
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              className="min-h-[80px] resize-none"
            />
            
            <div className="flex items-center justify-between">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={clearHistory}
                disabled={isSubmitting || conversationHistory.length === 0}
              >
                Clear History
              </Button>
              
              <Button 
                type="submit"
                size="sm"
                disabled={!userQuestion.trim() || isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Ask'}
              </Button>
            </div>
          </form>
          
          {conversationHistory.length > 0 && (
            <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto">
              {conversationHistory.map((message, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-md ${
                    message.role === 'user' ? 'bg-muted/70 ml-4' : 'bg-primary/10 mr-4'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  {message.timestamp && (
                    <span className="text-xs text-muted-foreground block mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BreadAssistantPanel;
