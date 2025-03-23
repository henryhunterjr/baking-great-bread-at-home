
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  Camera, 
  Clipboard, 
  FileText, 
  Loader2, 
  Wand2, 
  Download,
  FileIcon,
  FileText as FileTextIcon
} from 'lucide-react';
import { extractTextFromImage, processRecipeText } from '@/lib/ai-services/recipe-processor';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { downloadRecipePDF, downloadRecipeText } from '@/lib/pdf/pdf-generator';
import { Recipe } from '@/types/recipe';
import { useAuth } from '@/contexts/AuthContext';

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
  const [convertedRecipe, setConvertedRecipe] = useState<Recipe | null>(null);
  const { isAuthenticated, saveUserRecipe } = useAuth();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsProcessing(true);
    
    try {
      // Check if it's an image file
      if (file.type.startsWith('image/')) {
        const extractedText = await extractTextFromImage(file);
        setRecipeText(extractedText);
      } else {
        // Handle text files
        const text = await file.text();
        setRecipeText(text);
      }
      
      const assistantMessage = {
        role: 'assistant',
        content: "I've processed your recipe file and extracted the text. You can now edit it in the Recipe Converter tab.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        variant: "destructive",
        title: "File Processing Error",
        description: error instanceof Error ? error.message : "Failed to process file",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsProcessing(true);
    
    try {
      const extractedText = await extractTextFromImage(file);
      setRecipeText(extractedText);
      
      const assistantMessage = {
        role: 'assistant',
        content: "I've processed your recipe photo and extracted the text. You can now edit it in the Recipe Converter tab.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error processing camera image:', error);
      toast({
        variant: "destructive",
        title: "Image Processing Error",
        description: error instanceof Error ? error.message : "Failed to process image",
      });
    } finally {
      setIsProcessing(false);
    }
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
      
      setConvertedRecipe(convertedRecipe);
      setRecipeText('');
      
      const henryComments = [
        `I've successfully converted your recipe for "${convertedRecipe.title}". It's now in Henry's preferred format with clear instructions and measurements.`,
        `Your "${convertedRecipe.title}" recipe has been converted! I've structured it in the way Henry recommends for maximum clarity and success.`,
        `I've transformed your recipe for "${convertedRecipe.title}" following Henry's approach to recipe organization. Remember, as Henry says, "The best recipes are the ones you can follow without having to read them twice."`
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
        description: "Your recipe has been successfully converted.",
      });
      
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
  
  const handleSaveRecipe = async () => {
    if (!convertedRecipe) return;
    
    try {
      await saveUserRecipe(convertedRecipe);
      toast({
        title: "Recipe Saved",
        description: "Recipe has been saved to your collection.",
      });
      setActiveTab('chat');
    } catch (error) {
      if (error instanceof Error && error.message === 'Not authenticated') {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please log in to save recipes to your collection.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Save Error",
          description: "Failed to save recipe. Please try again.",
        });
      }
    }
  };
  
  const handleDownloadPDF = () => {
    if (!convertedRecipe) return;
    downloadRecipePDF(convertedRecipe);
  };
  
  const handleDownloadText = () => {
    if (!convertedRecipe) return;
    downloadRecipeText(convertedRecipe);
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
      
      <div className="flex flex-col md:flex-row gap-3">
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
        
        {convertedRecipe && (
          <>
            <Button 
              onClick={handleSaveRecipe}
              className="w-full bg-blue-600 hover:bg-blue-700 shadow-md"
              disabled={isProcessing}
            >
              Save Recipe
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  className="w-full md:w-auto bg-green-600 hover:bg-green-700 shadow-md"
                  disabled={isProcessing}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleDownloadPDF}>
                    <FileIcon className="mr-2 h-4 w-4" />
                    <span>Download as PDF</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownloadText}>
                    <FileTextIcon className="mr-2 h-4 w-4" />
                    <span>Download as Text</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </div>
  );
};

export default ConvertTab;
