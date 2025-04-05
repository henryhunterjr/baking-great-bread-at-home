
import React, { useState, useRef } from 'react';
import { RecipeData } from '@/types/recipeTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Printer, RotateCcw, Save, ArrowLeft, Image, Upload, Loader, CropIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import ImageCropper from '@/components/recipe-converter/ImageCropper';

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
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const printAreaRef = useRef<HTMLDivElement>(null);
  
  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Force a hard navigation to the root page
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
      const imageUrl = URL.createObjectURL(file);
      
      if (onUpdateRecipe) {
        const updatedRecipe = {
          ...recipe,
          imageUrl
        };
        onUpdateRecipe(updatedRecipe);
        // Now show the cropper for the new image
        setShowCropper(true);
      }
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

  const handleEditImage = () => {
    if (recipe.imageUrl) {
      setShowCropper(true);
    }
  };

  const handlePrint = () => {
    if (printAreaRef.current) {
      const printContents = printAreaRef.current.innerHTML;
      
      // Open a new window for printing
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${recipe.title || 'Recipe'}</title>
              <style>
                body {
                  font-family: system-ui, sans-serif;
                  line-height: 1.5;
                  padding: 20px;
                  max-width: 800px;
                  margin: 0 auto;
                }
                h1, h2, h3 {
                  font-family: serif;
                }
                img {
                  max-width: 100%;
                  height: auto;
                  border-radius: 4px;
                }
                .recipe-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 20px;
                  margin: 20px 0;
                }
                @media (max-width: 600px) {
                  .recipe-grid {
                    grid-template-columns: 1fr;
                  }
                }
                ul, ol {
                  padding-left: 20px;
                }
                .recipe-notes {
                  background-color: #f9f9f9;
                  padding: 15px;
                  border-radius: 4px;
                  margin-top: 20px;
                }
              </style>
            </head>
            <body>
              ${printContents}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.onafterprint = function() {
          printWindow.close();
        };
      } else {
        toast({
          variant: "destructive",
          title: "Print Failed",
          description: "Could not open print window. Please check your browser settings.",
        });
      }
    }
  };
  
  const handleCropComplete = (croppedImageUrl: string) => {
    if (onUpdateRecipe) {
      onUpdateRecipe({
        ...recipe,
        imageUrl: croppedImageUrl
      });
      
      setShowCropper(false);
      
      toast({
        title: "Image Updated",
        description: "Your recipe image has been adjusted successfully.",
      });
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
            <Button variant="ghost" size="sm" onClick={handlePrint}>
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
        
        {/* Print Area - This is what gets printed */}
        <div ref={printAreaRef}>
          <h1 className="text-2xl font-serif font-medium mb-4">{recipe.title}</h1>
          
          {recipe.imageUrl ? (
            <div className="relative rounded-lg overflow-hidden h-48 md:h-64 bg-gray-100 mb-6">
              <img 
                src={recipe.imageUrl} 
                alt={recipe.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 right-2 space-x-2 print:hidden">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white/80 hover:bg-white print:hidden"
                  onClick={handleImageUploadClick}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Change
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white/80 hover:bg-white print:hidden"
                  onClick={handleEditImage}
                >
                  <CropIcon className="h-4 w-4 mr-2" />
                  Adjust
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg mb-6 print:hidden">
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

          {recipe.introduction && (
            <div className="prose mb-6">
              <p className="text-gray-600">{recipe.introduction}</p>
            </div>
          )}

          {/* Time Information */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {recipe.prepTime && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Prep Time</h4>
                <p>{recipe.prepTime}</p>
              </div>
            )}
            {recipe.cookTime && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Cook Time</h4>
                <p>{recipe.cookTime}</p>
              </div>
            )}
            {recipe.restTime && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Rest Time</h4>
                <p>{recipe.restTime}</p>
              </div>
            )}
            {recipe.totalTime && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Total Time</h4>
                <p>{recipe.totalTime}</p>
              </div>
            )}
          </div>
          
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
            <div className="mt-6">
              <h3 className="text-xl font-medium mb-2 font-serif">Notes</h3>
              <ul className="list-disc pl-5 space-y-1">
                {recipe.notes.map((note, index) => (
                  <li key={index} className="text-gray-600">{note}</li>
                ))}
              </ul>
            </div>
          )}
          
          {recipe.equipmentNeeded && recipe.equipmentNeeded.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-medium mb-2 font-serif">Equipment</h3>
              <ul className="list-disc pl-5 space-y-1">
                {recipe.equipmentNeeded.map((item, index) => (
                  <li key={index} className="text-gray-600">
                    {item.name}
                    {item.affiliateLink && (
                      <a href={item.affiliateLink} className="ml-2 text-blue-500 underline" target="_blank" rel="noopener noreferrer">
                        (Buy)
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        
        {/* Image Cropper Modal */}
        {showCropper && recipe.imageUrl && (
          <ImageCropper 
            imageUrl={recipe.imageUrl}
            onComplete={handleCropComplete}
            onCancel={() => setShowCropper(false)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
