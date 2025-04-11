
import { RecipeData } from '@/types/recipeTypes';

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

export type BreadAssistantMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  attachedRecipe?: RecipeData;
};

export type BreadAssistantContextType = {
  isAnalyzing: boolean;
  recentSuggestions: BreadTip[];
  conversationHistory: BreadAssistantMessage[];
  lastAnalysisResult: BreadAnalysisResult | null;
  analyzeRecipe: (recipeData: RecipeData) => Promise<BreadAnalysisResult>;
  askQuestion: (question: string) => Promise<string>;
  findRecipe: (query: string) => Promise<RecipeData | null>;
  clearHistory: () => void;
  isAssistantOpen: boolean;
  toggleAssistant: () => void;
};
