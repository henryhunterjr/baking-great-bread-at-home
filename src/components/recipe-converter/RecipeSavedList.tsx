import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RecipeData } from '@/types/recipeTypes';
import { AlertCircle, Bookmark, BookOpen, LogIn, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { getSavedRecipes, clearAllRecipes, deleteRecipe } from '@/utils/storage-helpers';

interface RecipeSavedListProps {
  onSelectRecipe: (recipe: RecipeData) => void;
  activeTab?: string;
}

const RecipeSavedList: React.FC<RecipeSavedListProps> = ({ 
  onSelectRecipe,
  activeTab
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [savedRecipes, setSavedRecipes] = useState<RecipeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load saved recipes initially and when activeTab changes to "favorites"
  useEffect(() => {
    if (activeTab === "favorites" && user) {
      loadSavedRecipes();
    }
  }, [activeTab, user]);
  
  // Initial load
  useEffect(() => {
    if (user) {
      loadSavedRecipes();
    } else {
      setIsLoading(false);
    }
  }, [user]);
  
  const loadSavedRecipes = async () => {
    setIsLoading(true);
    try {
      const recipes = await getSavedRecipes();
      setSavedRecipes(recipes);
    } catch (error) {
      console.error('Error loading saved recipes:', error);
      toast({
        variant: "destructive",
        title: "Error Loading Recipes",
        description: "Failed to load your saved recipes.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async (index: number) => {
    const recipeId = savedRecipes[index].id;
    if (!recipeId) return;
    
    try {
      const success = await deleteRecipe(recipeId);
      if (success) {
        const updatedRecipes = [...savedRecipes];
        updatedRecipes.splice(index, 1);
        setSavedRecipes(updatedRecipes);
        
        toast({
          title: "Recipe Deleted",
          description: "Recipe was successfully removed from your saved recipes.",
        });
      } else {
        throw new Error("Failed to delete recipe");
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete the recipe. Please try again.",
      });
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to delete all saved recipes? This action cannot be undone.')) {
      try {
        const success = await clearAllRecipes();
        if (success) {
          setSavedRecipes([]);
          toast({
            title: "All Recipes Deleted",
            description: "All your saved recipes have been deleted.",
          });
        } else {
          throw new Error("Failed to clear recipes");
        }
      } catch (error) {
        console.error('Error clearing recipes:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to clear all recipes. Please try again.",
        });
      }
    }
  };

  // If not logged in, display authentication message
  if (!user) {
    return (
      <Card className="p-4 h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Bookmark className="h-5 w-5 mr-2" />
            Saved Recipes
          </h3>
        </div>
        
        <div className="text-center py-8 space-y-3">
          <div className="mx-auto bg-muted rounded-full w-12 h-12 flex items-center justify-center">
            <LogIn className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Login required</p>
            <p className="text-xs text-muted-foreground mt-1">
              Sign in to save and access your recipes
            </p>
          </div>
          <Link to="/auth">
            <Button className="mt-2" variant="default">
              Sign In
            </Button>
          </Link>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Bookmark className="h-5 w-5 mr-2" />
          Saved Recipes
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={loadSavedRecipes}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="sr-only">Refresh</span>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bread-700"></div>
        </div>
      ) : savedRecipes.length > 0 ? (
        <div className="space-y-3">
          <div className="max-h-[400px] overflow-y-auto pr-1">
            {savedRecipes.map((recipe, index) => (
              <div 
                key={index}
                className="border border-border rounded-md p-2 mb-2 hover:bg-muted/50 transition-colors relative group"
              >
                <div 
                  className="cursor-pointer"
                  onClick={() => onSelectRecipe(recipe)}
                >
                  <h4 className="font-medium truncate pr-6">{recipe.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {recipe.ingredients.length} ingredients • {recipe.instructions.length} steps
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDelete(index)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            ))}
          </div>
          
          {savedRecipes.length > 1 && (
            <div className="pt-2 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs text-muted-foreground"
                onClick={handleClearAll}
              >
                Clear All Recipes
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 space-y-3">
          <div className="mx-auto bg-muted rounded-full w-12 h-12 flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">No saved recipes yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              After you convert a recipe, it will appear here when you save it
            </p>
          </div>
        </div>
      )}
      
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex items-center text-xs text-muted-foreground">
          <AlertCircle className="h-4 w-4 mr-2 text-muted-foreground" />
          <p>Successfully converted recipes will appear in the "My Recipes" tab. They need to be saved to appear in this list.</p>
        </div>
      </div>
    </Card>
  );
};

export default RecipeSavedList;
