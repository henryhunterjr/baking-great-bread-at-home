
import React from 'react';
import RecipeUploader from './RecipeUploader';
import ConversionSettings from './ConversionSettings';
import { RecipeData } from '@/types/recipeTypes';
import StartOverButton from './StartOverButton';
import APIKeyTester from './APIKeyTester';
import { isAIConfigured } from '@/lib/ai-services';
import NoAPIKeyMessage from './NoAPIKeyMessage';

interface ConversionServiceProps {
  onConvertRecipe: (text: string) => void;
  isConverting: boolean;
  conversionError?: string | null;
  onReset: () => void;
  recipe?: RecipeData;
  onSaveRecipe?: () => void;
}

const ConversionService: React.FC<ConversionServiceProps> = ({ 
  onConvertRecipe, 
  isConverting,
  conversionError,
  onReset,
  recipe,
  onSaveRecipe
}) => {
  const isApiConfigured = isAIConfigured();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Convert a Recipe</h2>
        {/* Add Start Over button if there's a previous conversion */}
        {recipe && <StartOverButton onClick={onReset} />}
      </div>
      
      {!isApiConfigured && (
        <div className="mb-4">
          <NoAPIKeyMessage />
          <div className="mt-4">
            <APIKeyTester />
          </div>
        </div>
      )}
      
      <RecipeUploader 
        onConvertRecipe={onConvertRecipe} 
        isConverting={isConverting}
        conversionError={conversionError}
        recipe={recipe}
        onSaveRecipe={onSaveRecipe}
      />
      
      <ConversionSettings />
    </div>
  );
};

export default ConversionService;
