
import { ChatMessage } from '../../../utils/types';

// Handle recipe conversion requests
export const handleConvertRequest = (
  query: string,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setRecipeText: (text: string) => void,
  setActiveTab: (tab: string) => void,
  setIsProcessing: (value: boolean) => void
): void => {
  // Move to the convert tab with the entered text
  setRecipeText(query);
  
  const convertMessage: ChatMessage = {
    role: 'assistant',
    content: "I'll help you convert that recipe. I've opened the recipe converter for you. Just enter or paste the full recipe text there and I'll format it properly.",
    timestamp: new Date()
  };
  
  setMessages(prev => [...prev, convertMessage]);
  setActiveTab('convert');
  setIsProcessing(false);
};
