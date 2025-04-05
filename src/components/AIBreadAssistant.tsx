
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';
import { useBreadAssistant } from '@/contexts/BreadAssistantContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const AIBreadAssistant: React.FC = () => {
  const [question, setQuestion] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    conversationHistory, 
    askQuestion, 
    clearHistory, 
    isAnalyzing 
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
      <SheetContent side="right" className="w-full sm:w-[540px]">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Bread Baking Assistant
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
          
          <CardContent className="flex-1 overflow-y-auto space-y-4">
            {conversationHistory.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>Hello! I'm your bread baking assistant.</p>
                <p className="mt-2">Ask me anything about bread recipes, techniques, or troubleshooting.</p>
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
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </CardContent>
          
          <CardFooter>
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
      </SheetContent>
    </Sheet>
  );
};

export default AIBreadAssistant;
