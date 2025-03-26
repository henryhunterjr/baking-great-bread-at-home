import { ChatMessage } from '../../../utils/types';
import { searchRecipes, handleGenerateRecipe } from '../../../utils/helpers';
import { 
  searchBlogWithAI, 
  generateRecipeWithOpenAI, 
  isAIConfigured 
} from '@/lib/ai-services';

// Handle recipe search requests
export const handleRecipeRequest = async (
  query: string,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setIsProcessing: (value: boolean) => void
): Promise<void> => {
  // Log the search query for debugging
  console.log(`[handleRecipeRequest] Searching for recipe: "${query}"`);
  
  // Add a temporary message showing the assistant is searching
  const searchingMessage: ChatMessage = {
    role: 'assistant',
    content: "Searching for recipes related to your query...",
    timestamp: new Date(),
    isGenerating: true
  };
  
  setMessages(prev => [...prev, searchingMessage]);
  
  try {
    // First, try local search which has been improved
    const searchResults = await searchRecipes(query);
    
    if (searchResults.length > 0) {
      const recipe = searchResults[0]; // Use the top matching recipe
      
      // Create a more natural response based on the original query
      let responseText = `I found a recipe that matches your search: ${recipe.title}. Here it is!`;
      
      const responseMessage: ChatMessage = {
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
        attachedRecipe: recipe
      };
      
      // Replace the searching message with the actual response
      setMessages(prev => prev.map(msg => 
        msg === searchingMessage ? responseMessage : msg
      ));
      
      setIsProcessing(false);
      return;
    }
    
    // If no results found in local search, try the AI-powered search if configured
    if (isAIConfigured()) {
      // Clean and extract key terms from the query
      const searchTerms = query.toLowerCase()
        .replace(/do you have a recipe for/i, '')
        .replace(/do you have a/i, '')
        .replace(/can you find/i, '')
        .replace(/can you search/i, '')
        .replace(/can you help me find/i, '')
        .replace(/will you find me a/i, '')
        .replace(/find me a/i, '')
        .replace(/for/i, '')
        .replace(/a/i, '')
        .replace(/me/i, '')
        .replace(/please/i, '')
        .trim();
      
      console.log(`[handleRecipeRequest] Extracted search terms for AI: "${searchTerms}"`);
      
      // Use AI to search for recipes
      const searchResponse = await searchBlogWithAI(searchTerms);
      
      if (searchResponse.success && searchResponse.results && searchResponse.results.length > 0) {
        const recipe = searchResponse.results[0];
        
        const responseMessage: ChatMessage = {
          role: 'assistant',
          content: `I found a recipe that matches your search: ${recipe.title}. Here it is!`,
          timestamp: new Date(),
          attachedRecipe: {
            title: recipe.title,
            description: recipe.excerpt,
            imageUrl: recipe.imageUrl || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a',
            link: recipe.link
          }
        };
        
        // Replace the searching message with the actual response
        setMessages(prev => prev.map(msg => 
          msg === searchingMessage ? responseMessage : msg
        ));
        
        setIsProcessing(false);
        return;
      }
    }
    
    // If all else fails, try to generate a recipe with AI if configured
    if (isAIConfigured()) {
      try {
        // Extract a cleaner version of the query for generation
        const generationQuery = query.toLowerCase()
          .replace(/find me/i, '')
          .replace(/can you find/i, '')
          .replace(/are there/i, '')
          .replace(/do you have/i, '')
          .replace(/a recipe for/i, '')
          .replace(/from the blog/i, '')
          .replace(/on the blog/i, '')
          .replace(/search the blog for/i, '')
          .replace(/please/i, '')
          .trim();
          
        console.log(`[handleRecipeRequest] Attempting to generate recipe for: "${generationQuery}"`);
        
        const generatedRecipeResponse = await generateRecipeWithOpenAI(generationQuery);
        
        if (generatedRecipeResponse.success && generatedRecipeResponse.recipe) {
          const responseMessage: ChatMessage = {
            role: 'assistant',
            content: `I couldn't find an existing recipe, so I've created a ${generationQuery} recipe just for you:`,
            timestamp: new Date(),
            attachedRecipe: {
              title: generatedRecipeResponse.recipe.title,
              description: generatedRecipeResponse.recipe.introduction,
              imageUrl: generatedRecipeResponse.recipe.imageUrl,
              link: '#',
              isGenerated: true
            }
          };
          
          // Replace the searching message with the generated recipe
          setMessages(prev => prev.map(msg => 
            msg === searchingMessage ? responseMessage : msg
          ));
          
          setIsProcessing(false);
          return;
        }
      } catch (error) {
        console.error('[handleRecipeRequest] Error generating recipe with AI:', error);
        // Fall through to the default message
      }
    }
    
    // If all else fails, show a fallback message
    const cleanQuery = query.toLowerCase()
      .replace(/find me/i, '')
      .replace(/can you find/i, '')
      .replace(/are there/i, '')
      .replace(/do you have/i, '')
      .replace(/a recipe for/i, '')
      .replace(/from the blog/i, '')
      .replace(/please/i, '')
      .trim();
      
    const fallbackMessage: ChatMessage = {
      role: 'assistant',
      content: `I couldn't find any recipes matching "${cleanQuery}". Would you like me to help you create a custom recipe instead? Just say "Generate a recipe for ${cleanQuery}" and I'll create one for you.`,
      timestamp: new Date()
    };
    
    setMessages(prev => prev.map(msg => 
      msg === searchingMessage ? fallbackMessage : msg
    ));
  } catch (error) {
    console.error('[handleRecipeRequest] Error searching recipes:', error);
    
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
