
import { useState, FormEvent } from 'react';
import { ChatMessage } from '../utils/types';
import {
  handleRecipeRequest,
  handleBookRequest,
  handleChallengeRequest,
  handleConvertRequest,
  handleGenerateRequest,
  handleGeneralRequest
} from '../tabs/chat/ChatRequestHandlers';

interface UseChatHandlersProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setActiveTab: (tab: string) => void;
  setRecipeText: (text: string) => void;
  setRecipePrompt: (prompt: string) => void;
}

export const useChatHandlers = ({
  messages,
  setMessages,
  setActiveTab,
  setRecipeText,
  setRecipePrompt
}: UseChatHandlersProps) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isProcessing) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    
    try {
      const lowerInput = input.toLowerCase();
      
      // Check for recipe search request
      if (lowerInput.includes('recipe') || lowerInput.includes('bread') || 
          lowerInput.includes('bake') || lowerInput.includes('roll') ||
          lowerInput.includes('find') || lowerInput.includes('search')) {
        await handleRecipeRequest(input, setMessages, setIsProcessing);
      }
      // Check for book search request
      else if (lowerInput.includes('book') || lowerInput.includes('reading')) {
        await handleBookRequest(input, setMessages, setIsProcessing);
      }
      // Check for challenge request
      else if (lowerInput.includes('challenge') || lowerInput.includes('contest')) {
        await handleChallengeRequest(setMessages, setIsProcessing);
      }
      // Check for text conversion request
      else if (lowerInput.includes('convert') || lowerInput.includes('translate')) {
        handleConvertRequest(input, setMessages, setRecipeText, setActiveTab, setIsProcessing);
      }
      // Check for recipe generation request
      else if (lowerInput.includes('create') || lowerInput.includes('generate') || 
               lowerInput.includes('make me') || lowerInput.includes('custom')) {
        handleGenerateRequest(input, setMessages, setRecipePrompt, setActiveTab, setIsProcessing);
      }
      // Fall back to general response
      else {
        handleGeneralRequest(input, setMessages, setIsProcessing);
      }
    } catch (error) {
      console.error('Error handling message:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsProcessing(false);
    }
  };
  
  return {
    input,
    setInput,
    isProcessing,
    setIsProcessing,
    handleSendMessage
  };
};
