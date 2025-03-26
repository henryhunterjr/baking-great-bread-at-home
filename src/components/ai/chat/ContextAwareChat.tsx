
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Send, Search, BookOpen, FileText, Copy, ExternalLink, AlertCircle, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { searchBlogWithAI, isAIConfigured } from '@/lib/ai-services';
import { contextAwareAI, initializeContextAwareAI } from '@/lib/ai-services/context-aware-ai';
import { useNavigate } from 'react-router-dom';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isProcessing?: boolean;
  sources?: Array<{
    title: string;
    excerpt: string;
    url: string;
    type: string;
  }>;
}

interface SourceReference {
  title: string;
  excerpt: string;
  url: string;
  type: string;
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
  const [isAiInitialized, setIsAiInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Initialize the context-aware AI service
  useEffect(() => {
    const initAI = async () => {
      setIsInitializing(true);
      try {
        await initializeContextAwareAI();
        setIsAiInitialized(true);
        toast({
          title: "AI Assistant Ready",
          description: "The baking assistant has been initialized with knowledge from our recipes and blog posts.",
        });
      } catch (error) {
        console.error('Failed to initialize context-aware AI:', error);
        
        // Check if the error is related to missing API key
        if (error instanceof Error && error.message.includes('API key')) {
          setShowApiKeyPrompt(true);
        }
        
        toast({
          variant: "destructive",
          title: "AI Initialization Failed",
          description: "There was a problem setting up the AI assistant. Some features may be limited."
        });
      } finally {
        setIsInitializing(false);
      }
    };
    
    initAI();
  }, [toast]);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return;
    
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
      // Check if API key is configured
      if (!isAIConfigured()) {
        // Replace the pending message with API key message
        setMessages(prev => 
          prev.map(msg => 
            msg === pendingMessage ? {
              ...msg,
              content: "I need an OpenAI API key to assist you properly. Please configure your API key in settings.",
              isProcessing: false
            } : msg
          )
        );
        setShowApiKeyPrompt(true);
        setIsProcessing(false);
        return;
      }
      
      // Check if context-aware AI is initialized
      if (isInitializing) {
        // Replace the pending message with initialization status
        setMessages(prev => 
          prev.map(msg => 
            msg === pendingMessage ? {
              ...msg,
              content: "I'm still loading my knowledge base. Please wait a moment...",
              isProcessing: false
            } : msg
          )
        );
        setIsProcessing(false);
        return;
      }
      
      if (!isAiInitialized) {
        // Replace the pending message with error
        setMessages(prev => 
          prev.map(msg => 
            msg === pendingMessage ? {
              ...msg,
              content: "I'm having trouble accessing my knowledge base. Please try refreshing the page.",
              isProcessing: false
            } : msg
          )
        );
        setIsProcessing(false);
        return;
      }
      
      // Process the message with context-aware AI
      const aiResponse = await contextAwareAI.processQuery(input);
      
      if (aiResponse.success) {
        // Replace the pending message with the response
        setMessages(prev => 
          prev.map(msg => 
            msg === pendingMessage ? {
              ...msg,
              content: aiResponse.answer,
              isProcessing: false,
              sources: aiResponse.sources
            } : msg
          )
        );
      } else {
        // Handle API error
        const errorMessage = aiResponse.error || "Sorry, I encountered an error processing your request. Please try again later.";
        
        // Replace the pending message with error
        setMessages(prev => 
          prev.map(msg => 
            msg === pendingMessage ? {
              ...msg,
              content: errorMessage,
              isProcessing: false
            } : msg
          )
        );
        
        // Show a toast for the error
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to process your message. Please try again."
        });
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
  
  const copySourceToClipboard = (source: SourceReference) => {
    const text = `${source.title}\n${source.excerpt}\nURL: ${source.url}`;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Source information copied to clipboard."
    });
  };
  
  const renderSourceItem = (source: SourceReference) => {
    let icon;
    
    switch (source.type) {
      case 'blog':
        icon = <FileText className="h-4 w-4 mr-2 text-blue-500" />;
        break;
      case 'book':
        icon = <BookOpen className="h-4 w-4 mr-2 text-green-500" />;
        break;
      case 'recipe':
      default:
        icon = <Search className="h-4 w-4 mr-2 text-primary" />;
    }
    
    return (
      <div className="flex items-start mb-2 p-2 bg-muted/30 rounded text-sm">
        {icon}
        <div className="flex-1 mr-2">
          <a 
            href={source.url} 
            className="font-medium hover:underline text-primary flex items-center"
            target="_blank" 
            rel="noopener noreferrer"
          >
            {source.title}
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
          <p className="text-muted-foreground text-xs mt-1">{source.excerpt}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => copySourceToClipboard(source)}
          title="Copy source information"
        >
          <Copy className="h-3 w-3" />
        </Button>
      </div>
    );
  };
  
  // Suggested questions for users to get started
  const suggestedQuestions = [
    "How do I make sourdough bread?",
    "What's Henry's Foolproof Sourdough recipe?",
    "How do I know when my bread is done baking?",
    "What's the difference between active dry and instant yeast?",
    "How do I make a Challah bread?"
  ];
  
  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  const navigateToSettings = () => {
    navigate('/settings');
  };
  
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Baking Assistant</CardTitle>
        {showApiKeyPrompt && (
          <CardDescription className="flex items-start gap-2 mt-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md text-amber-800 dark:text-amber-200">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-500" />
            <div>
              <p className="font-medium mb-1">OpenAI API Key Required</p>
              <p className="text-sm">To use AI features, you need to add your OpenAI API key in settings.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 border-amber-500 text-amber-600 hover:bg-amber-50"
                onClick={navigateToSettings}
              >
                <Key className="h-3 w-3 mr-2" />
                Configure API Key
              </Button>
            </div>
          </CardDescription>
        )}
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
                  <>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    
                    {/* Show sources if available */}
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-muted">
                        <p className="text-xs font-medium mb-2">Sources:</p>
                        {message.sources.map((source, idx) => (
                          <div key={idx}>
                            {renderSourceItem(source)}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Suggested questions */}
        {messages.length <= 2 && !isProcessing && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-xs"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t bg-background pt-2">
        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder={isInitializing ? "Loading knowledge base..." : placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing || isInitializing}
            className="flex-grow"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isProcessing || !input.trim() || isInitializing}
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
            <a href="/settings" className="text-primary hover:underline flex items-center gap-1">
              <Key className="h-3 w-3" />
              Add your OpenAI API key in settings to enable AI features
            </a>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ContextAwareChat;
