
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Recipe } from '@/types/recipe';
import { generateRecipe } from '@/lib/ai-services/recipe-generator';
import { downloadRecipePDF, downloadRecipeText } from '@/lib/pdf/pdf-generator';
import { useAuth } from '@/contexts/AuthContext';

interface UseGenerateTabProps {
  setRecipePrompt: (prompt: string) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  setActiveTab: (tab: string) => void;
}

export const useGenerateTab = ({
  setRecipePrompt,
  setIsProcessing,
  setMessages,
  setActiveTab
}: UseGenerateTabProps) => {
  const { toast } = useToast();
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const { isAuthenticated, saveUserRecipe, toggleRecipeFavorite, isRecipeFavorite } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const handleGenerateRecipe = async (recipePrompt: string) => {
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
      
      setGeneratedRecipe(recipe);
      setRecipePrompt('');
      
      const assistantMessage = {
        role: 'assistant',
        content: `I've generated a recipe for "${recipe.title}" based on your request for "${recipePrompt}".`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      toast({
        title: "Recipe Generated",
        description: "Your recipe has been generated successfully.",
      });
      
      setIsFavorite(false);
      
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

  const handleSaveRecipe = async () => {
    if (!generatedRecipe) return;
    
    try {
      await saveUserRecipe(generatedRecipe);
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
  
  const handleToggleFavorite = async () => {
    if (!generatedRecipe?.id) {
      toast({
        variant: "destructive",
        title: "Save Required",
        description: "Please save the recipe before adding it to favorites.",
      });
      return;
    }
    
    try {
      const newFavoriteState = await toggleRecipeFavorite(generatedRecipe.id);
      setIsFavorite(newFavoriteState);
      
      toast({
        title: newFavoriteState ? "Added to Favorites" : "Removed from Favorites",
        description: newFavoriteState 
          ? "Recipe has been added to your favorites." 
          : "Recipe has been removed from your favorites.",
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Not authenticated') {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please log in to manage your favorites.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update favorites. Please try again.",
        });
      }
    }
  };
  
  const handleDownloadPDF = () => {
    if (!generatedRecipe) return;
    downloadRecipePDF(generatedRecipe);
  };
  
  const handleDownloadText = () => {
    if (!generatedRecipe) return;
    downloadRecipeText(generatedRecipe);
  };
  
  return {
    generatedRecipe,
    isFavorite,
    handleGenerateRecipe,
    handleSaveRecipe,
    handleToggleFavorite,
    handleDownloadPDF,
    handleDownloadText
  };
};
