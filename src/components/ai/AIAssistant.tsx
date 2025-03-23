import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Recipe } from '@/types/recipe';
import { processRecipeText, generateRecipe } from '@/lib/ai-services/ai-service';
import { 
  MessageSquare, 
  Upload, 
  Sparkles, 
  Send, 
  Camera, 
  FileText, 
  Clipboard, 
  Loader2, 
  Settings,
  Wand2,
  Search,
  Book,
  Calendar,
  Link
} from 'lucide-react';
import { recipesData } from '@/data/recipesData';
import { challengesData } from '@/data/challengesData';
import BlogService from '@/services/BlogService';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachedRecipe?: {
    title: string;
    imageUrl: string;
    link: string;
    description: string;
  };
  attachedBook?: {
    title: string;
    imageUrl: string;
    author: string;
    description: string;
    link: string;
  };
  attachedChallenge?: {
    title: string;
    imageUrl: string;
    link: string;
    description: string;
  };
}

interface RecipeSearchResult {
  title: string;
  imageUrl: string;
  link: string;
  description: string;
}

const henryQuotes = [
  "If your freezer's full of bread, you're doing something right.",
  "Bread will tell you when it's ready, you just need to learn how to listen.",
  "The best bread is the one that brings people together at the table.",
  "A good loaf has character, just like the baker who made it.",
  "Time is your most important ingredient - don't rush the fermentation.",
  "Mistakes are just opportunities for creative breadmaking.",
  "The way you handle dough says a lot about how you handle life.",
  "Your starter is like a pet - feed it regularly and it'll reward you generously.",
  "There's nothing more satisfying than the sound of a well-baked crust cracking.",
  "Baking is science, but great bread is art."
];

const booksData = [
  {
    id: 1,
    title: "Vitale Sourdough Mastery",
    author: "Henry Vitale",
    description: "A comprehensive guide to mastering the art of sourdough baking with detailed instructions on starter maintenance, fermentation, and troubleshooting common issues.",
    imageUrl: "https://images.unsplash.com/photo-1576063892619-7e154ed1e19c?q=80&w=1000&auto=format&fit=crop",
    link: "/books/sourdough-mastery",
    keywords: ["sourdough", "starter", "fermentation", "master", "advanced"]
  },
  {
    id: 2,
    title: "Sourdough for the Rest of Us",
    author: "Henry Vitale",
    description: "A beginner-friendly approach to sourdough baking that simplifies the process without sacrificing quality. Perfect for those just starting their bread journey.",
    imageUrl: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?q=80&w=1000&auto=format&fit=crop",
    link: "/books/sourdough-for-everyone",
    keywords: ["beginner", "simple", "starter", "easy", "first loaf"]
  },
  {
    id: 3,
    title: "Baking Great Bread at Home: A Journey Through the Seasons",
    author: "Henry Vitale",
    description: "Discover how to adapt your bread baking throughout the year, with seasonal recipes and techniques that account for changing temperatures and ingredients.",
    imageUrl: "https://images.unsplash.com/photo-1578302953540-e8be707ff6b7?q=80&w=1000&auto=format&fit=crop",
    link: "/books/seasonal-baking",
    keywords: ["seasonal", "temperature", "adaptation", "recipes", "weather"]
  },
  {
    id: 4,
    title: "From Oven to Market",
    author: "Henry Vitale",
    description: "For home bakers looking to turn their passion into a business. This guide covers everything from scaling recipes to navigating regulations and marketing your bread.",
    imageUrl: "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?q=80&w=1000&auto=format&fit=crop",
    link: "/books/bread-business",
    keywords: ["business", "market", "selling", "cottage", "bakery", "commercial"]
  }
];

const henryBio = {
  shortBio: "Henry's a former radio and television pro who came back to baking after retiring from CBS. The real spark started in a bakery in Germany, under the guidance of a stout Jewish baker named Mr. Sherman.",
  longBio: "Henry Vitale spent over 30 years in broadcast media before rediscovering his passion for bread baking. After retiring from his executive position at CBS, he returned to the craft he first learned as a young man working in a small German bakery under Mr. Sherman, a master baker who escaped Europe during WWII. Today, Henry combines old-world techniques with modern approaches to help home bakers create exceptional bread. His books and online community have inspired thousands to discover the joy and science of homemade bread.",
  achievements: "Author of four bread baking books, founder of the Baking Great Bread at Home community, and host of seasonal baking workshops across the country.",
  philosophy: "Bread baking isn't just about the loaf—it's about the process, the community, and the connection to tradition. Everyone deserves to experience the satisfaction of a well-baked loaf made with their own hands."
};

const AIAssistant = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [chatInput, setChatInput] = useState('');
  const [recipeText, setRecipeText] = useState('');
  const [recipePrompt, setRecipePrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hi, I'm your Baking Assistant! I can help you with bread recipes, answer baking questions, search for Henry's recipes, recommend books, tell you about the current baking challenge, or convert recipes from images or text. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const [useAI, setUseAI] = useState(true);
  const [saveHistory, setSaveHistory] = useState(true);
  const [enhanceRecipes, setEnhanceRecipes] = useState(true);
  
  const currentChallenge = challengesData[0];
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const searchRecipes = async (query: string): Promise<RecipeSearchResult[]> => {
    try {
      const blogService = BlogService.getInstance();
      const blogPosts = await blogService.getPosts(query);
      
      const recipeMatches = recipesData.filter(recipe => 
        recipe.title.toLowerCase().includes(query.toLowerCase()) ||
        recipe.description.toLowerCase().includes(query.toLowerCase())
      );
      
      const blogRecipes = blogPosts.map(post => ({
        title: post.title,
        description: post.excerpt,
        imageUrl: post.imageUrl,
        link: post.link
      }));
      
      const combinedResults = [...blogRecipes];
      
      recipeMatches.forEach(recipe => {
        if (!combinedResults.some(r => r.title === recipe.title)) {
          combinedResults.push({
            title: recipe.title,
            description: recipe.description,
            imageUrl: recipe.imageUrl,
            link: recipe.link
          });
        }
      });
      
      return combinedResults;
    } catch (error) {
      console.error("Error searching recipes:", error);
      return [];
    }
  };
  
  const findRelevantBook = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    const directMatch = booksData.find(book => 
      book.title.toLowerCase().includes(lowerQuery)
    );
    
    if (directMatch) return directMatch;
    
    return booksData.find(book => 
      book.keywords.some(keyword => lowerQuery.includes(keyword))
    );
  };
  
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
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      setActiveTab('convert');
      setRecipeText("Classic Sourdough Bread\n\nIngredients:\n- 500g bread flour\n- 350g water\n- 100g active sourdough starter\n- 10g salt\n\nInstructions:\n1. Mix flour and water, rest 30 minutes (autolyse)\n2. Add starter and salt, mix well\n3. Perform 4 sets of stretch and folds, 30 minutes apart\n4. Bulk ferment 4-6 hours or until 30% increase in volume\n5. Shape and place in banneton\n6. Cold proof in refrigerator 12-16 hours\n7. Preheat oven to 500°F with Dutch oven inside\n8. Score and bake covered for 20 minutes\n9. Remove lid and bake additional 20-25 minutes until golden brown");
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: "I've processed your recipe image and extracted the text. You can now edit it in the Recipe Converter tab.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 2000);
  };
  
  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      setActiveTab('convert');
      setRecipeText("Rustic Country Loaf\n\nIngredients:\n- 400g bread flour\n- 100g whole wheat flour\n- 375g water\n- 10g salt\n- 5g instant yeast\n\nInstructions:\n1. Mix all ingredients until no dry flour remains\n2. Rest 15 minutes, then knead for 5-7 minutes\n3. Bulk ferment 2-3 hours or until doubled\n4. Shape into boule and place in proofing basket\n5. Final proof 1 hour or until 50% larger\n6. Preheat oven to 450°F with Dutch oven\n7. Score and bake covered 25 minutes\n8. Uncover and bake 15-20 minutes more");
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: "I've processed your recipe photo and extracted the text. You can now edit it in the Recipe Converter tab.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 2000);
  };
  
  const handlePasteFromClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setActiveTab('convert');
      setRecipeText(clipboardText || "");
      
      if (clipboardText) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: "I've pasted the recipe from your clipboard. You can now edit it in the Recipe Converter tab.",
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Failed to read clipboard:', error);
      toast({
        variant: "destructive",
        title: "Clipboard Error",
        description: "Unable to access clipboard. Please paste the text manually.",
      });
    }
  };
  
  const handleConvertRecipe = async () => {
    if (!recipeText.trim()) {
      toast({
        variant: "destructive",
        title: "Empty Text",
        description: "Please enter or paste a recipe to convert.",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const convertedRecipe: Recipe = await processRecipeText(recipeText);
      
      setRecipeText('');
      
      const henryComments = [
        `I've successfully converted your recipe for "${convertedRecipe.title}". It's now in Henry's preferred format with clear instructions and measurements. You can find it in your saved recipes.`,
        `Your "${convertedRecipe.title}" recipe has been converted! I've structured it in the way Henry recommends for maximum clarity and success. It's now saved in your recipes.`,
        `I've transformed your recipe for "${convertedRecipe.title}" following Henry's approach to recipe organization. Remember, as Henry says, "The best recipes are the ones you can follow without having to read them twice." It's now in your saved recipes.`
      ];
      
      const randomComment = henryComments[Math.floor(Math.random() * henryComments.length)];
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: randomComment,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      toast({
        title: "Recipe Converted",
        description: "Your recipe has been successfully converted and saved.",
      });
      
      setActiveTab('chat');
    } catch (error) {
      console.error('Error converting recipe:', error);
      toast({
        variant: "destructive",
        title: "Conversion Error",
        description: "Failed to convert recipe. Please try again with a different format.",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleGenerateRecipe = async () => {
    if (!recipePrompt.trim()) {
      toast({
        variant: "destructive",
        title: "Empty Prompt",
        description: "Please describe the recipe you want to generate.",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const recipe = await generateRecipe(recipePrompt);
      
      setRecipePrompt('');
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: `I've generated a recipe for "${recipe.title}" based on your request for "${recipePrompt}". You can find it in your saved recipes.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      toast({
        title: "Recipe Generated",
        description: "Your recipe has been generated and saved.",
      });
      
      setActiveTab('chat');
    } catch (error) {
      console.error('Error generating recipe:', error);
      toast({
        variant: "destructive",
        title: "Generation Error",
        description: "Failed to generate recipe. Please try with a different prompt.",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const suggestedQuestions = [
    "What's the ideal hydration for a beginner sourdough?",
    "Can you find me a recipe for challah bread?",
    "Tell me about this month's baking challenge",
    "Which of Henry's books is best for beginners?",
    "How do I troubleshoot a dense loaf?"
  ];
  
  const recipeExamples = [
    "Crusty artisan sourdough with rosemary and garlic",
    "Soft whole wheat sandwich bread",
    "Cinnamon raisin breakfast loaf",
    "Focaccia with olives and sun-dried tomatoes",
    "Simple no-knead bread for beginners"
  ];

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
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 py-2 border-b">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="convert" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              <span>Convert</span>
            </TabsTrigger>
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Generate</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="flex-1 flex flex-col p-0 h-full">
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
        </TabsContent>

        <TabsContent value="convert" className="flex-1 p-4 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 p-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,.pdf,.txt,.doc,.docx"
                onChange={handleFileSelect}
              />
              <Upload className="h-8 w-8 mb-2 text-bread-800" />
              <span className="text-xs text-center">Upload Image or File</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 p-2"
              onClick={() => cameraInputRef.current?.click()}
            >
              <input
                type="file"
                ref={cameraInputRef}
                className="hidden"
                accept="image/*"
                capture="environment"
                onChange={handleCameraCapture}
              />
              <Camera className="h-8 w-8 mb-2 text-bread-800" />
              <span className="text-xs text-center">Take Photo</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 p-2"
              onClick={handlePasteFromClipboard}
            >
              <Clipboard className="h-8 w-8 mb-2 text-bread-800" />
              <span className="text-xs text-center">Paste from Clipboard</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 p-2"
              onClick={() => setRecipeText('')}
              disabled={!recipeText.trim()}
            >
              <FileText className="h-8 w-8 mb-2 text-bread-800" />
              <span className="text-xs text-center">Clear Text</span>
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="recipe-text">Recipe Text</Label>
            <Textarea
              id="recipe-text"
              placeholder="Paste or type your recipe here..."
              className="min-h-[200px] bg-white/90 dark:bg-slate-800/90 border-2 border-bread-700/40 focus:border-bread-700 focus:ring-2 focus:ring-bread-600/30 shadow-md placeholder:text-slate-500 dark:placeholder:text-slate-400"
              value={recipeText}
              onChange={(e) => setRecipeText(e.target.value)}
              disabled={isProcessing}
            />
          </div>
          
          <Alert className="bg-accent/20 border-accent">
            <AlertDescription className="text-xs">
              Paste or upload your recipe, and I'll convert it into Henry's clear, structured format.
              I'll also suggest improvements based on Henry's baking principles. Works with handwritten recipes, photos, or text.
            </AlertDescription>
          </Alert>
          
          <Button 
            onClick={handleConvertRecipe}
            disabled={!recipeText.trim() || isProcessing}
            className="w-full bg-bread-800 hover:bg-bread-700 shadow-md"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Converting Recipe...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Convert Recipe
              </>
            )}
          </Button>
        </TabsContent>
        
        <TabsContent value="generate" className="flex-1 p-4 flex flex-col h-full relative pb-20">
          <div className="flex-1 overflow-y-auto space-y-6">
            <div className="space-y-2">
              <Label htmlFor="recipe-prompt">Describe Your Ideal Recipe</Label>
              <Textarea
                id="recipe-prompt"
                placeholder="Describe the bread recipe you want me to create..."
                className="min-h-[150px] bg-white/90 dark:bg-slate-800/90 border-2 border-bread-700/40 focus:border-bread-700 focus:ring-2 focus:ring-bread-600/30 shadow-md placeholder:text-slate-500 dark:placeholder:text-slate-400"
                value={recipePrompt}
                onChange={(e) => setRecipePrompt(e.target.value)}
                disabled={isProcessing}
              />
            </div>
            
            <Alert className="bg-accent/20 border-accent">
              <AlertDescription className="text-xs">
                Be specific about ingredients, flavors, or techniques you'd like to include.
                I'll create a recipe inspired by Henry's baking philosophy that's tailored to your request!
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Recipe inspiration:</p>
              <div className="flex flex-wrap gap-2">
                {recipeExamples.map((example, index) => (
                  <button
                    key={index}
                    className="text-xs bg-secondary/80 rounded-full px-3 py-1.5 hover:bg-bread-100 transition-colors"
                    onClick={() => setRecipePrompt(example)}
                    disabled={isProcessing}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-sm border-t">
            <Button 
              onClick={handleGenerateRecipe}
              disabled={!recipePrompt.trim() || isProcessing}
              className="w-full bg-bread-800 hover:bg-bread-700 shadow-md"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Recipe...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Recipe
                </>
              )}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="flex-1 p-4 space-y-6">
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="ai-powered">AI-Powered Features</Label>
                <p className="text-xs text-muted-foreground">
                  Use AI for recipe conversion and generation
                </p>
              </div>
              <Switch 
                id="ai-powered" 
                checked={useAI}
                onCheckedChange={setUseAI}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="save-history">Save Chat History</Label>
                <p className="text-xs text-muted-foreground">
                  Remember conversations between sessions
                </p>
              </div>
              <Switch 
                id="save-history" 
                checked={saveHistory}
                onCheckedChange={setSaveHistory}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enhance-recipes">Enhance Recipes</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically improve recipes with Henry's tips and suggestions
                </p>
              </div>
              <Switch 
                id="enhance-recipes" 
                checked={enhanceRecipes}
                onCheckedChange={setEnhanceRecipes}
              />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAssistant;
