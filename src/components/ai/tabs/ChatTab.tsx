
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, MessageSquare } from 'lucide-react';
import { searchRecipes, findRelevantBook, getCurrentChallenge, generateRecipeWithAI } from '../utils/aiHelpers';
import { ChatMessage } from '../utils/types';
import MessageList from '../chat/MessageList';
import MessageInputForm from '../chat/MessageInputForm';
import SuggestedQuestions from '../chat/SuggestedQuestions';
import { challengeImages, DEFAULT_CHALLENGE_IMAGE } from '@/data/challengeImages';

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
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isProcessing) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    
    try {
      const lowerInput = input.toLowerCase();
      
      // Check for recipe search request
      if (lowerInput.includes('recipe') || lowerInput.includes('bread') || 
          lowerInput.includes('bake') || lowerInput.includes('roll') ||
          lowerInput.includes('find') || lowerInput.includes('search')) {
        await handleRecipeRequest(input);
      }
      // Check for book search request
      else if (lowerInput.includes('book') || lowerInput.includes('reading')) {
        await handleBookRequest(input);
      }
      // Check for challenge request
      else if (lowerInput.includes('challenge') || lowerInput.includes('contest')) {
        await handleChallengeRequest();
      }
      // Check for text conversion request
      else if (lowerInput.includes('convert') || lowerInput.includes('translate')) {
        handleConvertRequest(input);
      }
      // Check for recipe generation request
      else if (lowerInput.includes('create') || lowerInput.includes('generate') || 
               lowerInput.includes('make me') || lowerInput.includes('custom')) {
        await handleGenerateRequest(input);
      }
      // Fall back to general response
      else {
        handleGeneralRequest(input);
      }
    } catch (error) {
      console.error('Error handling message:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRecipeRequest = async (query: string) => {
    // Log the search query for debugging
    console.log(`Searching for recipe: "${query}"`);
    
    // Add a temporary message showing the assistant is searching
    const searchingMessage: ChatMessage = {
      role: 'assistant',
      content: "Searching for recipes related to your query...",
      timestamp: new Date(),
      isGenerating: true
    };
    
    setMessages(prev => [...prev, searchingMessage]);
    
    try {
      // Extract key terms from the query
      const searchTerms = query.toLowerCase()
        .replace(/do you have a recipe for/i, '')
        .replace(/can you find/i, '')
        .replace(/can you search/i, '')
        .replace(/can you help me find/i, '')
        .replace(/for/i, '')
        .replace(/a/i, '')
        .trim();
      
      console.log(`Extracted search terms: "${searchTerms}"`);
      
      // Search for recipes
      const recipes = await searchRecipes(searchTerms);
      
      let responseMessage: ChatMessage;
      
      if (recipes.length > 0) {
        const recipe = recipes[0]; // Use the top matching recipe
        responseMessage = {
          role: 'assistant',
          content: `I found a recipe that matches your search for "${query}": ${recipe.title}. Here it is!`,
          timestamp: new Date(),
          attachedRecipe: recipe
        };
      } else {
        // No regular recipes found, try to generate a recipe with AI
        const generatedRecipe = await generateRecipeWithAI(searchTerms);
        
        if (generatedRecipe) {
          responseMessage = {
            role: 'assistant',
            content: `I don't have an exact match for "${query}", but I've generated a recipe for you based on your request:`,
            timestamp: new Date(),
            attachedRecipe: generatedRecipe
          };
        } else {
          responseMessage = {
            role: 'assistant',
            content: `I couldn't find any recipes matching "${query}". Would you like me to help you create a custom recipe instead? Just say "Generate a recipe for [your idea]" and I'll create one for you.`,
            timestamp: new Date()
          };
        }
      }
      
      // Replace the searching message with the actual response
      setMessages(prev => prev.map(msg => 
        msg === searchingMessage ? responseMessage : msg
      ));
    } catch (error) {
      console.error('Error searching recipes:', error);
      
      // Replace the searching message with an error message
      setMessages(prev => prev.map(msg => 
        msg === searchingMessage ? {
          role: 'assistant',
          content: "I'm sorry, I couldn't find recipes at the moment. Please try again later.",
          timestamp: new Date()
        } : msg
      ));
    }
  };

  const handleBookRequest = async (query: string) => {
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
  };

  const handleChallengeRequest = async () => {
    const challenge = getCurrentChallenge();
    
    // Get the challenge image from the mapping or use default
    const imageUrl = challenge.id && challengeImages[challenge.id] 
      ? challengeImages[challenge.id] 
      : DEFAULT_CHALLENGE_IMAGE;
    
    const challengeMessage: ChatMessage = {
      role: 'assistant',
      content: "Here's the current baking challenge. Join in and share your creation!",
      timestamp: new Date(),
      attachedChallenge: {
        ...challenge,
        imageUrl: imageUrl,
        link: challenge.link || '#',
        isCurrent: true
      }
    };
    
    setMessages(prev => [...prev, challengeMessage]);
  };

  const handleConvertRequest = (query: string) => {
    // Move to the convert tab with the entered text
    setRecipeText(query);
    
    const convertMessage: ChatMessage = {
      role: 'assistant',
      content: "I'll help you convert that recipe. I've opened the recipe converter for you. Just enter or paste the full recipe text there and I'll format it properly.",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, convertMessage]);
    setActiveTab('convert');
  };

  const handleGenerateRequest = async (query: string) => {
    // Move to the generate tab with the entered prompt
    setRecipePrompt(query);
    
    const generateMessage: ChatMessage = {
      role: 'assistant',
      content: "I'd be happy to generate a custom recipe for you! I've opened the recipe generator. Provide some details about what you're looking for, and I'll create a recipe tailored to your request.",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, generateMessage]);
    setActiveTab('generate');
  };

  const handleGeneralRequest = (query: string) => {
    // Simulate different responses based on query content
    let response = "";
    
    if (query.toLowerCase().includes('hello') || query.toLowerCase().includes('hi')) {
      response = "Hello! I'm your baking assistant. I can help you find recipes, recommend books, tell you about our current baking challenge, and more. What can I help you with today?";
    } else if (query.toLowerCase().includes('help') || query.toLowerCase().includes('what can you do')) {
      response = "I can help you with various baking-related tasks, such as:\n\n- Finding recipes (just ask for a specific recipe)\n- Converting and formatting recipes\n- Generating custom recipes\n- Recommending baking books\n- Telling you about our current baking challenge\n\nJust let me know what you need!";
    } else if (query.toLowerCase().includes('thank')) {
      response = "You're welcome! Happy baking!";
    } else {
      response = "I'm not quite sure how to help with that specific request. I'm best at finding recipes, converting recipes, generating custom recipes, recommending books, or telling you about our baking challenges. How can I help you with one of these topics?";
    }
    
    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, assistantMessage]);
  };
  
  const suggestedQuestions = [
    "Find me a sourdough recipe",
    "What's the current baking challenge?",
    "Generate a bread recipe with rosemary",
    "Convert my recipe for whole wheat bread",
    "Recommend a good bread baking book",
    "Do you have a recipe for cinnamon rolls?"
  ];
  
  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <MessageList 
          messages={messages}
          isProcessing={isProcessing}
        />
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <MessageInputForm 
          onSendMessage={() => {}} // Placeholder
          isProcessing={isProcessing}
          input={input}
          setInput={setInput}
          onSubmit={handleSendMessage}
          isLoading={isProcessing}
          showSuggestedQuestions={false}
        />
        
        {messages.length <= 1 && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">Try asking:</p>
            <SuggestedQuestions 
              onQuestionSelect={setInput}
              questions={suggestedQuestions}
              onSelect={setInput}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatTab;
