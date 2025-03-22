
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { RecipeData } from '@/pages/RecipeConverter';
import { convertRecipeText } from '@/services/RecipeService';

export const useRecipeConversion = (onConversionComplete: (recipe: RecipeData) => void) => {
  const { toast } = useToast();
  const [isConverting, setIsConverting] = useState(false);

  const handleConversion = async (text: string) => {
    setIsConverting(true);
    
    try {
      // Use our RecipeService to convert the text
      const convertedRecipe = await convertRecipeText(text);
      
      onConversionComplete(convertedRecipe);
      
      toast({
        title: "Recipe Converted!",
        description: "Your recipe has been successfully converted. You can now edit, save, or print it.",
      });
    } catch (error) {
      console.error("Error converting recipe:", error);
      toast({
        variant: "destructive",
        title: "Conversion Failed",
        description: "We couldn't convert your recipe. Please try again or use a different format.",
      });
    } finally {
      setIsConverting(false);
    }
  };

  return {
    isConverting,
    handleConversion
  };
};
