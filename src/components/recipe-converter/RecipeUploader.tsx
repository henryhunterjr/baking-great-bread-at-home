
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";
import { FormProvider, useForm } from 'react-hook-form';

// Import our component files
import TabsList from './uploader/TabsList';
import ErrorAlert from './uploader/ErrorAlert';
import TextInputTab from './uploader/tabs/TextInputTab';
import FileUploadTab from './uploader/tabs/FileUploadTab';
import CameraInputTab from './uploader/tabs/CameraInputTab';
import ClipboardTab from './uploader/tabs/ClipboardTab';
import { RecipeData } from '@/types/recipeTypes';
import { useAIConversion, ConversionErrorType } from '@/services/AIConversionService';

interface RecipeUploaderProps {
  onConvertRecipe: (text: string) => void;
  isConverting: boolean;
  conversionError?: string | null;
  recipe?: RecipeData;
  onSaveRecipe?: () => void;
  onAiSuggestionsUpdate?: (suggestions: string[]) => void;
}

const RecipeUploader: React.FC<RecipeUploaderProps> = ({ 
  onConvertRecipe, 
  isConverting,
  conversionError = null,
  recipe,
  onSaveRecipe,
  onAiSuggestionsUpdate
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('text');
  const [recipeText, setRecipeText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const form = useForm();
  
  // Use the AI conversion service
  const { processRecipe, handleError, isProcessing } = useAIConversion();
  
  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeText.trim()) {
      setError('Please enter some recipe text to convert');
      return;
    }
    setError(null);
    
    // First try with AI processing if configured
    try {
      const aiResult = await processRecipe(recipeText);
      
      if (aiResult.success && aiResult.data) {
        // Use AI-processed recipe data
        const processedText = recipeText; // Keep original text
        
        // Extract AI suggestions if available
        if (aiResult.aiSuggestions && onAiSuggestionsUpdate) {
          const allSuggestions = [
            ...(aiResult.aiSuggestions.tips || []),
            ...(aiResult.aiSuggestions.improvements || [])
          ];
          
          // Update parent component with suggestions
          onAiSuggestionsUpdate(allSuggestions);
          
          // Also show a toast with a tip
          if (allSuggestions.length > 0) {
            const randomTip = allSuggestions[Math.floor(Math.random() * allSuggestions.length)];
            toast({
              title: "Baker's Tip",
              description: randomTip,
              duration: 6000,
            });
          }
        }
        
        // Continue with standard conversion
        onConvertRecipe(processedText);
        return;
      }
      
      // If AI processing failed but we have error info, try to recover
      if (!aiResult.success && aiResult.error) {
        const recoveryResult = await handleError(
          aiResult.error.type || ConversionErrorType.UNKNOWN,
          recipeText
        );
        
        if (recoveryResult.success) {
          // We recovered something with AI
          toast({
            title: "Recipe Recovered",
            description: "We had some trouble processing your recipe, but we were able to recover it with AI assistance.",
            duration: 6000,
          });
          
          // Continue with standard conversion using original text
          onConvertRecipe(recipeText);
          return;
        }
      }
      
      // If AI processing wasn't successful, fall back to standard conversion
      onConvertRecipe(recipeText);
    } catch (err) {
      // Fallback to standard conversion on any error
      console.error("AI conversion error:", err);
      onConvertRecipe(recipeText);
    }
  };
  
  const handleTextExtracted = (extractedText: string) => {
    setRecipeText(extractedText);
    setActiveTab('text');
    
    toast({
      title: "Text Extracted Successfully",
      description: "We've processed your file and extracted the recipe text.",
    });
  };
  
  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (!clipboardText.trim()) {
        setError('No text found in clipboard');
        return;
      }
      
      setRecipeText(clipboardText);
      setError(null);
      toast({
        title: "Text Pasted",
        description: "Recipe text pasted from clipboard.",
      });
    } catch (err) {
      setError('Unable to read clipboard. Please paste the text manually.');
      console.error('Failed to read clipboard contents:', err);
    }
  };
  
  // Use conversionError from props if available
  const displayError = conversionError || error;
  
  return (
    <Card className="shadow-md">
      <CardContent className="pt-6">
        <FormProvider {...form}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList />
            
            <ErrorAlert error={displayError} />
            
            <TabsContent value="text">
              <TextInputTab 
                recipeText={recipeText}
                setRecipeText={setRecipeText}
                onSubmit={handleTextSubmit}
                isConverting={isConverting || isProcessing}
                error={displayError}
              />
            </TabsContent>
            
            <TabsContent value="upload">
              <FileUploadTab 
                onTextExtracted={handleTextExtracted} 
                setError={setError}
              />
            </TabsContent>
            
            <TabsContent value="camera">
              <CameraInputTab 
                onTextExtracted={handleTextExtracted}
                setError={setError}
              />
            </TabsContent>
            
            <TabsContent value="paste">
              <ClipboardTab 
                recipeText={recipeText}
                handlePaste={handlePaste}
                isConverting={isConverting}
                onConvertRecipe={() => handleTextSubmit({ preventDefault: () => {} } as React.FormEvent)}
                recipe={recipe}
                onSaveRecipe={onSaveRecipe}
              />
            </TabsContent>
          </Tabs>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default RecipeUploader;
