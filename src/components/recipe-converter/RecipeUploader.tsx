
import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Camera, 
  Upload, 
  FileText, 
  Clipboard, 
  Loader2
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
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
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Text</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="camera" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">Camera</span>
            </TabsTrigger>
            <TabsTrigger value="paste" className="flex items-center gap-2">
              <Clipboard className="h-4 w-4" />
              <span className="hidden sm:inline">Paste</span>
            </TabsTrigger>
          </TabsList>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <TabsContent value="text">
            <form onSubmit={handleTextSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipe-text">Enter your recipe text</Label>
                <Textarea
                  id="recipe-text"
                  placeholder="Paste or type your recipe here..."
                  className="min-h-[200px]"
                  value={recipeText}
                  onChange={(e) => setRecipeText(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-bread-800 text-white hover:bg-bread-900"
                  disabled={isConverting || !recipeText.trim()}
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    'Convert Recipe'
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="upload">
            <div className="space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Upload Recipe File</h3>
                <p className="text-muted-foreground mb-4">
                  Upload an image or document of your recipe
                </p>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf,.docx,.txt"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select File
                </Button>
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                Supported formats: JPEG, PNG, PDF, DOCX, TXT
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="camera">
            <div className="space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Camera className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Take a Photo</h3>
                <p className="text-muted-foreground mb-4">
                  Use your camera to take a photo of your recipe
                </p>
                <Input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleCameraPicture}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  Open Camera
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="paste">
            <div className="space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Clipboard className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Paste From Clipboard</h3>
                <p className="text-muted-foreground mb-4">
                  Paste recipe text from your clipboard
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePaste}
                >
                  Paste From Clipboard
                </Button>
              </div>
              
              {recipeText && (
                <div className="mt-4">
                  <Button 
                    type="button" 
                    className="w-full bg-bread-800 text-white hover:bg-bread-900"
                    disabled={isConverting}
                    onClick={() => onConvertRecipe(recipeText)}
                  >
                    {isConverting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      'Convert Recipe'
                    )}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RecipeUploader;
