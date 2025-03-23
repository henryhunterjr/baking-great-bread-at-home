
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Recipe } from '@/types/recipe';
import { downloadRecipePDF, downloadRecipeText } from '@/lib/pdf/pdf-generator';
import { extractTextFromImage, processRecipeText } from '@/lib/ai-services/recipe-processor';
import { useAuth } from '@/contexts/AuthContext';

interface UseConvertTabProps {
  setRecipeText: (text: string) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  setActiveTab: (tab: string) => void;
}

export const useConvertTab = ({
  setRecipeText,
  setIsProcessing,
  setMessages,
  setActiveTab
}: UseConvertTabProps) => {
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

  const clearText = () => setRecipeText('');
  
  const handleConvertRecipe = async (recipeText: string) => {
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

  return {
    fileInputRef,
    cameraInputRef,
    convertedRecipe,
    handleFileSelect,
    handleCameraCapture,
    handlePasteFromClipboard,
    clearText,
    handleConvertRecipe,
    handleSaveRecipe,
    handleDownloadPDF,
    handleDownloadText
  };
};
