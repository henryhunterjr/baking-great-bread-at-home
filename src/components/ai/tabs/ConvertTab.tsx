
import React, { useState } from 'react';
import ConvertTab from '@/components/recipe-converter/uploader/tabs/ConvertTab';
import { useToast } from '@/hooks/use-toast';
import { processRecipeText } from '@/lib/ai-services/ai-service';

interface ConvertTabProps {
  recipeText: string;
  setRecipeText: (text: string) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  setActiveTab: (tab: string) => void;
}

const AIConvertTab: React.FC<ConvertTabProps> = ({
  recipeText,
  setRecipeText,
  isProcessing,
  setIsProcessing,
  setMessages,
  setActiveTab
}) => {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  
  const handleConvertRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipeText.trim()) {
      setError("Please enter or paste a recipe to convert.");
      toast({
        variant: "destructive",
        title: "Empty Text",
        description: "Please enter or paste a recipe to convert.",
      });
      return;
    }
    
    setError(null);
    setIsProcessing(true);
    
    try {
      // Process the recipe
      const response = await processRecipeText(recipeText);
      
      if (!response.success || !response.recipe) {
        throw new Error("Failed to convert recipe");
      }
      
      const convertedRecipe = response.recipe;
      
      // Clear the text input
      setRecipeText('');
      
      // Generate a random comment from Henry
      const henryComments = [
        `I've successfully converted your recipe for "${convertedRecipe.title}". It's now in Henry's preferred format with clear instructions and measurements. You can find it in your saved recipes.`,
        `Your "${convertedRecipe.title}" recipe has been converted! I've structured it in the way Henry recommends for maximum clarity and success. It's now saved in your recipes.`,
        `I've transformed your recipe for "${convertedRecipe.title}" following Henry's approach to recipe organization. Remember, as Henry says, "The best recipes are the ones you can follow without having to read them twice." It's now in your saved recipes.`
      ];
      
      const randomComment = henryComments[Math.floor(Math.random() * henryComments.length)];
      
      // Add the assistant message
      const assistantMessage = {
        role: 'assistant',
        content: randomComment,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Show success toast
      toast({
        title: "Recipe Converted",
        description: "Your recipe has been successfully converted and saved.",
      });
      
      // Switch back to chat tab
      setActiveTab('chat');
    } catch (error) {
      console.error('Error converting recipe:', error);
      setError("Failed to convert recipe. Please try again with a different format.");
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
      <ConvertTab
        recipeText={recipeText}
        setRecipeText={setRecipeText}
        onSubmit={handleConvertRecipe}
        isConverting={isProcessing}
        error={error}
      />
    </div>
  );
};

export default AIConvertTab;
