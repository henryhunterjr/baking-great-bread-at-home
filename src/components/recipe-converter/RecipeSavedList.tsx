
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { RecipeData } from '@/pages/RecipeConverter';

interface RecipeSavedListProps {
  onSelectRecipe: (recipe: RecipeData) => void;
}

const RecipeSavedList: React.FC<RecipeSavedListProps> = ({ onSelectRecipe }) => {
  const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]') as RecipeData[];

  return (
    <div className="space-y-4 bg-secondary/50 rounded-lg p-4">
      <h3 className="font-serif text-xl font-medium">Saved Recipes</h3>
      <Separator />
      <div className="space-y-2">
        {savedRecipes.length > 0 ? (
          savedRecipes.map((savedRecipe: RecipeData, index: number) => (
            <div 
              key={index}
              className="p-3 bg-card rounded-md cursor-pointer hover:bg-accent transition-colors"
              onClick={() => onSelectRecipe(savedRecipe)}
            >
              <h4 className="font-medium">{savedRecipe.title}</h4>
              <p className="text-sm text-muted-foreground">
                {savedRecipe.tags.slice(0, 3).join(', ')}
              </p>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No saved recipes yet. Convert and save recipes to see them here.
          </p>
        )}
      </div>
    </div>
  );
};

export default RecipeSavedList;
