
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
}

const RecipeUploader: React.FC<RecipeUploaderProps> = ({ 
  onConvertRecipe, 
  isConverting 
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
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // For this demo, we'll just simulate reading text from the file
    // In a real app, you would process the file contents accordingly
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const result = event.target.result as string;
        setRecipeText(result);
        setActiveTab('text');
      }
    };
    reader.onerror = () => {
      setError('Error reading file. Please try again with a different file.');
    };
    
    // Handle documents
    if (file.type.includes('text') || file.type.includes('pdf') || file.type.includes('word')) {
      reader.readAsText(file);
    }
  };
  
  const handleOCRTextExtracted = (extractedText: string) => {
    toast({
      title: "Text Extracted Successfully",
      description: "We've processed your image and extracted the recipe text.",
    });
    
    setRecipeText(extractedText);
    setActiveTab('text');
  };
  
  const handleCameraPicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    // This will now be handled by the OCR functionality in the CameraInputTab
    // No need for separate handling here
  };
  
  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setRecipeText(clipboardText);
      setError(null);
    } catch (err) {
      setError('Unable to read clipboard. Please paste the text manually.');
      console.error('Failed to read clipboard contents:', err);
    }
  };
  
  return (
    <Card className="shadow-md">
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList />
          
          <ErrorAlert error={error} />
          
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
              onFileUpload={handleFileUpload} 
              onTextExtracted={handleOCRTextExtracted} 
            />
          </TabsContent>
          
          <TabsContent value="camera">
            <CameraInputTab onCameraPicture={handleCameraPicture} />
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
