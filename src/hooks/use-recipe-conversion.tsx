
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { RecipeData } from '@/pages/RecipeConverter';
import { processRecipeText } from '@/lib/ai-services/ai-service';

export const useRecipeConversion = (onConversionComplete: (recipe: RecipeData) => void) => {
  const { toast } = useToast();
  const [isConverting, setIsConverting] = useState(false);

  const handleConversion = async (text: string) => {
    setIsConverting(true);
    
    try {
      // Process the recipe text using the AI service
      const result = await processRecipeText(text);
      
      // Map the AI service result to our RecipeData format
      const convertedRecipe: RecipeData = {
        title: result.title,
        introduction: result.description,
        ingredients: result.ingredients.map(ing => `${ing.quantity} ${ing.unit} ${ing.name}`.trim()),
        prepTime: result.prepTime.toString(),
        restTime: '',
        bakeTime: result.cookTime ? result.cookTime.toString() : '',
        totalTime: (result.prepTime + (result.cookTime || 0)).toString(),
        instructions: result.steps,
        tips: result.notes ? [result.notes] : [],
        proTips: [],
        equipmentNeeded: [],
        imageUrl: result.imageUrl || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
        tags: result.tags,
        isPublic: false,
        isConverted: true
      };
      
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
