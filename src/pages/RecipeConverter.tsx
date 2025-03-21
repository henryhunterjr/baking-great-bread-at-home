
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import ConversionService from '@/components/recipe-converter/ConversionService';
import RecipeForm from '@/components/recipe-converter/RecipeForm';
import RecipeCard from '@/components/recipe-converter/RecipeCard';
import RecipeAssistant from '@/components/recipe-converter/RecipeAssistant';
import RecipeSavedList from '@/components/recipe-converter/RecipeSavedList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  equipmentNeeded: { name: string; affiliateLink?: string }[];
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
    setRecipe(convertedRecipe);
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
    setRecipe(savedRecipe);
    setIsEditing(false);
  };
  
  return (
    <div className="container max-w-6xl py-8 md:py-12">
      <h1 className="section-title text-center mb-3">From Card to Kitchen</h1>
      <p className="section-subtitle text-center mb-8">
        Convert old family recipes, scanned images, or digital clippings into clean, standardized recipe cards
      </p>
      
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
  );
};

export default RecipeConverter;
