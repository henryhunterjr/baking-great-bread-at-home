
import React, { useState } from 'react';
import { RecipeData } from '@/types/recipeTypes';
import { logInfo } from '@/utils/logger';
import RecipeUploader from './RecipeUploader';
import { useRecipeConversion } from '@/hooks/use-recipe-conversion';
import { FormProvider, useForm } from 'react-hook-form';

interface ConversionServiceProps {
  onConversionComplete: (recipe: RecipeData) => void;
}

const ConversionService: React.FC<ConversionServiceProps> = ({ onConversionComplete }) => {
  const [recipeText, setRecipeText] = useState('');
  const { isConverting, conversionError, handleConversion } = useRecipeConversion(onConversionComplete);
  const form = useForm();
  
  const handleConvertRecipe = async (text: string) => {
    logInfo('Starting recipe conversion from user input', { textLength: text.length });
    await handleConversion(text);
  };
  
  return (
    <FormProvider {...form}>
      <div className="space-y-6">
        <h2 className="text-2xl font-serif font-bold mb-6">Convert Your Recipe</h2>
        <RecipeUploader 
          onConvertRecipe={handleConvertRecipe} 
          isConverting={isConverting} 
          conversionError={conversionError}
        />
      </div>
    </FormProvider>
  );
};

export default ConversionService;
