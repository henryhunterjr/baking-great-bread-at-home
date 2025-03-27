
import React, { useState, useEffect } from 'react';
import RecipeUploader from './RecipeUploader';
import { isOpenAIConfigured } from '@/lib/ai-services/ai-config';
import NoAPIKeyMessage from './NoAPIKeyMessage';

interface ConversionServiceProps {
  onConvertRecipe: (text: string) => void;
  isConverting: boolean;
  conversionError?: string | null;
}

const ConversionService: React.FC<ConversionServiceProps> = ({
  onConvertRecipe,
  isConverting,
  conversionError
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
    </div>
  );
};

export default ConversionService;
