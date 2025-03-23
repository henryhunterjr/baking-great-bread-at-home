
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Recipe } from '@/types/recipe';
import { downloadRecipePDF, downloadRecipeText } from '@/lib/pdf/pdf-generator';
import { processRecipeText } from '@/lib/ai-services/recipe-processor';
import { useAuth } from '@/contexts/AuthContext';

interface UseRecipeProcessingProps {
  setRecipeText: (text: string) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  setActiveTab: (tab: string) => void;
}

export const useRecipeProcessing = ({
  setRecipeText,
  setIsProcessing,
  setMessages,
  setActiveTab
}: UseRecipeProcessingProps) => {
  const { toast } = useToast();
  const [convertedRecipe, setConvertedRecipe] = useState<Recipe | null>(null);
  const { isAuthenticated, saveUserRecipe } = useAuth();

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
    convertedRecipe,
    handleConvertRecipe,
    handleSaveRecipe,
    handleDownloadPDF,
    handleDownloadText
  };
};
