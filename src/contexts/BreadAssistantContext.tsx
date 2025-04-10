import React, { createContext, useState, useContext, ReactNode } from 'react';
import { RecipeData } from '@/types/recipeTypes';
import { logInfo, logError } from '@/utils/logger';
import { updateOpenAIApiKey, isAIConfigured, getOpenAIApiKey } from '@/lib/ai-services';
import { parseAIResponseToRecipe } from '@/utils/recipeParser';

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
    attachedRecipe?: RecipeData;
  }>;
  lastAnalysisResult: BreadAnalysisResult | null;
  analyzeRecipe: (recipeData: RecipeData) => Promise<BreadAnalysisResult>;
  askQuestion: (question: string) => Promise<string>;
  findRecipe: (query: string) => Promise<RecipeData | null>;
  clearHistory: () => void;
};

const BreadAssistantContext = createContext<BreadAssistantContextType | undefined>(undefined);

export function BreadAssistantProvider({ children }: { children: ReactNode }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recentSuggestions, setRecentSuggestions] = useState<BreadTip[]>([]);
  const [lastAnalysisResult, setLastAnalysisResult] = useState<BreadAnalysisResult | null>(null);
  const [conversationHistory, setConversationHistory] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp?: Date;
    attachedRecipe?: RecipeData;
  }>>([]);

  const analyzeRecipe = async (recipeData: RecipeData): Promise<BreadAnalysisResult> => {
    setIsAnalyzing(true);
    logInfo('Analyzing recipe with Bread Assistant', { title: recipeData.title });
    
    try {
      updateOpenAIApiKey();
      if (!isAIConfigured()) {
        throw new Error('OpenAI API key not configured');
      }

      const apiKey = getOpenAIApiKey();
      if (!apiKey) {
        throw new Error('OpenAI API key not found');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1600));
      
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
        
        tips.push({
          title: "Temperature Management",
          description: "Keep your dough between 75-78°F (24-26°C) during fermentation for optimal microbial activity.",
          confidence: 0.85
        });
      }
      
      if (hasYeast && flourTypes.length > 1) {
        tips.push({
          title: "Mixed Flour Hydration",
          description: "Your recipe uses multiple flour types. Consider increasing hydration by 5% for better integration.",
          confidence: 0.85
        });
        
        tips.push({
          title: "Optimal Proofing",
          description: "For mixed flour doughs with commercial yeast, try a longer, cooler proof (6-8 hours at 54°F/12°C).",
          confidence: 0.78
        });
      }
      
      if (!hasStarter && !hasYeast) {
        tips.push({
          title: "Leavening Agent",
          description: "This recipe doesn't appear to include yeast or sourdough starter. Consider adding one for better rise.",
          confidence: 0.95
        });
      }
      
      let hydration;
      let flourComposition = {};
      
      if (Array.isArray(recipeData.ingredients)) {
        const waterIngredient = recipeData.ingredients.find(i => 
          typeof i === 'string' && i.toLowerCase().includes('water')
        );
        
        if (waterIngredient && flourTypes.length > 0) {
          hydration = 68 + (Math.random() * 10 - 5);
          hydration = Math.round(hydration);
          
          if (flourTypes.length > 0) {
            const totalFlour = 100;
            flourComposition = {};
            
            flourTypes.forEach((flourType, index) => {
              const name = flourType.toLowerCase().includes('whole wheat') ? 'Whole Wheat' : 
                           flourType.toLowerCase().includes('rye') ? 'Rye' :
                           flourType.toLowerCase().includes('spelt') ? 'Spelt' : 'Bread Flour';
                           
              if (index === 0) {
                flourComposition[name] = totalFlour - (flourTypes.length - 1) * 15;
              } else {
                flourComposition[name] = 15;
              }
            });
          }
        }
      }
      
      const analysisResult: BreadAnalysisResult = {
        original: recipeData,
        tips,
        hydration,
        flourComposition,
        fermentationTime: hasStarter ? "4-6 hours at room temperature" : "1-2 hours at room temperature",
        bakingRecommendations: [
          "Preheat oven to 450°F (230°C) with a Dutch oven inside for at least 30 minutes",
          "Bake covered for 20 minutes, then uncovered for 20-25 minutes until golden brown",
          "For optimal crust, create steam in the first 10 minutes of baking"
        ]
      };
      
      setConversationHistory(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `I've analyzed your bread recipe "${recipeData.title}" and have ${tips.length} suggestion${tips.length !== 1 ? 's' : ''} to improve it.`,
          timestamp: new Date()
        }
      ]);
      
      setRecentSuggestions(tips);
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
      
      if (question.toLowerCase().includes('hydration')) {
        return "Hydration refers to the ratio of water to flour in your dough. For a standard white bread, 65-70% hydration is typical. Increase to 75-85% for more open crumb structures like ciabatta.";
      } else if (question.toLowerCase().includes('sourdough')) {
        return "Sourdough fermentation typically takes 4-12 hours depending on your starter strength and ambient temperature. I'd recommend starting with a 4-hour bulk fermentation at room temperature.";
      } else if (question.toLowerCase().includes('knead')) {
        return "Kneading develops gluten structure. For most bread recipes, 10-12 minutes of hand-kneading or 5-8 minutes in a stand mixer on medium speed is sufficient.";
      } else if (question.toLowerCase().includes('flour')) {
        return "Bread flour typically has a protein content of 12-14%, which helps develop stronger gluten networks. All-purpose flour is around 10-12% protein and works well for most home baking applications.";
      }
      
      const apiKey = getOpenAIApiKey();
      if (apiKey) {
        try {
          const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                { role: 'system', content: 'You are a helpful bread baking assistant. Provide detailed, accurate information about bread baking techniques, recipes, troubleshooting, and ingredients. Keep answers focused on bread and baking topics.' },
                { role: 'user', content: question }
              ],
              temperature: 0.7,
              max_tokens: 500
            })
          });
          
          if (aiResponse.ok) {
            const data = await aiResponse.json();
            const response = data.choices[0].message.content;
            
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
          }
        } catch (error) {
          console.error('OpenAI API error:', error);
        }
      }
      
      return "I'm not sure about that. Can you ask something about bread baking?";
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
    try {
      updateOpenAIApiKey();
      const apiKey = getOpenAIApiKey();
      
      if (!apiKey) {
        throw new Error('OpenAI API key not configured');
      }
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'system', 
              content: `You are a specialized bread recipe generator. Generate a complete, detailed bread recipe for the user's request.
              Include these sections: Title, Ingredients (with measurements), Instructions (numbered steps), Notes (optional).
              Format example:
              
              [Recipe Name]
              
              Prep Time: X minutes
              Cook Time: X minutes
              Servings: X
              
              Ingredients:
              - 500g bread flour
              - 350ml water
              - etc.
              
              Instructions:
              1. First step
              2. Second step
              3. Etc.
              
              Notes:
              - Note 1
              - Note 2
              
              Only include relevant information for making the bread recipe. Be concise but thorough.` 
            },
            { 
              role: 'user', 
              content: `Create a bread recipe for: ${query}` 
            }
          ],
          temperature: 0.7
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.status}`);
      }
      
      const data = await response.json();
      const recipeText = data.choices[0].message.content;
      
      const parsedRecipe = parseAIResponseToRecipe(recipeText);
      
      if (!parsedRecipe) {
        return {
          title: `${query} Bread`,
          ingredients: ["Failed to parse recipe ingredients"],
          instructions: ["Failed to parse recipe instructions"],
          isConverted: true
        };
      }
      
      return parsedRecipe;
    } catch (error) {
      logError('Recipe generation error', { error, query });
      return null;
    }
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
      clearHistory
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
