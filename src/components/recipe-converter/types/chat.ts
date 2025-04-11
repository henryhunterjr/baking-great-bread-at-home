
export interface ChatAction {
  label: string;
  value: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  isGenerating?: boolean;
  actions?: ChatAction[];
  attachedRecipe?: {
    title: string;
    description: string;
    imageUrl: string;
    link: string;
    isGenerated?: boolean;
  };
}
