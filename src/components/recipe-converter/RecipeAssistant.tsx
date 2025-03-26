
import React, { useState } from 'react';
import { RecipeData } from '@/types/recipeTypes';
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
  
  const handleGenerateRecipe = (generatedRecipe: RecipeData) => {
    // Handle the generated recipe here
    const newMessage: ChatMessage = {
      role: 'assistant',
      content: `I've generated a recipe for ${generatedRecipe.title}. Would you like me to explain any part of it in detail?`
    };
    setChatHistory(prevHistory => [...prevHistory, newMessage]);
  };
  
  return (
    <div className="space-y-4">
      <ChatSection recipe={recipe} />
      <RecipeGenerator onGenerateRecipe={handleGenerateRecipe} />
    </div>
  );
};

export default RecipeAssistant;
