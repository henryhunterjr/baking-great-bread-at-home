
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { searchBlogWithAI, isAIConfigured } from '@/lib/ai-services';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isProcessing?: boolean;
}

interface ContextAwareChatProps {
  initialMessage?: string;
  placeholder?: string;
  showSettings?: boolean;
}

const ContextAwareChat: React.FC<ContextAwareChatProps> = ({
  initialMessage = "Hi! I'm your baking assistant. I can help answer questions about bread recipes, techniques, and more. What would you like to know?",
  placeholder = "Ask about bread recipes, techniques, or ingredients...",
  showSettings = true
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: initialMessage,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    // Add pending assistant message
    const pendingMessage: Message = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isProcessing: true
    };
    
    setMessages(prev => [...prev, userMessage, pendingMessage]);
    setInput('');
    setIsProcessing(true);
    
    try {
      // Check if OpenAI is configured
      if (!isAIConfigured()) {
        // Replace the pending message with error
        setMessages(prev => 
          prev.map(msg => 
            msg === pendingMessage ? {
              ...msg,
              content: "I need an OpenAI API key to provide AI-powered responses. Please add your API key in the settings.",
              isProcessing: false
            } : msg
          )
        );
        setIsProcessing(false);
        return;
      }
      
      // Determine if it's a search query
      const isSearchQuery = /find|search|looking for|recipe for|how to make/i.test(input);
      
      if (isSearchQuery) {
        // Use blog search feature for recipe-related queries
        const searchResponse = await searchBlogWithAI(input);
        
        if (searchResponse.success && searchResponse.results && searchResponse.results.length > 0) {
          // Format search results as a nice message
          const result = searchResponse.results[0];
          const responseContent = `I found a recipe that might help: **${result.title}**\n\n${result.excerpt}\n\n[View the full recipe](${result.link})`;
          
          // Replace the pending message with the response
          setMessages(prev => 
            prev.map(msg => 
              msg === pendingMessage ? {
                ...msg,
                content: responseContent,
                isProcessing: false
              } : msg
            )
          );
        } else {
          // Replace with a generic response if search failed
          setMessages(prev => 
            prev.map(msg => 
              msg === pendingMessage ? {
                ...msg,
                content: "I couldn't find specific recipes matching your query. Could you try asking in a different way or provide more details about what you're looking for?",
                isProcessing: false
              } : msg
            )
          );
        }
      } else {
        // For general questions, use a more generic response
        // In a real implementation, this would call the OpenAI API directly
        setTimeout(() => {
          setMessages(prev => 
            prev.map(msg => 
              msg === pendingMessage ? {
                ...msg,
                content: "I'm still learning about bread baking. For recipe-specific questions, try asking about a particular type of bread or technique, and I'll search our collection for you.",
                isProcessing: false
              } : msg
            )
          );
        }, 1000);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Replace the pending message with error
      setMessages(prev => 
        prev.map(msg => 
          msg === pendingMessage ? {
            ...msg,
            content: "Sorry, I encountered an error processing your request. Please try again later.",
            isProcessing: false
          } : msg
        )
      );
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process your message. Please try again."
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isProcessing) {
      handleSendMessage();
    }
  };
  
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Baking Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {message.isProcessing ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{message.content}</div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="border-t bg-background pt-2">
        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            className="flex-grow"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isProcessing || !input.trim()}
            size="icon"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        {showSettings && !isAIConfigured() && (
          <div className="mt-2 text-xs text-muted-foreground">
            <a href="/settings" className="text-primary hover:underline">
              Add your OpenAI API key in settings to enable AI features
            </a>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ContextAwareChat;
