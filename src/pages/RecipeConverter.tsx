
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConversionService from '@/components/recipe-converter/ConversionService';
import RecipeForm from '@/components/recipe-converter/RecipeForm';
import RecipeCard from '@/components/recipe-converter/RecipeCard';
import RecipeAssistant from '@/components/recipe-converter/RecipeAssistant';
import RecipeSavedList from '@/components/recipe-converter/RecipeSavedList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { v4 as uuidv4 } from 'uuid';
import { EquipmentItem } from '@/types/recipeTypes';
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export type RecipeData = {
  title: string;
  introduction: string;
  ingredients: string[];
  prepTime: string;
  restTime: string;
  bakeTime: string;
  totalTime: string;
  instructions: string[];
  tips: string[];
  proTips: string[];
  equipmentNeeded: EquipmentItem[];
  imageUrl: string;
  tags: string[];
  isPublic: boolean;
  isConverted: boolean;
};

const defaultRecipe: RecipeData = {
  title: '',
  introduction: '',
  ingredients: [],
  prepTime: '',
  restTime: '',
  bakeTime: '',
  totalTime: '',
  instructions: [],
  tips: [],
  proTips: [],
  equipmentNeeded: [],
  imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
  tags: [],
  isPublic: false,
  isConverted: false
};

const RecipeConverter: React.FC = () => {
  const { toast } = useToast();
  const [recipe, setRecipe] = useState<RecipeData>(defaultRecipe);
  const [isEditing, setIsEditing] = useState(false);
  
  const handleConversionComplete = (convertedRecipe: RecipeData) => {
    // Ensure all equipment items have an ID
    const processedRecipe = {
      ...convertedRecipe,
      equipmentNeeded: convertedRecipe.equipmentNeeded?.map(item => ({
        id: item.id || uuidv4(),
        name: item.name,
        affiliateLink: item.affiliateLink
      })) || []
    };
    
    setRecipe(processedRecipe);
    setIsEditing(true);
  };
  
  const handleSaveRecipe = (updatedRecipe: RecipeData) => {
    setRecipe(updatedRecipe);
    setIsEditing(false);
    
    // Here you would save to backend/localStorage
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    savedRecipes.push(updatedRecipe);
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    
    toast({
      title: "Recipe Saved!",
      description: "Your recipe has been saved to your collection.",
    });
  };

  const handleSelectSavedRecipe = (savedRecipe: RecipeData) => {
    // Ensure all equipment items have an ID when loading a saved recipe
    const processedRecipe = {
      ...savedRecipe,
      equipmentNeeded: savedRecipe.equipmentNeeded?.map(item => ({
        id: item.id || uuidv4(),
        name: item.name,
        affiliateLink: item.affiliateLink
      })) || []
    };
    
    setRecipe(processedRecipe);
    setIsEditing(false);
  };
  
  return (
    <div className="min-h-screen pb-12">
      {/* Navigation header */}
      <div className="border-b border-muted/30 mb-8">
        <div className="container max-w-6xl py-4 flex items-center">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      <div className="container max-w-6xl">
        <h1 className="section-title text-center mb-3">From Card to Kitchen</h1>
        <p className="section-subtitle text-center mb-8">
          Convert old family recipes, scanned images, or digital clippings into clean, standardized recipe cards
        </p>
        
        <div className="mb-8">
          <Card className="overflow-hidden border-none shadow-lg">
            <AspectRatio ratio={16/9} className="bg-muted">
              <img 
                src="/lovable-uploads/6bd70716-b37b-49fa-8e85-78c9c1002c23.png" 
                alt="Vintage handwritten recipe card" 
                className="object-cover w-full h-full brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h2 className="text-2xl font-serif font-semibold">Preserve Your Family Legacy</h2>
                  <p className="text-sm opacity-90">Transform treasured handwritten recipes into digital format that will last for generations</p>
                </div>
              </div>
            </AspectRatio>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {!recipe.isConverted ? (
              <ConversionService onConversionComplete={handleConversionComplete} />
            ) : isEditing ? (
              <RecipeForm 
                initialRecipe={recipe} 
                onSave={handleSaveRecipe} 
                onCancel={() => setIsEditing(false)} 
              />
            ) : (
              <div className="space-y-4">
                <RecipeCard 
                  recipe={recipe} 
                  onEdit={() => setIsEditing(true)} 
                  onPrint={() => window.print()} 
                  onReset={() => {
                    setRecipe(defaultRecipe);
                    setIsEditing(false);
                  }}
                />
              </div>
            )}
          </div>
          
          <div>
            <Tabs defaultValue="assistant" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
                <TabsTrigger value="favorites">My Recipes</TabsTrigger>
              </TabsList>
              <TabsContent value="assistant" className="mt-4">
                <RecipeAssistant recipe={recipe} />
              </TabsContent>
              <TabsContent value="favorites" className="mt-4">
                <RecipeSavedList onSelectRecipe={handleSelectSavedRecipe} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeConverter;
