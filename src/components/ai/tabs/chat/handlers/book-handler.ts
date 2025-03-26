
import { ChatMessage } from '../../../utils/types';
import { findRelevantBook } from '../../../utils/aiHelpers';

// Handle book recommendation requests
export const handleBookRequest = async (
  query: string,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setIsProcessing: (value: boolean) => void
): Promise<void> => {
  const book = findRelevantBook(query);
  
  if (book) {
    const bookMessage: ChatMessage = {
      role: 'assistant',
      content: `Based on your interest in ${query}, I recommend this book:`,
      timestamp: new Date(),
      attachedBook: book
    };
    
    setMessages(prev => [...prev, bookMessage]);
  } else {
    const noBookMessage: ChatMessage = {
      role: 'assistant',
      content: "I don't have a specific book recommendation that matches your query. Would you like to see our complete collection of recommended baking books?",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, noBookMessage]);
  }
  
  setIsProcessing(false);
};
