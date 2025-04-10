
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Send, Sparkles } from 'lucide-react';
import { useBreadAssistant } from '@/contexts/BreadAssistantContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import RecipeDisplay from '@/components/recipe/RecipeDisplay';

const AIBreadAssistant: React.FC = () => {
  const [question, setQuestion] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [activeRecipe, setActiveRecipe] = useState(null);
  
  const { 
    conversationHistory, 
    askQuestion, 
    clearHistory, 
    isAnalyzing,
    recentSuggestions
  } = useBreadAssistant();
  
  // Scroll to bottom of chat on new messages
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationHistory]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isAnalyzing) return;
    
    const userQuestion = question;
    setQuestion('');
    await askQuestion(userQuestion);
  };

  const handleRecipeClick = (recipe) => {
    setActiveRecipe(recipe);
  };
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className="fixed bottom-4 right-4 z-50 rounded-full p-3 shadow-lg"
        >
          🍞
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[540px] p-0 flex flex-col">
        {activeRecipe ? (
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <Button variant="outline" size="sm" onClick={() => setActiveRecipe(null)}>
                ← Back to Chat
              </Button>
              <h3 className="font-medium text-lg">{activeRecipe.title}</h3>
              <div className="w-8" /> {/* Spacer for alignment */}
            </div>
            <div className="flex-grow overflow-y-auto p-4">
              <RecipeDisplay 
                recipe={activeRecipe}
                onEdit={() => {/* No editing for AI recipes yet */}}
                onSave={() => {/* Could implement saving to user recipes */}}
              />
            </div>
          </div>
        ) : (
          <Card className="h-full flex flex-col border-0 rounded-none">
            <CardHeader className="border-b">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  Bread Baking Assistant
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearHistory}
                  disabled={conversationHistory.length === 0}
                >
                  Clear History
                </Button>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto space-y-4 pt-4">
              {conversationHistory.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p>Hello! I'm your bread baking assistant.</p>
                  <p className="mt-2">Ask me anything about bread recipes, techniques, or troubleshooting.</p>
                  
                  <div className="mt-8">
                    <p className="font-medium mb-2">Try asking questions like:</p>
                    <ul className="space-y-2 text-sm">
                      <li className="p-2 bg-muted rounded-md hover:bg-muted/70 cursor-pointer"
                          onClick={() => askQuestion("What's a good hydration percentage for sourdough?")}>
                        What's a good hydration percentage for sourdough?
                      </li>
                      <li className="p-2 bg-muted rounded-md hover:bg-muted/70 cursor-pointer"
                          onClick={() => askQuestion("How do I achieve a more open crumb?")}>
                        How do I achieve a more open crumb?
                      </li>
                      <li className="p-2 bg-muted rounded-md hover:bg-muted/70 cursor-pointer"
                          onClick={() => askQuestion("Recipe for crusty French bread")}>
                        Recipe for crusty French bread
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                conversationHistory.map((msg, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg max-w-[85%] ${
                      msg.role === 'user' 
                        ? 'bg-primary/10 ml-auto' 
                        : 'bg-muted'
                    }`}
                  >
                    {msg.content}
                    
                    {msg.attachedRecipe && (
                      <div 
                        className="mt-3 p-3 border border-border rounded-md bg-card hover:bg-accent/10 cursor-pointer transition-colors"
                        onClick={() => handleRecipeClick(msg.attachedRecipe)}
                      >
                        <p className="font-medium">{msg.attachedRecipe.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">Click to view full recipe</p>
                      </div>
                    )}
                    
                    {msg.timestamp && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </CardContent>
            
            <CardFooter className="border-t p-4">
              <form onSubmit={handleSubmit} className="flex w-full gap-2">
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask about bread baking..."
                  disabled={isAnalyzing}
                  className="flex-grow"
                />
                <Button 
                  type="submit" 
                  disabled={!question.trim() || isAnalyzing}
                >
                  {isAnalyzing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </CardFooter>
          </Card>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default AIBreadAssistant;
