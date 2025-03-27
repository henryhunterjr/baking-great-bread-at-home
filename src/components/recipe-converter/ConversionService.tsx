
import React, { useState, useEffect } from 'react';
import RecipeUploader from './RecipeUploader';
import { isOpenAIConfigured } from '@/lib/ai-services/ai-config';
import NoAPIKeyMessage from './NoAPIKeyMessage';
import { Button } from "@/components/ui/button";
import { RotateCcw } from 'lucide-react';

interface ConversionServiceProps {
  onConvertRecipe: (text: string) => void;
  isConverting: boolean;
  conversionError?: string | null;
  onReset?: () => void;
}

const ConversionService: React.FC<ConversionServiceProps> = ({
  onConvertRecipe,
  isConverting,
  conversionError,
  onReset
}) => {
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  
  // Check if the API key is configured
  useEffect(() => {
    setHasApiKey(isOpenAIConfigured());
    
    // Recheck when the component is focused
    const handleFocus = () => {
      setHasApiKey(isOpenAIConfigured());
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);
  
  return (
    <div className="space-y-6">
      {!hasApiKey && <NoAPIKeyMessage />}
      
      <RecipeUploader 
        onConvertRecipe={onConvertRecipe}
        isConverting={isConverting}
        conversionError={conversionError}
      />

      {conversionError && onReset && (
        <div className="flex justify-center mt-6">
          <Button 
            onClick={onReset} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Try Another Recipe
          </Button>
        </div>
      )}
    </div>
  );
};

export default ConversionService;
