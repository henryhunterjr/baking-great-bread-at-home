
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachedRecipe?: RecipeSearchResult;
  attachedBook?: BookSearchResult;
  attachedChallenge?: ChallengeSearchResult;
}

export interface RecipeSearchResult {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
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
