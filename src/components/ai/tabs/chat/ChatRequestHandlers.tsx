
import { ChatMessage } from '../../utils/types';
import { searchRecipes, findRelevantBook, getCurrentChallenge, generateRecipeWithAI } from '../../utils/aiHelpers';
import { challengeImages, DEFAULT_CHALLENGE_IMAGE } from '@/data/challengeImages';

// Handle recipe search requests
export const handleRecipeRequest = async (
  query: string,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setIsProcessing: (value: boolean) => void
): Promise<void> => {
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
  } finally {
    setIsProcessing(false);
  }
};

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

// Handle baking challenge requests
export const handleChallengeRequest = async (
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setIsProcessing: (value: boolean) => void
): Promise<void> => {
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
  setIsProcessing(false);
};

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

// Handle recipe generation requests
export const handleGenerateRequest = (
  query: string,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setRecipePrompt: (prompt: string) => void,
  setActiveTab: (tab: string) => void,
  setIsProcessing: (value: boolean) => void
): void => {
  // Move to the generate tab with the entered prompt
  setRecipePrompt(query);
  
  const generateMessage: ChatMessage = {
    role: 'assistant',
    content: "I'd be happy to generate a custom recipe for you! I've opened the recipe generator. Provide some details about what you're looking for, and I'll create a recipe tailored to your request.",
    timestamp: new Date()
  };
  
  setMessages(prev => [...prev, generateMessage]);
  setActiveTab('generate');
  setIsProcessing(false);
};

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
  } else {
    response = "I'm not quite sure how to help with that specific request. I'm best at finding recipes, converting recipes, generating custom recipes, recommending books, or telling you about our baking challenges. How can I help you with one of these topics?";
  }
  
  const assistantMessage: ChatMessage = {
    role: 'assistant',
    content: response,
    timestamp: new Date()
  };
  
  setMessages(prev => [...prev, assistantMessage]);
  setIsProcessing(false);
};
