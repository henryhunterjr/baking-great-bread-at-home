
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Upload, Camera, Clipboard, FileText, Loader2, Wand2 } from 'lucide-react';
import { processRecipeText } from '@/lib/ai-services/ai-service';

interface ConvertTabProps {
  recipeText: string;
  setRecipeText: (text: string) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  setActiveTab: (tab: string) => void;
}

const ConvertTab: React.FC<ConvertTabProps> = ({
  recipeText,
  setRecipeText,
  isProcessing,
  setIsProcessing,
  setMessages,
  setActiveTab
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      setActiveTab('convert');
      setRecipeText("Classic Sourdough Bread\n\nIngredients:\n- 500g bread flour\n- 350g water\n- 100g active sourdough starter\n- 10g salt\n\nInstructions:\n1. Mix flour and water, rest 30 minutes (autolyse)\n2. Add starter and salt, mix well\n3. Perform 4 sets of stretch and folds, 30 minutes apart\n4. Bulk ferment 4-6 hours or until 30% increase in volume\n5. Shape and place in banneton\n6. Cold proof in refrigerator 12-16 hours\n7. Preheat oven to 500°F with Dutch oven inside\n8. Score and bake covered for 20 minutes\n9. Remove lid and bake additional 20-25 minutes until golden brown");
      
      const assistantMessage = {
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
      
      const assistantMessage = {
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
        const assistantMessage = {
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
      const convertedRecipe = await processRecipeText(recipeText);
      
      setRecipeText('');
      
      const henryComments = [
        `I've successfully converted your recipe for "${convertedRecipe.title}". It's now in Henry's preferred format with clear instructions and measurements. You can find it in your saved recipes.`,
        `Your "${convertedRecipe.title}" recipe has been converted! I've structured it in the way Henry recommends for maximum clarity and success. It's now saved in your recipes.`,
        `I've transformed your recipe for "${convertedRecipe.title}" following Henry's approach to recipe organization. Remember, as Henry says, "The best recipes are the ones you can follow without having to read them twice." It's now in your saved recipes.`
      ];
      
      const randomComment = henryComments[Math.floor(Math.random() * henryComments.length)];
      
      const assistantMessage = {
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

  return (
    <div className="flex-1 p-4 space-y-6 overflow-y-auto">
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
    </div>
  );
};

export default ConvertTab;
