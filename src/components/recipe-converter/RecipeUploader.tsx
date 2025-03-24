
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";

// Import our component files
import TabsList from './uploader/TabsList';
import ErrorAlert from './uploader/ErrorAlert';
import TextInputTab from './uploader/tabs/TextInputTab';
import FileUploadTab from './uploader/tabs/FileUploadTab';
import CameraInputTab from './uploader/tabs/CameraInputTab';
import ClipboardTab from './uploader/tabs/ClipboardTab';

interface RecipeUploaderProps {
  onConvertRecipe: (text: string) => void;
  isConverting: boolean;
  conversionError?: string | null;
}

const RecipeUploader: React.FC<RecipeUploaderProps> = ({ 
  onConvertRecipe, 
  isConverting,
  conversionError = null
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('text');
  const [recipeText, setRecipeText] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeText.trim()) {
      setError('Please enter some recipe text to convert');
      return;
    }
    setError(null);
    onConvertRecipe(recipeText);
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList />
          
          <ErrorAlert error={displayError} />
          
          <TabsContent value="text">
            <TextInputTab 
              recipeText={recipeText}
              setRecipeText={setRecipeText}
              onSubmit={handleTextSubmit}
              isConverting={isConverting}
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
              onConvertRecipe={() => onConvertRecipe(recipeText)}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RecipeUploader;
