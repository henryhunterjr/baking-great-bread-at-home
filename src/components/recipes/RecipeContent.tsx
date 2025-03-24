
import React, { memo, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Recipe } from './types';
import { logInfo } from '@/utils/logger';

interface RecipeContentProps {
  recipe: Recipe;
}

const RecipeContent: React.FC<RecipeContentProps> = ({ recipe }) => {
  useEffect(() => {
    // Only log if recipe exists and has an id
    if (recipe?.id && recipe?.title) {
      // Log for analytics purposes when a recipe is viewed
      logInfo('Recipe content viewed', { 
        recipeId: recipe.id, 
        recipeTitle: recipe.title 
      });
    }
  }, [recipe?.id, recipe?.title]);

  // Guard against missing data
  if (!recipe) {
    return (
      <div className="p-6 flex-grow flex flex-col">
        <p className="text-muted-foreground text-sm">Recipe information unavailable</p>
      </div>
    );
  }

  return (
    <div className="p-6 flex-grow flex flex-col">
      <div className="mb-3 text-xs text-muted-foreground" aria-label="Publication date">
        {recipe.date || 'No date available'}
      </div>
      <h3 className="font-serif text-xl font-medium mb-2 group-hover:text-bread-800 transition-colors">
        {recipe.title || 'Untitled Recipe'}
      </h3>
      <p className="text-muted-foreground text-sm mb-4 flex-grow">
        {recipe.description || 'No description available'}
      </p>
      <span className="inline-flex items-center text-bread-800 text-sm font-medium mt-auto" aria-label="Read full recipe">
        Read Recipe
        <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </div>
  );
};

// Memoize the RecipeContent component to prevent unnecessary re-renders
export default memo(RecipeContent);
