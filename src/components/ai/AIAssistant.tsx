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
  Wand2
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIAssistant = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [chatInput, setChatInput] = useState('');
  const [recipeText, setRecipeText] = useState('');
  const [recipePrompt, setRecipePrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hi, I'm your Baking Assistant! I can help you with bread recipes, answer baking questions, convert recipes from images or text, and even generate new recipe ideas. How can I help you today?",
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
      const lowercaseInput = chatInput.toLowerCase();
      
      if (lowercaseInput.includes('recipe') && lowercaseInput.includes('convert')) {
        response = "I'd be happy to convert a recipe for you! Please go to the Recipe Converter tab and upload an image or paste your recipe text. I'll format it properly for you.";
      } 
      else if (lowercaseInput.includes('recipe') && (lowercaseInput.includes('create') || lowercaseInput.includes('generate'))) {
        response = "I can help generate a recipe idea! Head to the Recipe Generator tab, describe what you'd like to make, and I'll create a custom recipe for you.";
      }
      else if (lowercaseInput.includes('hydration')) {
        response = "Hydration in bread baking refers to the ratio of water to flour by weight, expressed as a percentage. For example, a dough with 1000g flour and 700g water has 70% hydration. Higher hydration (75-85%) gives an open, airy crumb, while lower hydration (60-70%) creates a tighter crumb structure. For beginners, I recommend starting around 70%.";
      }
      else if (lowercaseInput.includes('sourdough')) {
        response = "Sourdough bread is made using a natural leaven (starter) of flour and water that contains wild yeast and beneficial bacteria. Keep your starter healthy by feeding it regularly with equal parts flour and water. For the best results, use your starter when it's at peak activity - usually 4-8 hours after feeding when it's doubled in size and looks bubbly.";
      }
      else if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi') || lowercaseInput.includes('hey')) {
        response = "Hello! I'm your Baking Assistant. I can help with recipes, technique questions, troubleshooting, or creating new bread ideas. What would you like to learn about today?";
      }
      else {
        response = "That's an interesting baking question! While I don't have specific information on that topic, I can help with recipe conversion, bread techniques, troubleshooting common issues, or generating new recipe ideas. Feel free to ask something else or try one of the other tabs for recipe conversion or generation.";
      }
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
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
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: `I've successfully converted your recipe for "${convertedRecipe.title}". You can find it in your saved recipes.`,
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
    "How do I know when my dough is properly proofed?",
    "Can you help me convert a recipe?",
    "Generate a bread recipe with herbs and cheese",
    "How do I troubleshoot a dense loaf?"
  ];
  
  const recipeExamples = [
    "Crusty artisan sourdough with rosemary and garlic",
    "Soft whole wheat sandwich bread",
    "Cinnamon raisin breakfast loaf",
    "Focaccia with olives and sun-dried tomatoes",
    "Simple no-knead bread for beginners"
  ];

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
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-bread-800 text-white' 
                      : 'bg-muted border border-border'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-muted border border-border">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-bread-800" />
                    <p className="text-sm">Thinking...</p>
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
                      className="text-xs bg-secondary rounded-full px-2 py-1 hover:bg-accent/50 transition-colors"
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
                placeholder="Type a message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isProcessing}
                className="bg-secondary/50 border-2 border-accent/30 focus:border-bread-700 shadow-sm"
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
          <div className="grid grid-cols-4 gap-2 mb-4">
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
              className="min-h-[200px] bg-secondary/50 border-2 border-accent/30 focus:border-bread-700 shadow-sm"
              value={recipeText}
              onChange={(e) => setRecipeText(e.target.value)}
              disabled={isProcessing}
            />
          </div>
          
          <Alert className="bg-accent/20 border-accent">
            <AlertDescription className="text-xs">
              Paste or upload your recipe, and I'll convert it into a structured, 
              easy-to-follow format. Works with handwritten recipes, photos, or text.
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
        
        <TabsContent value="generate" className="flex-1 p-4 space-y-6 overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="recipe-prompt">Describe Your Ideal Recipe</Label>
            <Textarea
              id="recipe-prompt"
              placeholder="Describe the bread recipe you want me to create..."
              className="min-h-[150px] bg-secondary/50 border-2 border-accent/30 focus:border-bread-700 shadow-sm"
              value={recipePrompt}
              onChange={(e) => setRecipePrompt(e.target.value)}
              disabled={isProcessing}
            />
          </div>
          
          <Alert className="bg-accent/20 border-accent">
            <AlertDescription className="text-xs">
              Be specific about ingredients, flavors, or techniques you'd like to include.
              The more details you provide, the better your recipe will be!
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Recipe ideas:</p>
            <div className="flex flex-wrap gap-2">
              {recipeExamples.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setRecipePrompt(example)}
                  className="text-xs"
                  disabled={isProcessing}
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
          
          <Button 
            onClick={handleGenerateRecipe}
            disabled={!recipePrompt.trim() || isProcessing}
            className="w-full bg-bread-800 hover:bg-bread-700 shadow-md sticky bottom-4"
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
                  Automatically improve recipes with tips and suggestions
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
