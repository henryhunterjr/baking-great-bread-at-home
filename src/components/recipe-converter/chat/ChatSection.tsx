
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Loader } from 'lucide-react';
import { ChatMessage } from '../types/chat';
import ChatBubble from './ChatBubble';
import ChatForm from './ChatForm';
import SuggestedQuestions from './SuggestedQuestions';
import { RecipeData } from '@/types/recipeTypes';
import { useToast } from '@/hooks/use-toast';

interface ChatSectionProps {
  recipe: RecipeData;
}

const ChatSection: React.FC<ChatSectionProps> = ({ recipe }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hi there! I\'m your Recipe Assistant. I can help you with substitutions, answer baking questions, generate new recipes, and more. What would you like help with today?'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Add user message to history
    const userMessage = { role: 'user' as const, content: message };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    try {
      // Call the AI assistant API
      const response = await fetch('/api/ask-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          recipeContext: recipe, // Send the current recipe as context
          chatHistory: chatHistory.slice(-5) // Send recent chat history for context
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Add AI response to history
      setChatHistory((prev) => [
        ...prev,
        { role: 'assistant', content: data.response }
      ]);
    } catch (error) {
      console.error("Error calling AI assistant:", error);
      setChatHistory((prev) => [
        ...prev,
        { 
          role: 'assistant', 
          content: "I'm sorry, I'm having trouble responding right now. Please try again later." 
        }
      ]);
      
      toast({
        variant: "destructive",
        title: "AI Assistant Error",
        description: "Failed to get a response. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const suggestedQuestions = [
    "What's a good substitute for buttermilk?",
    "How can I make this gluten free?",
    "Can I finish this recipe tomorrow?",
    "What if I want to double this recipe?"
  ];
  
  return (
    <Card className="bg-secondary/50 dark:bg-slate-800/70 dark:border-slate-700">
      <CardContent className="pt-6 pb-3">
        <h3 className="font-serif text-xl font-medium mb-4 flex items-center dark:text-white">
          <MessageSquare className="h-5 w-5 mr-2 text-bread-800 dark:text-bread-400" />
          Recipe Assistant
        </h3>
        
        <div className="h-64 overflow-y-auto mb-4 space-y-3 pr-2">
          {chatHistory.map((msg, index) => (
            <ChatBubble key={index} message={msg} />
          ))}
          {isLoading && (
            <ChatBubble 
              message={{ role: 'assistant', content: '' }} 
              isLoading={true} 
            />
          )}
        </div>
        
        <ChatForm 
          message={message}
          setMessage={setMessage}
          onSubmit={handleSendMessage}
          isLoading={isLoading}
        />
        
        {!chatHistory.some(msg => msg.role === 'user') && (
          <SuggestedQuestions 
            questions={suggestedQuestions} 
            onSelectQuestion={setMessage} 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ChatSection;
