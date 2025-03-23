
// Common types used across AI assistant components

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachedRecipe?: {
    title: string;
    imageUrl: string;
    link: string;
    description: string;
  };
  attachedBook?: {
    title: string;
    imageUrl: string;
    author: string;
    description: string;
    link: string;
  };
  attachedChallenge?: {
    title: string;
    imageUrl: string;
    link: string;
    description: string;
  };
}

export interface RecipeSearchResult {
  title: string;
  imageUrl: string;
  link: string;
  description: string;
}

export interface HenryBio {
  shortBio: string;
  longBio: string;
  achievements: string;
  philosophy: string;
}
