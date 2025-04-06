import { RecipeData } from '@/types/recipeTypes';

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isGenerating?: boolean;
  attachedRecipe?: {
    title: string;
    description: string;
    imageUrl?: string;
    link?: string;
    fullRecipe?: RecipeData;
    isGenerated?: boolean;
  };
  attachedBook?: {
    title: string;
    author: string;
    cover?: string;
    description: string;
    link?: string;
  };
};

export type RecipeSearchResult = {
  title: string;
  description: string;
  imageUrl?: string;
  link: string;
};

export type AIAssistantProps = {
  recipe?: RecipeData;
};

export interface OpenAIRecipeResponse {
  success: boolean;
  recipe?: {
    title: string;
    description: string;
    introduction?: string;
    ingredients: string[];
    instructions: string[];
    tips?: string[];
    prepTime?: string;
    cookTime?: string;
    servings?: number | string;
    imageUrl?: string;
  };
  error?: string;
}

export interface AIAssistantContextType {
  isOpen: boolean;
  openAssistant: () => void;
  closeAssistant: () => void;
  toggleAssistant: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  recipeText: string;
  setRecipeText: (text: string) => void;
  recipePrompt: string;
  setRecipePrompt: (prompt: string) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
}
