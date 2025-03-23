
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Send, ArrowRight, Book, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from '../utils/types';
import { suggestedQuestions, henryQuotes, henryBio } from '../utils/data';
import { searchRecipes, findRelevantBook, getCurrentChallenge } from '../utils/aiHelpers';

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
  const [chatInput, setChatInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: chatInput,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      let response = '';
      let attachedRecipe: ChatMessage['attachedRecipe'] = undefined;
      let attachedBook: ChatMessage['attachedBook'] = undefined;
      let attachedChallenge: ChatMessage['attachedChallenge'] = undefined;
      
      const lowercaseInput = chatInput.toLowerCase();
      
      if (lowercaseInput.includes('recipe') && (lowercaseInput.includes('convert') || lowercaseInput.includes('transform'))) {
        response = "I'd be happy to convert a recipe for you! Please go to the Recipe Converter tab and upload an image or paste your recipe text. I'll format it properly for you and offer suggestions for improvements.";
      }
      else if (lowercaseInput.includes('recipe') && (lowercaseInput.includes('create') || lowercaseInput.includes('generate'))) {
        response = "I can help generate a recipe idea! Head to the Recipe Generator tab, describe what you'd like to make, and I'll create a custom recipe for you based on Henry's techniques.";
      }
      else if (lowercaseInput.includes('recipe') && (lowercaseInput.includes('find') || lowercaseInput.includes('search') || lowercaseInput.includes('looking for'))) {
        const searchTerms = chatInput.replace(/recipe|find|search|looking for|can you find|do you have|i want/gi, '').trim();
        
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
          imageUrl: currentChallenge.image,
          link: "/challenges"
        };
        
        response = `This month's challenge is all about ${currentChallenge.title.toLowerCase()}! ${currentChallenge.description} Would you like to join or see what others are baking? You can click the link to see the challenge details and community submissions.`;
      }
      else if (lowercaseInput.includes('henry') || lowercaseInput.includes('vitale') || lowercaseInput.includes('who is') || lowercaseInput.includes('about the author')) {
        response = henryBio.shortBio;
        
        if (lowercaseInput.includes('more') || lowercaseInput.includes('detail')) {
          response = henryBio.longBio;
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
  
  const renderAttachment = (message: ChatMessage) => {
    if (message.attachedRecipe) {
      return (
        <Card className="mt-3 overflow-hidden border-bread-100">
          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-1/3 aspect-video">
              <img
                src={message.attachedRecipe.imageUrl}
                alt={message.attachedRecipe.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop";
                }}
              />
            </div>
            <div className="p-4 sm:w-2/3">
              <h4 className="font-serif text-lg font-medium mb-2">{message.attachedRecipe.title}</h4>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{message.attachedRecipe.description}</p>
              <a 
                href={message.attachedRecipe.link} 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-bread-800 text-sm font-medium hover:underline"
              >
                View Full Recipe
                <ArrowRight className="ml-2 h-3 w-3" />
              </a>
            </div>
          </div>
        </Card>
      );
    } else if (message.attachedBook) {
      return (
        <Card className="mt-3 overflow-hidden border-bread-100">
          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-1/3 aspect-video">
              <img
                src={message.attachedBook.imageUrl}
                alt={message.attachedBook.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1576063892619-7e154ed1e19c?q=80&w=1000&auto=format&fit=crop";
                }}
              />
            </div>
            <div className="p-4 sm:w-2/3">
              <h4 className="font-serif text-lg font-medium mb-1">{message.attachedBook.title}</h4>
              <p className="text-sm text-muted-foreground mb-2">by {message.attachedBook.author}</p>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{message.attachedBook.description}</p>
              <a 
                href={message.attachedBook.link} 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-bread-800 text-sm font-medium hover:underline"
              >
                Explore Book
                <Book className="ml-2 h-3 w-3" />
              </a>
            </div>
          </div>
        </Card>
      );
    } else if (message.attachedChallenge) {
      return (
        <Card className="mt-3 overflow-hidden border-bread-100">
          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-1/3 aspect-video">
              <img
                src={message.attachedChallenge.imageUrl}
                alt={message.attachedChallenge.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?q=80&w=1000&auto=format&fit=crop";
                }}
              />
            </div>
            <div className="p-4 sm:w-2/3">
              <h4 className="font-serif text-lg font-medium mb-1">Challenge: {message.attachedChallenge.title}</h4>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{message.attachedChallenge.description}</p>
              <a 
                href={message.attachedChallenge.link} 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-bread-800 text-sm font-medium hover:underline"
              >
                Join Challenge
                <Calendar className="ml-2 h-3 w-3" />
              </a>
            </div>
          </div>
        </Card>
      );
    }
    
    return null;
  };

  return (
    <div className="flex-1 flex flex-col p-0 h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[90%] rounded-lg p-3 ${
                message.role === 'user' 
                  ? 'bg-bread-800 text-white' 
                  : 'bg-muted border border-border'
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              {message.role === 'assistant' && renderAttachment(message)}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-muted border border-border">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-bread-800" />
                <p className="text-sm">Looking through Henry's knowledge...</p>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        {!messages.some(m => m.role === 'user') && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  className="text-xs bg-secondary/80 rounded-full px-3 py-1.5 hover:bg-bread-100 transition-colors"
                  onClick={() => setChatInput(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            placeholder="Ask me about recipes, techniques, or challenges..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={isProcessing}
            className="bg-white/90 dark:bg-slate-800/90 border-2 border-bread-700/40 focus:border-bread-700 focus:ring-2 focus:ring-bread-600/30 shadow-md placeholder:text-slate-500 dark:placeholder:text-slate-400"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!chatInput.trim() || isProcessing}
            className="bg-bread-800 hover:bg-bread-700 shadow-md"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatTab;
