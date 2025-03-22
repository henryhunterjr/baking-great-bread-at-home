
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { ChatMessage } from '../types/chat';
import ChatBubble from './ChatBubble';
import ChatForm from './ChatForm';
import SuggestedQuestions from './SuggestedQuestions';
import { RecipeData } from '@/pages/RecipeConverter';

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
