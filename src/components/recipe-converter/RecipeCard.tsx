
import React, { useState } from 'react';
import { RecipeData } from '@/types/recipeTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Printer, RotateCcw, Save, ArrowLeft, Image, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

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
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleBackClick = () => {
    // Use direct URL navigation to ensure it works in all environments
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
      setShowImageOptions(false);
    }
  };

  const handleGenerateImage = async () => {
    setIsUploading(true);
    
    try {
      // Generate a placeholder image URL based on the recipe title
      const placeholderUrl = `https://source.unsplash.com/random/1200x800/?food,${recipe.title.replace(/\s+/g, ',')}`;
      
      // Update the recipe with the new image URL
      if (onUpdateRecipe) {
        const updatedRecipe = {
          ...recipe,
          imageUrl: placeholderUrl
        };
        onUpdateRecipe(updatedRecipe);
      }
      
      toast({
        title: "Image Generated",
        description: "A placeholder image for your recipe has been generated.",
      });
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Failed to generate image. Please try again.",
      });
    } finally {
      setIsUploading(false);
      setShowImageOptions(false);
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
              onClick={() => setShowImageOptions(prev => !prev)}
            >
              <Image className="h-4 w-4 mr-2" />
              Change Image
            </Button>
            
            {showImageOptions && (
              <div className="absolute bottom-12 right-2 bg-white p-2 rounded-md shadow-md space-y-2 print:hidden">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={handleImageUploadClick}
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={handleGenerateImage}
                  disabled={isUploading}
                >
                  <Image className="h-4 w-4 mr-2" />
                  Generate Image
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-lg print:hidden">
            <p className="text-gray-500 mb-4">No image for this recipe</p>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleImageUploadClick}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleGenerateImage}
                disabled={isUploading}
              >
                <Image className="h-4 w-4 mr-2" />
                Generate Image
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
