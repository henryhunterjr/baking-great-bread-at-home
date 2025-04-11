
import { ChatMessage } from '../../../utils/types';
import { searchRecipes, handleGenerateRecipe } from '../../../utils/helpers';
import { 
  searchBlogWithAI, 
  generateRecipeWithOpenAI, 
  isAIConfigured 
} from '@/lib/ai-services';
import { RecipeData } from '@/types/recipeTypes';
import { isRecipeQuestion } from '@/utils/blogSearch';

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
    // Special handling for Henry's Foolproof Sourdough
    const isHenryQuery = query.toLowerCase().includes('henry') || 
                         query.toLowerCase().includes('foolproof');
    
    if (isHenryQuery) {
      // Return Henry's Foolproof Sourdough recipe directly
      const recipe = {
        title: "Henry's Foolproof Sourdough Loaf",
        description: "A reliable and easy sourdough recipe that produces consistent results every time, ideal for both beginners and experienced bakers.",
        imageUrl: "/lovable-uploads/a815213f-9e06-4587-b2a7-a12b1317b262.png",
        link: "/recipes/henry-foolproof-sourdough"
      };
      
      // Create a complete recipe with all necessary fields for display
      const fullRecipeData: RecipeData = {
        title: recipe.title,
        introduction: recipe.description || "A delicious recipe to try!",
        ingredients: [
          "500g bread flour",
          "350g water",
          "10g salt",
          "100g active sourdough starter",
          "Rice flour for dusting"
        ],
        instructions: [
          "Mix flour, water, and starter in a large bowl. Let rest for 30 minutes (autolyse).",
          "Add salt and mix until fully incorporated.",
          "Perform 3-4 sets of stretch and folds at 30-minute intervals.",
          "Let the dough bulk ferment for 4-5 hours at room temperature until doubled in size.",
          "Shape the dough and place in a floured banneton or bowl.",
          "Cover and refrigerate overnight (8-12 hours).",
          "Preheat oven with Dutch oven to 500°F (260°C).",
          "Score the dough and bake covered for 20 minutes, then uncovered for 20-25 minutes until golden brown.",
          "Cool completely on a wire rack before slicing."
        ],
        notes: ["For best results, use a kitchen scale to measure ingredients by weight."],
        tips: ["The dough should pass the window pane test after stretch and folds."],
        imageUrl: recipe.imageUrl || "/lovable-uploads/a815213f-9e06-4587-b2a7-a12b1317b262.png",
        servings: "1 loaf",
        isConverted: true
      };
      
      // Create a more natural response based on the original query
      const responseMessage: ChatMessage = {
        role: 'assistant',
        content: `Here's Henry's Foolproof Sourdough recipe that you requested. I've displayed the full recipe details on the left panel for easier reading.`,
        timestamp: new Date(),
        attachedRecipe: {
          title: recipe.title,
          description: recipe.description || "A delicious recipe to try!",
          imageUrl: recipe.imageUrl || "/lovable-uploads/a815213f-9e06-4587-b2a7-a12b1317b262.png",
          link: recipe.link || "",
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
    
    // First, try searching for recipes using our improved searchRecipes function
    const searchResults = await searchRecipes(query);
    
    if (searchResults.length > 0) {
      // Use the top matching recipe
      const recipe = searchResults[0]; 
      
      // Create a complete recipe with all necessary fields for display
      const fullRecipeData: RecipeData = {
        title: recipe.title,
        introduction: recipe.description || "A delicious recipe to try!",
        ingredients: [
          "500g bread flour",
          "350g water",
          "10g salt",
          "100g active sourdough starter",
          "Rice flour for dusting"
        ],
        instructions: [
          "Mix flour, water, and starter in a large bowl. Let rest for 30 minutes (autolyse).",
          "Add salt and mix until fully incorporated.",
          "Perform 3-4 sets of stretch and folds at 30-minute intervals.",
          "Let the dough bulk ferment for 4-5 hours at room temperature until doubled in size.",
          "Shape the dough and place in a floured banneton or bowl.",
          "Cover and refrigerate overnight (8-12 hours).",
          "Preheat oven with Dutch oven to 500°F (260°C).",
          "Score the dough and bake covered for 20 minutes, then uncovered for 20-25 minutes until golden brown.",
          "Cool completely on a wire rack before slicing."
        ],
        notes: ["For best results, use a kitchen scale to measure ingredients by weight."],
        tips: ["The dough should pass the window pane test after stretch and folds."],
        imageUrl: recipe.imageUrl || "/lovable-uploads/a815213f-9e06-4587-b2a7-a12b1317b262.png",
        servings: "1 loaf",
        isConverted: true
      };
      
      // Create a more natural response based on the original query
      const responseMessage: ChatMessage = {
        role: 'assistant',
        content: `Here's the recipe for ${recipe.title}. I've displayed the full recipe details on the left panel for easier reading.`,
        timestamp: new Date(),
        attachedRecipe: {
          title: recipe.title,
          description: recipe.description || "A delicious recipe to try!",
          imageUrl: recipe.imageUrl || "/lovable-uploads/a815213f-9e06-4587-b2a7-a12b1317b262.png",
          link: recipe.link || "",
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

    // Try to search blog with AI
    if (isAIConfigured()) {
      try {
        // Search blog using AI
        const blogResults = await searchBlogWithAI(query);
        
        if (blogResults.success && blogResults.results && blogResults.results.length > 0) {
          const blogRecipe = blogResults.results[0];
          
          // Create a response with the blog recipe
          const responseMessage: ChatMessage = {
            role: 'assistant',
            content: `I found a recipe for "${blogRecipe.title}" on the blog. Would you like me to show you the details?`,
            timestamp: new Date(),
            attachedRecipe: {
              title: blogRecipe.title,
              description: blogRecipe.excerpt || "A delicious recipe from the blog.",
              imageUrl: blogRecipe.imageUrl || "https://images.unsplash.com/photo-1555507036-ab1f4038808a",
              link: blogRecipe.link || "",
              isGenerated: false
            }
          };
          
          setMessages(prev => prev.map(msg => 
            msg === searchingMessage ? responseMessage : msg
          ));
          
          setIsProcessing(false);
          return;
        }
      } catch (error) {
        console.error('Error searching blog:', error);
        // Continue to next search method if blog search fails
      }
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
