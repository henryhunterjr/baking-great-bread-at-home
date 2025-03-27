
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { RecipeData } from '@/types/recipeTypes';

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

export const useRecipeConverter = () => {
  const { toast } = useToast();
  const [recipe, setRecipe] = useState<RecipeData>(defaultRecipe);
  const [isEditing, setIsEditing] = useState(false);
  const [showConversionSuccess, setShowConversionSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("assistant");
  
  useEffect(() => {
    // Show success alert for 7 seconds after conversion
    if (recipe.isConverted && !isEditing) {
      setShowConversionSuccess(true);
      const timer = setTimeout(() => {
        setShowConversionSuccess(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [recipe.isConverted, isEditing]);
  
  const handleConversionComplete = (convertedRecipe: RecipeData) => {
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
    
    toast({
      title: "Recipe Converted!",
      description: "Your recipe has been successfully converted. You can now edit and save it.",
    });
    
    // Auto-switch to the favorites tab to guide the user
    setActiveTab("favorites");
  };
  
  const handleSaveRecipe = (updatedRecipe: RecipeData) => {
    // If no recipe ID exists, create one (for new recipes)
    if (!updatedRecipe.id) {
      updatedRecipe.id = uuidv4();
    }
    
    // Add timestamp if not present
    if (!updatedRecipe.createdAt) {
      updatedRecipe.createdAt = new Date().toISOString();
    }
    
    // Always update the updatedAt timestamp
    updatedRecipe.updatedAt = new Date().toISOString();
    
    setRecipe(updatedRecipe);
    setIsEditing(false);
    
    // Get existing recipes from localStorage
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    
    // Check if this recipe already exists in saved recipes
    const existingRecipeIndex = savedRecipes.findIndex((r: RecipeData) => r.id === updatedRecipe.id);
    
    if (existingRecipeIndex >= 0) {
      // Update existing recipe
      savedRecipes[existingRecipeIndex] = updatedRecipe;
      toast({
        title: "Recipe Updated!",
        description: "Your recipe has been updated in your collection.",
      });
    } else {
      // Add new recipe
      savedRecipes.push(updatedRecipe);
      toast({
        title: "Recipe Saved!",
        description: "Your recipe has been added to your collection.",
      });
    }
    
    // Save back to localStorage
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    
    // Auto-switch to favorites tab after saving
    setActiveTab("favorites");
  };

  const handleSelectSavedRecipe = (savedRecipe: RecipeData) => {
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
  
  const resetRecipe = () => {
    setRecipe(defaultRecipe);
    setIsEditing(false);
  };
  
  return {
    recipe,
    isEditing,
    setIsEditing,
    showConversionSuccess,
    activeTab,
    setActiveTab,
    handleConversionComplete,
    handleSaveRecipe,
    handleSelectSavedRecipe,
    resetRecipe
  };
};
