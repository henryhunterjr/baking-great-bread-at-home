
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { RecipeData } from '@/types/recipeTypes';
import { logInfo, logError } from '@/utils/logger';
import { parseAIResponseToRecipe } from '@/utils/recipeParser';
import { 
  BreadTip, 
  BreadAnalysisResult, 
  BreadAssistantMessage,
  BreadAssistantContextType 
} from './bread-assistant/types';
import { analyzeRecipeData } from './bread-assistant/recipe-analysis';
import { 
  findRecipe as findRecipeService, 
  askAIQuestion, 
  generateBreadResponse 
} from './bread-assistant/recipe-services';

const BreadAssistantContext = createContext<BreadAssistantContextType | undefined>(undefined);

export function BreadAssistantProvider({ children }: { children: ReactNode }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recentSuggestions, setRecentSuggestions] = useState<BreadTip[]>([]);
  const [lastAnalysisResult, setLastAnalysisResult] = useState<BreadAnalysisResult | null>(null);
  const [conversationHistory, setConversationHistory] = useState<BreadAssistantMessage[]>([]);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const toggleAssistant = () => {
    setIsAssistantOpen(prev => !prev);
  };

  const analyzeRecipe = async (recipeData: RecipeData): Promise<BreadAnalysisResult> => {
    setIsAnalyzing(true);
    
    try {
      const analysisResult = await analyzeRecipeData(recipeData);
      
      setConversationHistory(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `I've analyzed your bread recipe "${recipeData.title}" and have ${analysisResult.tips.length} suggestion${analysisResult.tips.length !== 1 ? 's' : ''} to improve it.`,
          timestamp: new Date()
        }
      ]);
      
      setRecentSuggestions(analysisResult.tips);
      setLastAnalysisResult(analysisResult);
      
      return analysisResult;
    } catch (error) {
      console.error('Recipe analysis error:', error);
      
      setConversationHistory(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I encountered an error analyzing your recipe. Please try again or check your API key configuration.",
          timestamp: new Date()
        }
      ]);
      
      return {
        original: recipeData,
        tips: []
      };
    } finally {
      setIsAnalyzing(false);
    }
  };

  const askQuestion = async (question: string): Promise<string> => {
    try {
      setConversationHistory(prev => [
        ...prev,
        { 
          role: 'user', 
          content: question,
          timestamp: new Date()
        }
      ]);
      
      if (question.toLowerCase().includes('recipe for') || 
          question.toLowerCase().includes('how to make') ||
          question.toLowerCase().includes('how do you bake')) {
        
        const recipeQuery = question.replace(/recipe for|how to make|how do you bake/gi, '').trim();
        if (recipeQuery) {
          const recipe = await findRecipe(recipeQuery);
          
          if (recipe) {
            const response = `I found a recipe for ${recipe.title}! Here it is:`;
            
            setConversationHistory(prev => [
              ...prev,
              { 
                role: 'assistant', 
                content: response,
                timestamp: new Date(),
                attachedRecipe: recipe
              }
            ]);
            
            return response;
          }
        }
      }
      
      // Check for common bread questions with canned responses
      const breadResponse = generateBreadResponse(question);
      if (breadResponse) {
        setConversationHistory(prev => [
          ...prev,
          { 
            role: 'assistant', 
            content: breadResponse,
            timestamp: new Date()
          }
        ]);
        
        return breadResponse;
      }
      
      // Use AI service for other questions
      const response = await askAIQuestion(question);
      
      setConversationHistory(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: response,
          timestamp: new Date()
        }
      ]);
      
      const extractedRecipe = parseAIResponseToRecipe(response);
      if (extractedRecipe) {
        setConversationHistory(prev => {
          const updated = [...prev];
          if (updated.length > 0) {
            const lastMsg = updated[updated.length - 1];
            updated[updated.length - 1] = {
              ...lastMsg,
              attachedRecipe: extractedRecipe
            };
          }
          return updated;
        });
      }
      
      return response;
    } catch (error) {
      console.error('Question error:', error);
      const errorMsg = "I'm having trouble processing your question right now.";
      
      setConversationHistory(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: errorMsg,
          timestamp: new Date()
        }
      ]);
      
      return errorMsg;
    }
  };

  const findRecipe = async (query: string): Promise<RecipeData | null> => {
    return await findRecipeService(query);
  };

  const clearHistory = () => {
    setConversationHistory([]);
    setRecentSuggestions([]);
    setLastAnalysisResult(null);
  };

  return (
    <BreadAssistantContext.Provider value={{
      isAnalyzing,
      recentSuggestions,
      conversationHistory,
      lastAnalysisResult,
      analyzeRecipe,
      askQuestion,
      findRecipe,
      clearHistory,
      isAssistantOpen,
      toggleAssistant
    }}>
      {children}
    </BreadAssistantContext.Provider>
  );
}

export function useBreadAssistant() {
  const context = useContext(BreadAssistantContext);
  if (context === undefined) {
    throw new Error('useBreadAssistant must be used within a BreadAssistantProvider');
  }
  return context;
}
