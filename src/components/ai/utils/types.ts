
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachedRecipe?: RecipeSearchResult;
  attachedBook?: BookSearchResult;
  attachedChallenge?: ChallengeSearchResult;
  isGenerating?: boolean;
}

export interface RecipeSearchResult {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  isGenerated?: boolean;
}

export interface BookSearchResult {
  title: string;
  author: string;
  description: string;
  imageUrl: string;
  link: string;
}

export interface ChallengeSearchResult {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

export interface OpenAIRecipeResponse {
  recipe: {
    title: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    tips?: string[];
    prepTime?: string;
    cookTime?: string;
    servings?: number;
  };
}
