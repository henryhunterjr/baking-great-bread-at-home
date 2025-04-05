
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { RecipeData } from '@/types/recipeTypes';

// Define types for our context
export type BreadingTip = {
  title: string;
  content: string;
  confidence: number;
};

export type ConversionResult = {
  original: RecipeData;
  converted: RecipeData;
  tips: BreadingTip[];
};

export type AIAssistantContextType = {
  isProcessing: boolean;
  conversationHistory: Array<{role: 'user' | 'assistant', content: string}>;
  lastConversionResult: ConversionResult | null;
  askQuestion: (question: string) => Promise<string>;
  analyzeRecipe: (recipeData: RecipeData) => Promise<ConversionResult>;
  clearHistory: () => void;
};

// Create the context
const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

// Provider component
export function AIAssistantProvider({ children }: { children: ReactNode }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [lastConversionResult, setLastConversionResult] = useState<ConversionResult | null>(null);

  // Ask the AI a question
  const askQuestion = async (question: string): Promise<string> => {
    setIsProcessing(true);
    
    try {
      // Add user question to history
      setConversationHistory(prev => [
        ...prev, 
        { role: 'user', content: question }
      ]);
      
      // This would be your actual API call
      // For now, simulate a response about bread
      const breadTopics = ['hydration', 'kneading', 'proofing', 'scoring', 'baking temperature'];
      const randomTopic = breadTopics[Math.floor(Math.random() * breadTopics.length)];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = `Here's some advice about ${randomTopic} for your bread recipe...`;
      
      // Add assistant response to history
      setConversationHistory(prev => [
        ...prev, 
        { role: 'assistant', content: response }
      ]);
      
      return response;
    } catch (error) {
      console.error('Error asking question:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Analyze a recipe with the AI
  const analyzeRecipe = async (recipeData: RecipeData): Promise<ConversionResult> => {
    setIsProcessing(true);
    
    try {
      // This would be your actual API call
      // For now, return a simulated analysis
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result: ConversionResult = {
        original: recipeData,
        converted: {
          ...recipeData,
          // Add converted values here
        },
        tips: [
          {
            title: 'Hydration Adjustment',
            content: 'Consider increasing hydration by 5% for a more open crumb.',
            confidence: 0.85
          },
          {
            title: 'Proofing Time',
            content: 'For your kitchen temperature, consider extending bulk fermentation by 30 minutes.',
            confidence: 0.78
          }
        ]
      };
      
      setLastConversionResult(result);
      
      // Add to conversation history
      setConversationHistory(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: `I've analyzed your recipe and made some adjustments. I've adjusted the hydration and provided tips for better proofing.`
        }
      ]);
      
      return result;
    } catch (error) {
      console.error('Error analyzing recipe:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Clear conversation history
  const clearHistory = () => {
    setConversationHistory([]);
  };

  return (
    <AIAssistantContext.Provider value={{
      isProcessing,
      conversationHistory,
      lastConversionResult,
      askQuestion,
      analyzeRecipe,
      clearHistory
    }}>
      {children}
    </AIAssistantContext.Provider>
  );
}

// Hook for using the AI Assistant context
export function useAIAssistant() {
  const context = useContext(AIAssistantContext);
  if (context === undefined) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider');
  }
  return context;
}
