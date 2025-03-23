import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from '../utils/types';
import { searchRecipes, findRelevantBook, getCurrentChallenge } from '../utils/aiHelpers';
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
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      let response = '';
      let attachedRecipe: ChatMessage['attachedRecipe'] = undefined;
      let attachedBook: ChatMessage['attachedBook'] = undefined;
      let attachedChallenge: ChatMessage['attachedChallenge'] = undefined;
      
      const lowercaseInput = message.toLowerCase();
      
      if (lowercaseInput.includes('recipe') && (lowercaseInput.includes('convert') || lowercaseInput.includes('transform'))) {
        response = "I'd be happy to convert a recipe for you! Please go to the Recipe Converter tab and upload an image or paste your recipe text. I'll format it properly for you and offer suggestions for improvements.";
      }
      else if (lowercaseInput.includes('recipe') && (lowercaseInput.includes('create') || lowercaseInput.includes('generate'))) {
        response = "I can help generate a recipe idea! Head to the Recipe Generator tab, describe what you'd like to make, and I'll create a custom recipe for you based on Henry's techniques.";
      }
      else if (lowercaseInput.includes('recipe') && (lowercaseInput.includes('find') || lowercaseInput.includes('search') || lowercaseInput.includes('looking for'))) {
        const searchTerms = message.replace(/recipe|find|search|looking for|can you find|do you have|i want/gi, '').trim();
        
        if (searchTerms.length > 2) {
          const searchResults = await searchRecipes(searchTerms);
          
          if (searchResults.length > 0) {
            const bestMatch = searchResults[0];
            attachedRecipe = bestMatch;
            
            response = `I found this great recipe for "${bestMatch.title}" that might be what you're looking for! You can click the link to see the full recipe on the blog.`;
            
            if (searchResults.length > 1) {
              response += ` I also found ${searchResults.length - 1} other recipes that might interest you. Would you like to see those as well?`;
            }
          } else {
            response = `I couldn't find a specific recipe for "${searchTerms}". Would you like me to help you generate a custom recipe instead? Or maybe try searching with different terms?`;
          }
        } else {
          response = "I'd be happy to help you find a recipe! Could you please provide a bit more detail about what kind of recipe you're looking for?";
        }
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
      }
      else if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi') || lowercaseInput.includes('hey') || lowercaseInput.match(/^(hello|hi|hey|greetings)/)) {
        response = "Hello! I'm your Baking Assistant, steeped in Henry's baking wisdom. I can help with recipes, technique questions, troubleshooting, or creating new bread ideas. What would you like to learn about today?";
      }
      else {
        const randomQuote = henryQuotes[Math.floor(Math.random() * henryQuotes.length)];
        
        response = `That's an interesting baking question! While I don't have specific information on that topic right now, I can help with recipe conversion, bread techniques, troubleshooting common issues, or generating new recipe ideas. Feel free to ask something else or try one of the other tabs for recipe conversion or generation.\n\nAs Henry always says, "${randomQuote}"`;
      }
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        attachedRecipe,
        attachedBook,
        attachedChallenge
      };
      
      setMessages(prev => [...prev, assistantMessage]);
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
