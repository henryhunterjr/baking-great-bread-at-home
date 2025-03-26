import { useState, useCallback } from 'react';
import { ChatMessage } from '../utils/types';
import {
  handleRecipeRequest,
  handleBookRequest,
  handleChallengeRequest,
  handleConvertRequest,
  handleGenerateRequest,
  handleGeneralRequest
} from '../tabs/chat/handlers';

interface UseChatHandlersProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setActiveTab: (tab: string) => void;
  setRecipeText: (text: string) => void;
  setRecipePrompt: (prompt: string) => void;
  setIsProcessing: (isProcessing: boolean) => void;
}

export const useChatHandlers = ({
  messages,
  setMessages,
  setActiveTab,
  setRecipeText,
  setRecipePrompt,
  setIsProcessing
}: UseChatHandlersProps) => {
  const [input, setInput] = useState('');

  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    setIsProcessing(true);
    
    // Add user message to the chat
    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput(''); // Clear the input field immediately after sending
    
    const query = input.trim();
    const lowerQuery = query.toLowerCase();
    
    // Route the request to the appropriate handler
    if (lowerQuery.startsWith('find') || lowerQuery.includes('recipe') || lowerQuery.includes('recipes')) {
      await handleRecipeRequest(query, setMessages, setIsProcessing);
    } else if (lowerQuery.includes('book')) {
      await handleBookRequest(query, setMessages, setIsProcessing);
    } else if (lowerQuery.includes('challenge')) {
      await handleChallengeRequest(setMessages, setIsProcessing);
    } else if (lowerQuery.includes('convert')) {
      handleConvertRequest(query, setMessages, setRecipeText, setActiveTab, setIsProcessing);
    } else if (lowerQuery.includes('generate') || lowerQuery.includes('create')) {
      await handleGenerateRequest(query, setMessages, setRecipePrompt, setActiveTab, setIsProcessing);
    } else {
      handleGeneralRequest(query, setMessages, setIsProcessing);
    }
  }, [input, setMessages, setActiveTab, setRecipeText, setRecipePrompt, setIsProcessing]);

  return {
    input,
    setInput,
    handleSendMessage
  };
};
