
import React, { useState } from 'react';
import { RecipeData } from '@/types/recipeTypes';
import RecipeUploader from './RecipeUploader';
import { useRecipeConversion } from '@/hooks/use-recipe-conversion';
import { useToast } from '@/hooks/use-toast';

interface ConversionServiceProps {
  onConversionComplete: (recipe: RecipeData) => void;
}

const ConversionService: React.FC<ConversionServiceProps> = ({ onConversionComplete }) => {
  const { toast } = useToast();
  const { isConverting, handleConversion } = useRecipeConversion(onConversionComplete);
  const [conversionError, setConversionError] = useState<string | null>(null);

  const handleConversionWithErrorHandling = async (text: string) => {
    try {
      setConversionError(null);
      await handleConversion(text);
    } catch (error) {
      console.error('Conversion error:', error);
      setConversionError(error instanceof Error ? error.message : 'An error occurred during conversion');
      toast({
        variant: "destructive",
        title: "Conversion Failed",
        description: "We couldn't convert your recipe. Please try again with a different format.",
      });
    }
  };

  return (
    <RecipeUploader 
      onConvertRecipe={handleConversionWithErrorHandling} 
      isConverting={isConverting}
      conversionError={conversionError}
    />
  );
};

export default ConversionService;
