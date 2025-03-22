
import React from 'react';
import { RecipeData } from '@/pages/RecipeConverter';
import RecipeUploader from './RecipeUploader';
import { useRecipeConversion } from '@/hooks/use-recipe-conversion';

interface ConversionServiceProps {
  onConversionComplete: (recipe: RecipeData) => void;
}

const ConversionService: React.FC<ConversionServiceProps> = ({ onConversionComplete }) => {
  const { isConverting, handleConversion } = useRecipeConversion(onConversionComplete);

  return (
    <RecipeUploader 
      onConvertRecipe={handleConversion} 
      isConverting={isConverting} 
    />
  );
};

export default ConversionService;
