
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';

// Import our new component files
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
    
    if (file.type.includes('image')) {
      // For images, we'd use OCR in a real implementation
      // For this demo, we'll just simulate extracting text
      reader.readAsDataURL(file);
      setRecipeText("Classic Sourdough Bread\n\nIngredients:\n- 500g bread flour\n- 350g water\n- 100g active starter\n- 10g salt\n\nMix ingredients, rest 30 min. Stretch and fold every 30 min for 2 hours. Bulk ferment 4 hours. Shape and cold proof overnight. Bake at 500F for 20 min covered, 25 min uncovered.");
    } else {
      reader.readAsText(file);
    }
  };
  
  const handleCameraPicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Same as file upload but with camera image
    // For this demo, we'll simulate text extraction
    
    setRecipeText("Classic Sourdough Bread\n\nIngredients:\n- 500g bread flour\n- 350g water\n- 100g active starter\n- 10g salt\n\nMix ingredients, rest 30 min. Stretch and fold every 30 min for 2 hours. Bulk ferment 4 hours. Shape and cold proof overnight. Bake at 500F for 20 min covered, 25 min uncovered.");
    setActiveTab('text');
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
            <FileUploadTab onFileUpload={handleFileUpload} />
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
