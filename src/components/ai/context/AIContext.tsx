
import React, { createContext, useState, useContext } from 'react';
import { ChatMessage } from '../utils/types';

interface AIContextProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  chatInput: string;
  setChatInput: (text: string) => void;
  recipeText: string;
  setRecipeText: (text: string) => void;
  recipePrompt: string;
  setRecipePrompt: (prompt: string) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  useAI: boolean;
  setUseAI: (useAI: boolean) => void;
  saveHistory: boolean;
  setSaveHistory: (saveHistory: boolean) => void;
  enhanceRecipes: boolean;
  setEnhanceRecipes: (enhanceRecipes: boolean) => void;
}

const defaultContextValue: AIContextProps = {
  activeTab: 'chat',
  setActiveTab: () => {},
  chatInput: '',
  setChatInput: () => {},
  recipeText: '',
  setRecipeText: () => {},
  recipePrompt: '',
  setRecipePrompt: () => {},
  isProcessing: false,
  setIsProcessing: () => {},
  messages: [],
  setMessages: () => {},
  useAI: true,
  setUseAI: () => {},
  saveHistory: true,
  setSaveHistory: () => {},
  enhanceRecipes: true,
  setEnhanceRecipes: () => {},
};

export const AIContext = createContext<AIContextProps>(defaultContextValue);

export const useAIContext = () => useContext(AIContext);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [chatInput, setChatInput] = useState('');
  const [recipeText, setRecipeText] = useState('');
  const [recipePrompt, setRecipePrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hi, I'm your Baking Assistant! I can help you with bread recipes, answer baking questions, search for Henry's recipes, recommend books, tell you about the current baking challenge, or convert recipes from images or text. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  
  // Settings state
  const [useAI, setUseAI] = useState(true);
  const [saveHistory, setSaveHistory] = useState(true);
  const [enhanceRecipes, setEnhanceRecipes] = useState(true);

  return (
    <AIContext.Provider
      value={{
        activeTab,
        setActiveTab,
        chatInput,
        setChatInput,
        recipeText,
        setRecipeText,
        recipePrompt,
        setRecipePrompt,
        isProcessing,
        setIsProcessing,
        messages,
        setMessages,
        useAI,
        setUseAI,
        saveHistory,
        setSaveHistory,
        enhanceRecipes,
        setEnhanceRecipes,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};
