
import React, { useState } from 'react';
import { RecipeData } from '@/types/recipeTypes';
import RecipeUploader from './RecipeUploader';
import { useRecipeConversion } from '@/hooks/use-recipe-conversion';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, Key } from 'lucide-react';
import { isOpenAIConfigured } from '@/lib/ai-services/ai-config';
import { useNavigate } from 'react-router-dom';

interface ConversionServiceProps {
  onConversionComplete: (recipe: RecipeData) => void;
}

const ConversionService: React.FC<ConversionServiceProps> = ({ onConversionComplete }) => {
  const { toast } = useToast();
  const { isConverting, handleConversion } = useRecipeConversion(onConversionComplete);
  const [conversionError, setConversionError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleConversionWithErrorHandling = async (text: string) => {
    try {
      // Check if OpenAI API is configured
      if (!isOpenAIConfigured()) {
        setConversionError("AI service not configured with valid API key. Please add your OpenAI API key in settings.");
        return;
      }

      setConversionError(null);
      await handleConversion(text);
    } catch (error) {
      console.error('Conversion error:', error);
      setConversionError(error instanceof Error ? error.message : 'An error occurred during conversion');
    }
  };

  const navigateToSettings = () => {
    navigate('/settings');
  };

  const showApiKeyAlert = !isOpenAIConfigured();

  return (
    <div className="space-y-4">
      {showApiKeyAlert && (
        <Alert variant="default" className="bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-800 dark:text-amber-300">OpenAI API Key Required</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-400">
            <p className="mb-2">Recipe conversion requires an OpenAI API key to function properly.</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={navigateToSettings}
              className="mt-1 border-amber-500 text-amber-600 hover:bg-amber-100"
            >
              <Key className="h-3 w-3 mr-2" />
              Configure API Key
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <RecipeUploader 
        onConvertRecipe={handleConversionWithErrorHandling} 
        isConverting={isConverting}
        conversionError={conversionError}
      />
    </div>
  );
};

export default ConversionService;
