
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { RecipeData } from '@/pages/RecipeConverter';
import { processRecipeText } from '@/lib/ai-services';
import { parseRecipeJson, convertFromStandardFormat } from '@/lib/ai-services/recipe-formatter';

export const useRecipeConversion = (onConversionComplete: (recipe: RecipeData) => void) => {
  const { toast } = useToast();
  const [isConverting, setIsConverting] = useState(false);

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
    
    try {
      // First check if this is a valid JSON recipe in our standard format
      const standardRecipe = parseRecipeJson(text);
      
      if (standardRecipe) {
        // If it's already in our standard JSON format, convert it directly
        const convertedRecipe = convertFromStandardFormat(standardRecipe);
        onConversionComplete(convertedRecipe);
        
        toast({
          title: "Recipe Imported!",
          description: "Your recipe has been successfully imported from JSON.",
        });
        
        setIsConverting(false);
        return;
      }
      
      // Clean up the text if it comes from OCR
      const cleanedText = cleanOCRText(text);
      
      // Process the recipe text using the AI service
      const result = await processRecipeText(cleanedText);
      
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
      throw error; // Re-throw to allow parent component to handle the error
    } finally {
      setIsConverting(false);
    }
  };

  // Helper function to clean OCR text
  const cleanOCRText = (text: string): string => {
    // Remove excessive whitespace and normalize line breaks
    let cleaned = text.replace(/\r\n/g, '\n');
    
    // Remove multiple consecutive spaces
    cleaned = cleaned.replace(/[ \t]+/g, ' ');
    
    // Remove multiple empty lines
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    
    // Fix common OCR errors
    cleaned = cleaned.replace(/l\/2/g, '1/2'); // Replace l/2 with 1/2
    cleaned = cleaned.replace(/l\/4/g, '1/4'); // Replace l/4 with 1/4
    cleaned = cleaned.replace(/l\/3/g, '1/3'); // Replace l/3 with 1/3
    
    return cleaned.trim();
  };

  return {
    isConverting,
    handleConversion
  };
};
