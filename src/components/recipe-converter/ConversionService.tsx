
import React, { useState } from 'react';
import { RecipeData } from '@/types/recipeTypes';
import { logInfo } from '@/utils/logger';
import RecipeUploader from './RecipeUploader';
import { FormProvider, useForm } from 'react-hook-form';

interface ConversionServiceProps {
  onConvertRecipe: (text: string) => Promise<void>;
  isConverting: boolean;
  conversionError: string | null;
}

const ConversionService: React.FC<ConversionServiceProps> = ({ 
  onConvertRecipe, 
  isConverting, 
  conversionError 
}) => {
  const form = useForm();
  
  return (
    <FormProvider {...form}>
      <div className="space-y-6">
        <h2 className="text-2xl font-serif font-bold mb-6">Convert Your Recipe</h2>
        <RecipeUploader 
          onConvertRecipe={onConvertRecipe} 
          isConverting={isConverting} 
          conversionError={conversionError}
        />
      </div>
    </FormProvider>
  );
};

export default ConversionService;
