
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { RecipeData } from '@/types/recipeTypes';
import { logInfo } from '@/utils/logger';

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
  const [conversionError, setConversionError] = useState<string | null>(null);
  
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
    // Ensure we have all required fields with fallback values
    const processedRecipe = {
      ...convertedRecipe,
      // Ensure recipe has a title
      title: convertedRecipe.title || 'Untitled Recipe',
      // Ensure recipe has ingredients
      ingredients: convertedRecipe.ingredients?.length ? 
        convertedRecipe.ingredients : ['Add your ingredients here'],
      // Ensure recipe has instructions
      instructions: convertedRecipe.instructions?.length ? 
        convertedRecipe.instructions : ['Add your instructions here'],
      // Ensure each equipment item has an ID
      equipmentNeeded: convertedRecipe.equipmentNeeded?.map(item => ({
        id: item.id || uuidv4(),
        name: item.name || 'Equipment',
        affiliateLink: item.affiliateLink
      })) || [],
      // Ensure isConverted flag is set
      isConverted: true
    };
    
    logInfo("Recipe conversion complete", {
      hasTitle: !!processedRecipe.title,
      ingredientsCount: processedRecipe.ingredients.length,
      instructionsCount: processedRecipe.instructions.length,
      isConverted: processedRecipe.isConverted
    });
    
    setRecipe(processedRecipe);
    setIsEditing(false); // Don't go directly to editing mode
    setConversionError(null);
    
    toast({
      title: "Recipe Converted!",
      description: "Your recipe has been successfully converted. You can now save it to your collection.",
    });
    
    // Auto-switch to the favorites tab to guide the user
    setActiveTab("favorites");
  };
  
  const handleSaveRecipe = (updatedRecipe: RecipeData = recipe) => {
    // If no recipe ID exists, create one (for new recipes)
    const recipeToSave = {
      ...updatedRecipe,
      id: updatedRecipe.id || uuidv4(),
      createdAt: updatedRecipe.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    logInfo("Saving recipe", {
      id: recipeToSave.id,
      title: recipeToSave.title,
      ingredientsCount: recipeToSave.ingredients.length,
      instructionsCount: recipeToSave.instructions.length
    });
    
    setRecipe(recipeToSave);
    setIsEditing(false);
    
    // Get existing recipes from localStorage
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    
    // Check if this recipe already exists in saved recipes
    const existingRecipeIndex = savedRecipes.findIndex((r: RecipeData) => r.id === recipeToSave.id);
    
    if (existingRecipeIndex >= 0) {
      // Update existing recipe
      savedRecipes[existingRecipeIndex] = recipeToSave;
      toast({
        title: "Recipe Updated!",
        description: "Your recipe has been updated in your collection.",
      });
    } else {
      // Add new recipe
      savedRecipes.push(recipeToSave);
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
    setConversionError(null);
  };
  
  const resetRecipe = () => {
    setRecipe(defaultRecipe);
    setIsEditing(false);
    setConversionError(null);
    setActiveTab("assistant");
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
    resetRecipe,
    conversionError,
    setConversionError
  };
};
