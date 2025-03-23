
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from '../utils/types';
import { searchRecipes, findRelevantBook, getCurrentChallenge } from '../utils/aiHelpers';
import { henryQuotes } from '../utils/data';
import MessageList from '../chat/MessageList';
import MessageInputForm from '../chat/MessageInputForm';
import { getChatCompletion } from '@/lib/ai-services/openai-service';
import { isApiKeyConfigured } from '@/lib/ai-services/ai-config';

interface ChatTabProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setActiveTab: (tab: string) => void;
  setRecipeText: (text: string) => void;
  setRecipePrompt: (prompt: string) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
}

const ChatTab: React.FC<ChatTabProps> = ({
  messages,
  setMessages,
  setActiveTab,
  setRecipeText,
  setRecipePrompt,
  isProcessing,
  setIsProcessing
}) => {
  const { toast } = useToast();
  const [apiKeyMissing, setApiKeyMissing] = useState(!isApiKeyConfigured());
  
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    try {
      const lowercaseInput = message.toLowerCase();
      
      // Handle special navigation cases without using API
      if (lowercaseInput.includes('recipe') && (lowercaseInput.includes('convert') || lowercaseInput.includes('transform'))) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: "I'd be happy to convert a recipe for you! Please go to the Recipe Converter tab and upload an image or paste your recipe text. I'll format it properly for you and offer suggestions for improvements.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        return;
      }
      else if (lowercaseInput.includes('recipe') && (lowercaseInput.includes('create') || lowercaseInput.includes('generate'))) {
        if (lowercaseInput.includes('bread') || lowercaseInput.includes('challah') || lowercaseInput.includes('sourdough') || lowercaseInput.includes('bagel')) {
          setRecipePrompt(message.replace(/create|generate|recipe|make|bread/gi, '').trim());
          setActiveTab('generate');
        }
        
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: "I can help generate a recipe idea! Head to the Recipe Generator tab, describe what you'd like to make, and I'll create a custom recipe for you based on Henry's techniques.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        return;
      }
      
      // Handle search cases
      if (lowercaseInput.includes('recipe') && (lowercaseInput.includes('find') || lowercaseInput.includes('search') || lowercaseInput.includes('looking for'))) {
        const searchTerms = message.replace(/recipe|find|search|looking for|can you find|do you have|i want/gi, '').trim();
        
        if (searchTerms.length > 2) {
          const searchResults = await searchRecipes(searchTerms);
          
          if (searchResults.length > 0) {
            const bestMatch = searchResults[0];
            
            const assistantMessage: ChatMessage = {
              role: 'assistant',
              content: `I found this great recipe for "${bestMatch.title}" that might be what you're looking for! You can click the link to see the full recipe on the blog.`,
              timestamp: new Date(),
              attachedRecipe: bestMatch
            };
            
            if (searchResults.length > 1) {
              assistantMessage.content += ` I also found ${searchResults.length - 1} other recipes that might interest you. Would you like to see those as well?`;
            }
            
            setMessages(prev => [...prev, assistantMessage]);
            return;
          }
        }
      }
      
      // Handle book cases
      if (lowercaseInput.includes('book') || lowercaseInput.includes('guide')) {
        const relevantBook = findRelevantBook(lowercaseInput);
        
        if (relevantBook) {
          const attachedBook = {
            title: relevantBook.title,
            author: relevantBook.author,
            description: relevantBook.description,
            imageUrl: relevantBook.imageUrl,
            link: relevantBook.link
          };
          
          const assistantMessage: ChatMessage = {
            role: 'assistant',
            content: `Henry covers this beautifully in "${relevantBook.title}". This book ${relevantBook.description.toLowerCase()} Would you like to know more about this book or any of Henry's other guides?`,
            timestamp: new Date(),
            attachedBook
          };
          
          setMessages(prev => [...prev, assistantMessage]);
          return;
        }
      }
      
      // Handle challenge cases
      if (lowercaseInput.includes('challenge') || lowercaseInput.includes('monthly') || lowercaseInput.includes('current')) {
        const currentChallenge = getCurrentChallenge();
        const attachedChallenge = {
          title: currentChallenge.title,
          description: currentChallenge.description,
          imageUrl: currentChallenge.link,
          link: "/challenges"
        };
        
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: `This month's challenge is all about ${currentChallenge.title.toLowerCase()}! ${currentChallenge.description} Would you like to join or see what others are baking? You can click the link to see the challenge details and community submissions.`,
          timestamp: new Date(),
          attachedChallenge
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        return;
      }
      
      // For all other questions, use OpenAI
      if (apiKeyMissing) {
        // If no API key, use a fallback response
        const randomQuote = henryQuotes[Math.floor(Math.random() * henryQuotes.length)];
        
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: `I'm currently running in demo mode without an OpenAI API key. In a fully implemented version, I would provide a detailed answer to your question. For now, here's one of Henry's baking insights: "${randomQuote}"`,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Get response from OpenAI
        const context = "You are Henry's AI assistant specializing in bread baking. Your name is Henry's Baking Assistant. " +
                        "Provide helpful, concise answers about bread baking techniques, recipes, and troubleshooting. " +
                        "Use a friendly, informative tone. Reference Henry's baking philosophy and quotes when appropriate. " +
                        "Keep responses under 150 words unless explaining a complex technique.";
        
        const aiResponse = await getChatCompletion(message, context);
        
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process your message. Please try again.",
      });
      
      // Add fallback response
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. This could be due to API limits or connection issues. Please try again in a moment.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const showSuggestedQuestions = !messages.some(m => m.role === 'user');

  return (
    <div className="flex-1 flex flex-col p-0 h-full">
      {apiKeyMissing && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 m-4 rounded">
          <div className="flex items-start">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Running in demo mode. For full AI capabilities, please provide an OpenAI API key in the environment variable VITE_OPENAI_API_KEY.
              </p>
            </div>
          </div>
        </div>
      )}
      <MessageList 
        messages={messages} 
        isProcessing={isProcessing} 
      />
      <MessageInputForm 
        onSendMessage={handleSendMessage} 
        isProcessing={isProcessing}
        showSuggestedQuestions={showSuggestedQuestions}
      />
    </div>
  );
};

export default ChatTab;
