
import { ChatMessage } from '../../../utils/types';
import { generateRecipeWithOpenAI, isAIConfigured } from '@/lib/ai-services';

// Handle recipe generation requests
export const handleGenerateRequest = async (
  query: string,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setRecipePrompt: (prompt: string) => void,
  setActiveTab: (tab: string) => void,
  setIsProcessing: (value: boolean) => void
): Promise<void> => {
  // Check if AI is configured
  if (isAIConfigured()) {
    // Add a message to indicate we're generating the recipe
    const generatingMessage: ChatMessage = {
      role: 'assistant',
      content: "I'm generating a custom recipe for you based on your request...",
      timestamp: new Date(),
      isGenerating: true
    };
    
    setMessages(prev => [...prev, generatingMessage]);
    
    try {
      // Extract the actual recipe request
      const recipeRequest = query.toLowerCase()
        .replace(/create/i, '')
        .replace(/generate/i, '')
        .replace(/make me/i, '')
        .replace(/a recipe for/i, '')
        .replace(/please/i, '')
        .trim();
        
      // Generate the recipe with OpenAI directly
      const generatedRecipeResponse = await generateRecipeWithOpenAI(recipeRequest);
      
      if (generatedRecipeResponse.success && generatedRecipeResponse.recipe) {
        // Replace the generating message with the actual response
        setMessages(prev => prev.map(msg => 
          msg === generatingMessage ? {
            role: 'assistant',
            content: `Here's a ${recipeRequest} recipe I've created for you:`,
            timestamp: new Date(),
            attachedRecipe: {
              title: generatedRecipeResponse.recipe.title,
              description: generatedRecipeResponse.recipe.introduction,
              imageUrl: generatedRecipeResponse.recipe.imageUrl,
              link: '#',
              isGenerated: true
            }
          } : msg
        ));
        
        setIsProcessing(false);
        return;
      } else {
        throw new Error('Failed to generate recipe');
      }
    } catch (error) {
      console.error('Error generating recipe with AI:', error);
      // Fall through to the default behavior
      
      // Replace the generating message with an error
      setMessages(prev => prev.map(msg => 
        msg.isGenerating ? {
          role: 'assistant',
          content: "I'm sorry, I had trouble generating that recipe. Let's try a different approach.",
          timestamp: new Date()
        } : msg
      ));
    }
  }
  
  // Default behavior (no AI or AI generation failed)
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
