
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from '../utils/types';
import { searchRecipes, findRelevantBook, getCurrentChallenge, generateRecipeWithAI } from '../utils/aiHelpers';
import { henryQuotes } from '../utils/data';
import MessageList from '../chat/MessageList';
import MessageInputForm from '../chat/MessageInputForm';

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
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let response = '';
      let attachedRecipe: ChatMessage['attachedRecipe'] = undefined;
      let attachedBook: ChatMessage['attachedBook'] = undefined;
      let attachedChallenge: ChatMessage['attachedChallenge'] = undefined;
      let isGenerating = false;
      
      const lowercaseInput = message.toLowerCase();
      
      // Check if the message is asking for a recipe
      const isRecipeRequest = 
        lowercaseInput.includes('recipe') || 
        lowercaseInput.includes('how to make') || 
        lowercaseInput.includes('how do i make') ||
        lowercaseInput.includes('get me a') ||
        lowercaseInput.includes('do you have a');
      
      // Check for recipe names without explicit "recipe" keyword
      const containsRecipeKeywords = [
        'bread', 'loaf', 'sourdough', 'challah', 'rolls', 'buns', 
        'cookies', 'cake', 'pie', 'muffins', 'scones', 'biscuits',
        'cinnamon rolls', 'pastry', 'croissant'
      ].some(keyword => lowercaseInput.includes(keyword));
      
      if (isRecipeRequest || containsRecipeKeywords) {
        // Extract search terms, removing common phrases
        const searchTerms = message
          .replace(/recipe for|how to make|get me a recipe for|do you have a recipe for|can you get me a|can i get a|can you get|get me/gi, '')
          .trim();
        
        if (searchTerms.length > 2) {
          const searchResults = await searchRecipes(searchTerms);
          
          if (searchResults.length > 0) {
            const bestMatch = searchResults[0];
            attachedRecipe = bestMatch;
            
            if (searchTerms.toLowerCase().includes("henry") && searchTerms.toLowerCase().includes("sourdough")) {
              response = `I found Henry's Foolproof Sourdough Loaf recipe for you! This is a reliable and easy sourdough recipe with a touch of sweetness from honey. You can click the link to see the full recipe details and instructions.`;
            } else {
              response = `I found this great recipe for "${bestMatch.title}" that matches what you're looking for! You can click the link to see the full recipe on the blog.`;
              
              if (searchResults.length > 1) {
                response += ` I also found ${searchResults.length - 1} other recipes that might interest you. Would you like to see those as well?`;
              }
            }
          } else {
            // No recipe found, let's try to generate one with OpenAI
            isGenerating = true;
            
            // Add a temporary generating message
            const generatingMessage: ChatMessage = {
              role: 'assistant',
              content: `I'm generating a custom recipe for ${searchTerms} based on Henry's techniques. This will take just a moment...`,
              timestamp: new Date(),
              isGenerating: true
            };
            
            setMessages(prev => [...prev, generatingMessage]);
            
            try {
              const generatedRecipe = await generateRecipeWithAI(searchTerms);
              
              // Remove the generating message
              setMessages(prev => prev.filter(m => !m.isGenerating));
              
              if (generatedRecipe) {
                attachedRecipe = generatedRecipe;
                
                if (searchTerms.toLowerCase().includes("cinnamon rolls") && 
                    searchTerms.toLowerCase().includes("henry")) {
                  response = `I've created Henry's famous Cinnamon Rolls recipe for you! These rolls are based on Henry's signature techniques for perfect texture and flavor. The recipe includes detailed instructions and helpful tips for making them at home.`;
                } else {
                  response = `I've created a custom recipe for ${searchTerms} using Henry's techniques! This recipe is designed to give you the best results at home. Let me know if you'd like me to adjust any part of it.`;
                }
              } else {
                response = `I couldn't find a specific recipe for "${searchTerms}" and wasn't able to generate one at the moment. Would you like me to help you search with different terms?`;
              }
              
              isGenerating = false;
            } catch (error) {
              // Remove the generating message
              setMessages(prev => prev.filter(m => !m.isGenerating));
              console.error("Error generating recipe:", error);
              response = `I tried to create a recipe for "${searchTerms}" but encountered an error. Would you like to try a different search term?`;
              isGenerating = false;
            }
          }
        } else {
          response = "I'd be happy to help you find a recipe! Could you please provide a bit more detail about what kind of recipe you're looking for?";
        }
      }
      else if (lowercaseInput.includes('recipe') && (lowercaseInput.includes('convert') || lowercaseInput.includes('transform'))) {
        response = "I'd be happy to convert a recipe for you! Please go to the Recipe Converter tab and upload an image or paste your recipe text. I'll format it properly for you and offer suggestions for improvements.";
      }
      else if (lowercaseInput.includes('recipe') && (lowercaseInput.includes('create') || lowercaseInput.includes('generate'))) {
        response = "I can help generate a recipe idea! Head to the Recipe Generator tab, describe what you'd like to make, and I'll create a custom recipe for you based on Henry's techniques.";
      }
      else if (lowercaseInput.includes('book') || lowercaseInput.includes('guide')) {
        const relevantBook = findRelevantBook(lowercaseInput);
        
        if (relevantBook) {
          attachedBook = {
            title: relevantBook.title,
            author: relevantBook.author,
            description: relevantBook.description,
            imageUrl: relevantBook.imageUrl,
            link: relevantBook.link
          };
          
          response = `Henry covers this beautifully in "${relevantBook.title}". This book ${relevantBook.description.toLowerCase()} Would you like to know more about this book or any of Henry's other guides?`;
        } else {
          response = "Henry has written several bread baking books for different skill levels and interests. There's 'Vitale Sourdough Mastery' for advanced techniques, 'Sourdough for the Rest of Us' for beginners, 'Baking Great Bread at Home: A Journey Through the Seasons' for seasonal adaptations, and 'From Oven to Market' for those looking to sell their bread. Which one sounds most interesting to you?";
        }
      }
      else if (lowercaseInput.includes('challenge') || lowercaseInput.includes('monthly') || lowercaseInput.includes('current')) {
        const currentChallenge = getCurrentChallenge();
        attachedChallenge = {
          title: currentChallenge.title,
          description: currentChallenge.description,
          imageUrl: currentChallenge.link,
          link: "/challenges"
        };
        
        response = `This month's challenge is all about ${currentChallenge.title.toLowerCase()}! ${currentChallenge.description} Would you like to join or see what others are baking? You can click the link to see the challenge details and community submissions.`;
      }
      else if (lowercaseInput.includes('henry') || lowercaseInput.includes('vitale') || lowercaseInput.includes('who is') || lowercaseInput.includes('about the author')) {
        response = henryQuotes[0];
        
        if (lowercaseInput.includes('more') || lowercaseInput.includes('detail')) {
          response = henryQuotes[1];
        }
      }
      else if (lowercaseInput.includes('hydration')) {
        response = "Hydration in bread baking refers to the ratio of water to flour by weight, expressed as a percentage. For example, a dough with 1000g flour and 700g water has 70% hydration. Higher hydration (75-85%) gives an open, airy crumb, while lower hydration (60-70%) creates a tighter crumb structure. For beginners, Henry recommends starting around 70%. " + henryQuotes[4];
      }
      else if (lowercaseInput.includes('sourdough')) {
        response = "Sourdough bread is made using a natural leaven (starter) of flour and water that contains wild yeast and beneficial bacteria. Keep your starter healthy by feeding it regularly with equal parts flour and water. For the best results, use your starter when it's at peak activity - usually 4-8 hours after feeding when it's doubled in size and looks bubbly. " + henryQuotes[7];
        
        // Check if this might be a recipe request without the word "recipe"
        if (!response.includes("recipe") && lowercaseInput.includes("henry")) {
          const searchResults = await searchRecipes("henry sourdough");
          if (searchResults.length > 0) {
            attachedRecipe = searchResults[0];
            response += "\n\nI've also found Henry's Sourdough Loaf recipe which you might find helpful!";
          }
        }
      }
      else if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi') || lowercaseInput.includes('hey') || lowercaseInput.match(/^(hello|hi|hey|greetings)/)) {
        response = "Hello! I'm your Baking Assistant! I can help you with bread recipes, answer baking questions, search for Henry's recipes, recommend books, tell you about the current baking challenge, or convert recipes from images or text. How can I help you today?";
      }
      else {
        // Check if this might be a specific recipe request without using recipe keywords
        const specialRecipeNames = [
          { term: 'cinnamon rolls', recipe: 'Henry Cinnamon Rolls' },
          { term: 'sourdough', recipe: 'sourdough bread' },
          { term: 'challah', recipe: 'challah bread' },
          { term: 'focaccia', recipe: 'focaccia' },
          { term: 'brioche', recipe: 'brioche' }
        ];
        
        const matchedRecipe = specialRecipeNames.find(item => 
          lowercaseInput.includes(item.term)
        );
        
        if (matchedRecipe) {
          // This might be a recipe request
          isGenerating = true;
          
          // Add a temporary generating message
          const generatingMessage: ChatMessage = {
            role: 'assistant',
            content: `I'm generating a recipe for ${matchedRecipe.recipe}. This will take just a moment...`,
            timestamp: new Date(),
            isGenerating: true
          };
          
          setMessages(prev => [...prev, generatingMessage]);
          
          try {
            const generatedRecipe = await generateRecipeWithAI(matchedRecipe.recipe);
            
            // Remove the generating message
            setMessages(prev => prev.filter(m => !m.isGenerating));
            
            if (generatedRecipe) {
              attachedRecipe = generatedRecipe;
              response = `I've created a recipe for ${matchedRecipe.recipe} that I think you'll enjoy! This recipe uses Henry's techniques for the best results. Let me know if you have any questions about the preparation.`;
            } else {
              const searchResults = await searchRecipes(matchedRecipe.recipe);
              if (searchResults.length > 0) {
                attachedRecipe = searchResults[0];
                response = `I found this great recipe for ${matchedRecipe.recipe} that you might enjoy! You can click the link to see the full recipe details.`;
              } else {
                response = `I'd be happy to help you with ${matchedRecipe.term}! What specifically would you like to know about making ${matchedRecipe.term}?`;
              }
            }
            
            isGenerating = false;
          } catch (error) {
            // Remove the generating message
            setMessages(prev => prev.filter(m => !m.isGenerating));
            console.error("Error generating recipe:", error);
            response = `I'd be happy to help you with ${matchedRecipe.term}! What specifically would you like to know about making ${matchedRecipe.term}?`;
            isGenerating = false;
          }
        } else {
          // General response for unclear queries
          const randomQuote = henryQuotes[Math.floor(Math.random() * henryQuotes.length)];
          response = `That's an interesting baking question! While I don't have specific information on that topic right now, I can help with recipe conversion, bread techniques, troubleshooting common issues, or generating new recipe ideas. Feel free to ask something else or try one of the other tabs for recipe conversion or generation.\n\nAs Henry always says, "${randomQuote}"`;
        }
      }
      
      if (!isGenerating) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: response,
          timestamp: new Date(),
          attachedRecipe,
          attachedBook,
          attachedChallenge
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
    } finally {
      setIsProcessing(false);
    }
  };

  const showSuggestedQuestions = !messages.some(m => m.role === 'user');

  return (
    <div className="flex-1 flex flex-col p-0 h-full">
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
