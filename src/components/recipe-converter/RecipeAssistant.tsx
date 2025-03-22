
import React, { useState } from 'react';
import { RecipeData } from '@/pages/RecipeConverter';
import { ChatMessage } from './types/chat';
import ChatSection from './chat/ChatSection';
import RecipeGenerator from './generator/RecipeGenerator';

interface RecipeAssistantProps {
  recipe: RecipeData;
}

const RecipeAssistant: React.FC<RecipeAssistantProps> = ({ recipe }) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hi there! I\'m your Recipe Assistant. I can help you with substitutions, answer baking questions, generate new recipes, and more. What would you like help with today?'
    }
  ]);
  
  const addToChatHistory = (messages: ChatMessage[]) => {
    setChatHistory(prevHistory => [...prevHistory, ...messages]);
  };
  
  return (
    <div className="space-y-4">
      <ChatSection recipe={recipe} />
      <RecipeGenerator addToChatHistory={addToChatHistory} />
    </div>
  );
};

export default RecipeAssistant;
