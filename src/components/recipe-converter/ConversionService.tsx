
import React, { useState } from 'react';
import RecipeUploader from './RecipeUploader';
import ConversionSettings from './ConversionSettings';
import { RecipeData } from '@/types/recipeTypes';
import StartOverButton from './StartOverButton';
import APIKeyTester from './APIKeyTester';
import { isAIConfigured } from '@/lib/ai-services';
import NoAPIKeyMessage from './NoAPIKeyMessage';
import { useAIConversion } from '@/services/AIConversionService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb } from 'lucide-react';

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
  const { hasApiKey, isProcessing: isAiProcessing } = useAIConversion();
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  
  // Combined loading state
  const isLoading = isConverting || isAiProcessing;

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
      
      {aiSuggestions.length > 0 && (
        <Alert className="bg-amber-50 border-amber-200">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-700">AI Suggestions</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 space-y-1 text-amber-800">
              {aiSuggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      <RecipeUploader 
        onConvertRecipe={onConvertRecipe} 
        isConverting={isLoading}
        conversionError={conversionError}
        recipe={recipe}
        onSaveRecipe={onSaveRecipe}
        onAiSuggestionsUpdate={setAiSuggestions}
      />
      
      <ConversionSettings />
    </div>
  );
};

export default ConversionService;
