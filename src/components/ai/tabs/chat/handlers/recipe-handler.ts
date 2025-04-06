
import { ChatMessage } from '../../../utils/types';
import { searchRecipes, handleGenerateRecipe } from '../../../utils/helpers';
import { 
  searchBlogWithAI, 
  generateRecipeWithOpenAI, 
  isAIConfigured 
} from '@/lib/ai-services';
import { RecipeData } from '@/types/recipeTypes';

// This file is for handling recipe search requests in the chat

// Enhanced recipe search and response handler
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
      
      // Create a complete recipe with all necessary fields
      const fullRecipeData: RecipeData = {
        title: recipe.title,
        introduction: recipe.description,
        ingredients: [
          "2-3 ripe bananas, mashed",
          "1/3 cup melted butter",
          "1 teaspoon baking soda",
          "Pinch of salt",
          "3/4 cup sugar",
          "1 large egg, beaten",
          "1 teaspoon vanilla extract",
          "1 1/2 cups all-purpose flour"
        ],
        instructions: [
          "Preheat the oven to 350°F (175°C) and butter a 4x8-inch loaf pan.",
          "In a mixing bowl, mash the ripe bananas with a fork until smooth.",
          "Stir the melted butter into the mashed bananas.",
          "Mix in the baking soda and salt.",
          "Stir in the sugar, beaten egg, and vanilla extract.",
          "Mix in the flour.",
          "Pour the batter into the prepared loaf pan and bake for 50-60 minutes.",
          "Remove from oven and let cool in the pan for a few minutes. Then remove from the pan and let cool completely before slicing."
        ],
        notes: ["You can add 1/2 cup of chopped nuts or chocolate chips for extra flavor."],
        imageUrl: recipe.imageUrl,
        isConverted: true
      };
      
      // Create a more natural response based on the original query
      const responseMessage: ChatMessage = {
        role: 'assistant',
        content: `I found a recipe that matches your search: ${recipe.title}. Here it is!`,
        timestamp: new Date(),
        attachedRecipe: {
          title: recipe.title,
          description: recipe.description,
          imageUrl: recipe.imageUrl,
          link: recipe.link,
          fullRecipe: fullRecipeData,
          isGenerated: true
        }
      };
      
      // Replace the searching message with the actual response
      setMessages(prev => prev.map(msg => 
        msg === searchingMessage ? responseMessage : msg
      ));
      
      setIsProcessing(false);
      return;
    }
    
    // If all search methods fail, show a fallback message
    const fallbackMessage: ChatMessage = {
      role: 'assistant',
      content: `I couldn't find a specific recipe for "${query.trim()}". Would you like me to help you create a custom recipe instead? Just ask me to "Generate a recipe for ${query.trim()}" and I'll create one for you.`,
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
