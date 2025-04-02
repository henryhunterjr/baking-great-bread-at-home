
import React, { useState } from 'react';
import { RecipeData } from '@/types/recipeTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Printer, RotateCcw, Save, ArrowLeft, Image, Upload, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

interface RecipeCardProps {
  recipe: RecipeData;
  onEdit: () => void;
  onPrint: () => void;
  onReset: () => void;
  onSave?: () => void;
  onUpdateRecipe?: (updatedRecipe: RecipeData) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  onEdit, 
  onPrint, 
  onReset,
  onSave,
  onUpdateRecipe
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleBackClick = () => {
    window.location.href = '/';
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // Create a URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      
      // Update the recipe with the new image URL
      if (onUpdateRecipe) {
        const updatedRecipe = {
          ...recipe,
          imageUrl
        };
        onUpdateRecipe(updatedRecipe);
      }
      
      toast({
        title: "Image Uploaded",
        description: "Your recipe image has been updated successfully.",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!recipe.title) {
      toast({
        variant: "destructive",
        title: "Missing Recipe Title",
        description: "Please add a title to your recipe before generating an image.",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Call the AI image generation endpoint
      const response = await fetch('/api/generate-recipe-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title: recipe.title,
          ingredients: recipe.ingredients,
          recipeType: recipe.cuisineType || 'food'
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to generate image: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Update the recipe with the new image URL
      if (onUpdateRecipe && data.imageUrl) {
        const updatedRecipe = {
          ...recipe,
          imageUrl: data.imageUrl
        };
        onUpdateRecipe(updatedRecipe);
        
        toast({
          title: "Image Generated",
          description: "AI has generated an image for your recipe.",
        });
      } else {
        throw new Error("No image URL returned from the server");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Failed to generate image. Please try again later.",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Card className="shadow-md print:shadow-none">
      <CardContent className="pt-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-serif font-medium print:text-3xl">{recipe.title}</h2>
          <div className="flex space-x-2 print:hidden">
            <Button variant="ghost" size="sm" onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={onPrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="ghost" size="sm" onClick={onReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              New
            </Button>
            {onSave && (
              <Button variant="default" size="sm" onClick={onSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            )}
          </div>
        </div>
        
        {/* Recipe Image Section */}
        {recipe.imageUrl ? (
          <div className="relative rounded-lg overflow-hidden h-48 md:h-64 bg-gray-100">
            <img 
              src={recipe.imageUrl} 
              alt={recipe.title} 
              className="w-full h-full object-cover"
            />
            <Button 
              variant="outline" 
              size="sm" 
              className="absolute bottom-2 right-2 bg-white/80 hover:bg-white print:hidden"
              onClick={handleImageUploadClick}
            >
              <Image className="h-4 w-4 mr-2" />
              Change Image
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg print:hidden">
            <p className="text-gray-500 mb-4">No image for this recipe</p>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleImageUploadClick}
                disabled={isUploading || isGenerating}
              >
                {isUploading ? (
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Upload Image
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleGenerateImage}
                disabled={isUploading || isGenerating}
              >
                {isGenerating ? (
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Image className="h-4 w-4 mr-2" />
                )}
                Generate with AI
              </Button>
            </div>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        
        {recipe.introduction && (
          <div className="prose">
            <p className="text-gray-600">{recipe.introduction}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-medium mb-2 font-serif">Ingredients</h3>
            <ul className="list-disc pl-5 space-y-1">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="text-gray-600">{ingredient}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-2 font-serif">Instructions</h3>
            <ol className="list-decimal pl-5 space-y-2">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="text-gray-600">{instruction}</li>
              ))}
            </ol>
          </div>
        </div>
        
        {recipe.notes && recipe.notes.length > 0 && (
          <div>
            <h3 className="text-xl font-medium mb-2 font-serif">Notes</h3>
            <ul className="list-disc pl-5 space-y-1">
              {recipe.notes.map((note, index) => (
                <li key={index} className="text-gray-600">{note}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
