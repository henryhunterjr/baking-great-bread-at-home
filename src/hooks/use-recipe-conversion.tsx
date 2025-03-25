
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { RecipeData } from '@/types/recipeTypes';
import { convertRecipeText } from '@/lib/recipe-conversion/conversion-service';
import { logError } from '@/utils/logger';

/**
 * Hook to manage recipe conversion state and process
 */
export const useRecipeConversion = (onConversionComplete: (recipe: RecipeData) => void) => {
  const { toast } = useToast();
  const [isConverting, setIsConverting] = useState(false);
  const [conversionError, setConversionError] = useState<string | null>(null);

  const handleConversion = async (text: string) => {
    if (!text || text.trim().length === 0) {
      toast({
        variant: "destructive",
        title: "Empty Text",
        description: "Please enter some recipe text to convert.",
      });
      return;
    }
    
    setIsConverting(true);
    setConversionError(null);
    
    try {
      await convertRecipeText(
        text,
        (convertedRecipe) => {
          onConversionComplete(convertedRecipe);
          
          toast({
            title: "Recipe Converted!",
            description: "Your recipe has been successfully converted. You can now edit, save, or print it.",
          });
        },
        (error) => {
          const errorMessage = error.message || "We couldn't convert your recipe. Please try again or use a different format.";
          setConversionError(errorMessage);
          
          toast({
            variant: "destructive",
            title: "Conversion Failed",
            description: errorMessage,
          });
          
          logError('Recipe conversion failed:', { error });
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unexpected error occurred during conversion.";
      
      setConversionError(errorMessage);
      logError('Unexpected error in conversion process:', { error });
      
      toast({
        variant: "destructive",
        title: "Conversion Failed",
        description: errorMessage,
      });
    } finally {
      setIsConverting(false);
    }
  };

  return {
    isConverting,
    conversionError,
    handleConversion
  };
};
