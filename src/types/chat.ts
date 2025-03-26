
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  isGenerating?: boolean;
  attachedRecipe?: {
    title: string;
    description: string;
    imageUrl: string;
    link: string;
    isGenerated?: boolean;
  };
  attachedBook?: {
    title: string;
    author: string;
    coverImage: string;
    link: string;
    description: string;
  };
  attachedChallenge?: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    link: string;
    isCurrent: boolean;
  };
}
