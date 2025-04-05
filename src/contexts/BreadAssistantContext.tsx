
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { RecipeData } from '@/types/recipeTypes';
import { logInfo } from '@/utils/logger';

// Define types for our bread assistant
export type BreadTip = {
  title: string;
  description: string;
  confidence: number;
};

export type BreadAnalysisResult = {
  original: RecipeData;
  tips: BreadTip[];
  hydration?: number;
  fermentationTime?: string;
  bakingRecommendations?: string[];
  flourComposition?: Record<string, number>;
};

type BreadAssistantContextType = {
  isAnalyzing: boolean;
  recentSuggestions: BreadTip[];
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp?: Date;
  }>;
  lastAnalysisResult: BreadAnalysisResult | null;
  analyzeRecipe: (recipeData: RecipeData) => Promise<BreadAnalysisResult>;
  askQuestion: (question: string) => Promise<string>;
  clearHistory: () => void;
};

// Create the context
const BreadAssistantContext = createContext<BreadAssistantContextType | undefined>(undefined);

// Provider component
export function BreadAssistantProvider({ children }: { children: ReactNode }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recentSuggestions, setRecentSuggestions] = useState<BreadTip[]>([]);
  const [lastAnalysisResult, setLastAnalysisResult] = useState<BreadAnalysisResult | null>(null);
  const [conversationHistory, setConversationHistory] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp?: Date;
  }>>([]);

  // Analyze a bread recipe and provide baker's tips
  const analyzeRecipe = async (recipeData: RecipeData): Promise<BreadAnalysisResult> => {
    setIsAnalyzing(true);
    logInfo('Analyzing recipe with Bread Assistant', { title: recipeData.title });
    
    try {
      // In a real implementation, this would call your AI API
      // For now, simulate response based on recipe analysis
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Identify flour types in the recipe
      const flourTypes = Array.isArray(recipeData.ingredients) 
        ? recipeData.ingredients
            .filter(i => typeof i === 'string' && i.toLowerCase().includes('flour'))
            .map(i => i.toString())
        : [];
        
      const hasYeast = Array.isArray(recipeData.ingredients) && recipeData.ingredients
        .some(i => typeof i === 'string' && i.toLowerCase().includes('yeast'));
        
      const hasStarter = Array.isArray(recipeData.ingredients) && recipeData.ingredients
        .some(i => typeof i === 'string' && (
          i.toLowerCase().includes('starter') || 
          i.toLowerCase().includes('levain') ||
          i.toLowerCase().includes('sourdough')
        ));
      
      // Generate baker-specific tips
      const tips: BreadTip[] = [];
      
      if (hasStarter) {
        tips.push({
          title: "Sourdough Development",
          description: "Consider extending your bulk fermentation by 30 minutes for a more complex flavor profile.",
          confidence: 0.89
        });
        
        tips.push({
          title: "Starter Feeding",
          description: "For optimal results, feed your starter 8-12 hours before mixing the dough.",
          confidence: 0.92
        });
      }
      
      if (hasYeast && flourTypes.length > 1) {
        tips.push({
          title: "Mixed Flour Hydration",
          description: "Your recipe uses multiple flour types. Consider increasing hydration by 5% for better integration.",
          confidence: 0.85
        });
      }
      
      if (!hasStarter && !hasYeast) {
        tips.push({
          title: "Leavening Agent",
          description: "This recipe doesn't appear to include yeast or sourdough starter. Consider adding one for better rise.",
          confidence: 0.78
        });
      }
      
      // Calculate approximate hydration (simplified calculation)
      let hydration;
      if (Array.isArray(recipeData.ingredients)) {
        const waterIngredient = recipeData.ingredients.find(i => 
          typeof i === 'string' && i.toLowerCase().includes('water')
        );
        
        if (waterIngredient && flourTypes.length > 0) {
          // Simplified simulation - in reality would parse quantities
          hydration = 68; // Example value
        }
      }
      
      // Create the analysis result
      const analysisResult: BreadAnalysisResult = {
        original: recipeData,
        tips,
        hydration,
        fermentationTime: hasStarter ? "4-6 hours at room temperature" : "1-2 hours at room temperature",
        bakingRecommendations: [
          "Preheat oven to 450°F (230°C) with a Dutch oven inside for at least 30 minutes",
          "Bake covered for 20 minutes, then uncovered for 20-25 minutes until golden brown"
        ]
      };
      
      // Add conversation entry
      setConversationHistory(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `I've analyzed your bread recipe "${recipeData.title}" and have ${tips.length} suggestion${tips.length !== 1 ? 's' : ''} to improve it.`,
          timestamp: new Date()
        }
      ]);
      
      // Store suggestions for display
      setRecentSuggestions(tips);
      setLastAnalysisResult(analysisResult);
      
      return analysisResult;
    } catch (error) {
      console.error('Recipe analysis error:', error);
      
      // Add error message to conversation
      setConversationHistory(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I encountered an error analyzing your recipe. Please try again.",
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
  
  // Ask the bread assistant a question
  const askQuestion = async (question: string): Promise<string> => {
    try {
      // Add user message to history
      setConversationHistory(prev => [
        ...prev,
        { 
          role: 'user', 
          content: question,
          timestamp: new Date()
        }
      ]);
      
      // In a real implementation, this would call your AI API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simple bread-focused response simulation
      let response = "I'm not sure about that. Can you ask something about bread baking?";
      
      if (question.toLowerCase().includes('hydration')) {
        response = "Hydration refers to the ratio of water to flour in your dough. For a standard white bread, 65-70% hydration is typical. Increase to 75-85% for more open crumb structures like ciabatta.";
      } else if (question.toLowerCase().includes('sourdough')) {
        response = "Sourdough fermentation typically takes 4-12 hours depending on your starter strength and ambient temperature. I'd recommend starting with a 4-hour bulk fermentation at room temperature.";
      } else if (question.toLowerCase().includes('knead')) {
        response = "Kneading develops gluten structure. For most bread recipes, 10-12 minutes of hand-kneading or 5-8 minutes in a stand mixer on medium speed is sufficient.";
      } else if (question.toLowerCase().includes('flour')) {
        response = "Bread flour typically has a protein content of 12-14%, which helps develop stronger gluten networks. All-purpose flour is around 10-12% protein and works well for most home baking applications.";
      }
      
      // Add assistant response to history
      setConversationHistory(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: response,
          timestamp: new Date()
        }
      ]);
      
      return response;
    } catch (error) {
      console.error('Question error:', error);
      return "I'm having trouble processing your question right now.";
    }
  };
  
  // Clear conversation history
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
      clearHistory
    }}>
      {children}
    </BreadAssistantContext.Provider>
  );
}

// Hook for using the bread assistant
export function useBreadAssistant() {
  const context = useContext(BreadAssistantContext);
  if (context === undefined) {
    throw new Error('useBreadAssistant must be used within a BreadAssistantProvider');
  }
  return context;
}
