
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { ChatMessage } from '../types/chat';
import ChatBubble from './ChatBubble';
import ChatForm from './ChatForm';
import SuggestedQuestions from './SuggestedQuestions';
import { RecipeData } from '@/pages/RecipeConverter';
import { useToast } from '@/hooks/use-toast';
import { AI_CONFIG } from '@/services/aiService';

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
    setChatHistory([...chatHistory, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    try {
      // Simulate AI thinking time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, this would call the AI service
      // For now, we'll use simple pattern matching for responses
      let response = generateResponse(message, recipe);
      
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
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate a response. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateResponse = (query: string, recipe: RecipeData): string => {
    const lowercaseQuery = query.toLowerCase();
    
    // Simple pattern matching for demo purposes
    // In a real implementation, this would call an AI service
    if (lowercaseQuery.includes('buttermilk substitute')) {
      return "You can make a buttermilk substitute by adding 1 tablespoon of lemon juice or vinegar to 1 cup of milk. Let it sit for 5-10 minutes before using.";
    } else if (lowercaseQuery.includes('gluten free')) {
      return "To make this recipe gluten-free, you can substitute the bread flour with a gluten-free flour blend. Look for one that contains xanthan gum, or add 1/4 teaspoon of xanthan gum per cup of flour to help with binding.";
    } else if (lowercaseQuery.includes('double')) {
      return "You can double all ingredients in this recipe. The preparation steps remain the same, but you might need to adjust baking time by 5-10 minutes longer. Also consider if your mixing bowl and baking vessel are large enough to handle the increased volume.";
    } else if (lowercaseQuery.includes('overnight') || lowercaseQuery.includes('finish tomorrow')) {
      return "Yes, you can pause this recipe overnight! After shaping the dough, place it in a banneton or bowl, cover it, and refrigerate. The cold fermentation will actually improve flavor. The next day, let it come to room temperature for about 1 hour before baking.";
    } else if (recipe.title && lowercaseQuery.includes('ingredient')) {
      return `For this ${recipe.title} recipe, make sure all ingredients are at room temperature for best results. The most critical ingredient is the flour - use bread flour if specified as it has higher protein content which helps develop gluten structure.`;
    } else if (lowercaseQuery.includes('how') && lowercaseQuery.includes('storage')) {
      return "For optimal freshness, store bread at room temperature in a bread box or paper bag for 2-3 days. For longer storage, slice and freeze in an airtight container for up to 3 months. Thaw slices as needed at room temperature or toast from frozen.";
    } else if (lowercaseQuery.includes('how') && lowercaseQuery.includes('knead')) {
      return "To knead bread dough: 1) Push the dough away with the heel of your hand. 2) Fold it back toward you. 3) Rotate a quarter turn. 4) Repeat for 8-10 minutes until smooth and elastic. The dough should pass the 'windowpane test' - when stretched, it forms a translucent membrane without tearing.";
    } else if (lowercaseQuery.includes('hello') || lowercaseQuery.includes('hi') || lowercaseQuery.includes('hey')) {
      return "Hello! I'm happy to help with your baking questions. Feel free to ask about ingredient substitutions, timing adjustments, technique advice, or recipe modifications.";
    } else {
      return "I'm happy to help with your baking questions! Feel free to ask about ingredient substitutions, timing adjustments, technique advice, or recipe modifications.";
    }
  };
  
  const suggestedQuestions = [
    "What's a good substitute for buttermilk?",
    "How can I make this gluten free?",
    "Can I finish this recipe tomorrow?",
    "What if I want to double this recipe?"
  ];
  
  return (
    <Card className="bg-secondary/50">
      <CardContent className="pt-6 pb-3">
        <h3 className="font-serif text-xl font-medium mb-4 flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-bread-800" />
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
