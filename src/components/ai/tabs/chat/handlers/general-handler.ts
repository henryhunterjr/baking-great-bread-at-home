
import { ChatMessage } from '../../../utils/types';

// Handle general chat requests
export const handleGeneralRequest = (
  query: string,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setIsProcessing: (value: boolean) => void
): void => {
  // Simulate different responses based on query content
  let response = "";
  
  if (query.toLowerCase().includes('hello') || query.toLowerCase().includes('hi')) {
    response = "Hello! I'm your baking assistant. I can help you find recipes, recommend books, tell you about our current baking challenge, and more. What can I help you with today?";
  } else if (query.toLowerCase().includes('help') || query.toLowerCase().includes('what can you do')) {
    response = "I can help you with various baking-related tasks, such as:\n\n- Finding recipes (just ask for a specific recipe)\n- Converting and formatting recipes\n- Generating custom recipes\n- Recommending baking books\n- Telling you about our current baking challenge\n\nJust let me know what you need!";
  } else if (query.toLowerCase().includes('thank')) {
    response = "You're welcome! Happy baking!";
  } else if (query.toLowerCase().includes('sourdough')) {
    // Special case for sourdough since the user mentioned having trouble with this
    response = "I'd be happy to help with sourdough recipes! Would you like me to find you an existing sourdough recipe, or generate a custom sourdough recipe for you?";
  } else {
    response = "I'm here to help with bread and baking-related questions. I can find recipes, convert recipes, generate custom recipes, recommend books, or tell you about our baking challenges. How can I help you with one of these topics?";
  }
  
  const assistantMessage: ChatMessage = {
    role: 'assistant',
    content: response,
    timestamp: new Date()
  };
  
  setMessages(prev => [...prev, assistantMessage]);
  setIsProcessing(false);
};
