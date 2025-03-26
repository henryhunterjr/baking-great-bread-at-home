
import React, { useState, useEffect } from 'react';
import { RecipeData } from '@/types/recipeTypes';
import RecipeUploader from './RecipeUploader';
import { useRecipeConversion } from '@/hooks/use-recipe-conversion';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, Key } from 'lucide-react';
import { 
  isOpenAIConfigured, 
  updateOpenAIApiKey, 
  checkAPIKeyStatus 
} from '@/lib/ai-services/ai-config';
import { useNavigate } from 'react-router-dom';

interface ConversionServiceProps {
  onConversionComplete: (recipe: RecipeData) => void;
}

const ConversionService: React.FC<ConversionServiceProps> = ({ onConversionComplete }) => {
  const { toast } = useToast();
  const { isConverting, handleConversion } = useRecipeConversion(onConversionComplete);
  const [conversionError, setConversionError] = useState<string | null>(null);
  const [isAIConfigured, setIsAIConfigured] = useState<boolean>(false);
  const navigate = useNavigate();

  // Check if OpenAI is configured on mount and when localStorage changes
  useEffect(() => {
    const checkAIConfiguration = () => {
      // Make sure we have the latest key from localStorage
      updateOpenAIApiKey();
      const configured = isOpenAIConfigured();
      
      // Log API key status for debugging
      const status = checkAPIKeyStatus();
      console.log('AI configuration check:', { 
        configured, 
        hasKey: status.hasKey, 
        keyFormat: status.keyFormat, 
        source: status.source 
      });
      
      setIsAIConfigured(configured);
    };
    
    // Check on mount
    checkAIConfiguration();
    
    // Setup listener for localStorage changes
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'openai_api_key' || event.key === null) {
        console.log('Local storage changed, rechecking API key');
        checkAIConfiguration();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check every 5 seconds in case user configures API key in another tab
    const interval = setInterval(checkAIConfiguration, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleConversionWithErrorHandling = async (text: string) => {
    try {
      // Check if OpenAI API is configured
      if (!isAIConfigured) {
        setConversionError("AI service not configured with valid API key. Please add your OpenAI API key in settings.");
        
        toast({
          variant: "destructive",
          title: "API Key Required",
          description: "Please configure your OpenAI API key in settings to use AI recipe conversion.",
        });
        return;
      }

      setConversionError(null);
      await handleConversion(text);
    } catch (error) {
      console.error('Conversion error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during conversion';
      setConversionError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Conversion Failed",
        description: errorMessage,
      });
    }
  };

  const navigateToSettings = () => {
    navigate('/settings');
    toast({
      title: "Navigating to Settings",
      description: "Please add your OpenAI API key in the settings page.",
    });
  };

  return (
    <div className="space-y-4">
      {!isAIConfigured && (
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
