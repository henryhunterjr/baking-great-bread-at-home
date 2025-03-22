
import React, { useEffect, useState } from 'react';
import { RecipeData } from '@/pages/RecipeConverter';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronRight, Clock, User } from 'lucide-react';
import { getSavedRecipes } from '@/services/RecipeService';

interface RecipeSavedListProps {
  onSelectRecipe: (recipe: RecipeData) => void;
}

const RecipeSavedList: React.FC<RecipeSavedListProps> = ({ onSelectRecipe }) => {
  const [savedRecipes, setSavedRecipes] = useState<RecipeData[]>([]);

  useEffect(() => {
    // Load saved recipes from localStorage using our service
    const recipes = getSavedRecipes();
    setSavedRecipes(recipes);
  }, []);

  if (savedRecipes.length === 0) {
    return (
      <div className="text-center p-4 border rounded-lg bg-muted/30">
        <p className="text-muted-foreground mb-2">No saved recipes yet</p>
        <p className="text-sm">Convert a recipe and save it to see it here</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] rounded-md border p-4">
      <div className="space-y-4">
        {savedRecipes.map((recipe, index) => (
          <div key={index} className="p-4 border rounded-lg hover:bg-accent transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{recipe.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{recipe.totalTime || 'Time not specified'}</span>
                  {recipe.isPublic && (
                    <>
                      <span className="mx-1">•</span>
                      <User className="h-3 w-3 mr-1" />
                      <span>Public</span>
                    </>
                  )}
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-0" 
                onClick={() => onSelectRecipe(recipe)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-2">
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {recipe.introduction?.substring(0, 100) || 'No description available'}...
              </p>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-3">
              {recipe.tags.slice(0, 3).map((tag, tagIndex) => (
                <span key={tagIndex} className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs">
                  {tag}
                </span>
              ))}
              {recipe.tags.length > 3 && (
                <span className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs">
                  +{recipe.tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default RecipeSavedList;
