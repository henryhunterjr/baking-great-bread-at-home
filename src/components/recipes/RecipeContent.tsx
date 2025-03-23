
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Recipe } from './types';

interface RecipeContentProps {
  recipe: Recipe;
}

const RecipeContent: React.FC<RecipeContentProps> = ({ recipe }) => {
  return (
    <div className="p-6 flex-grow flex flex-col">
      <div className="mb-3 text-xs text-muted-foreground">{recipe.date}</div>
      <h3 className="font-serif text-xl font-medium mb-2 group-hover:text-bread-800 transition-colors">
        {recipe.title}
      </h3>
      <p className="text-muted-foreground text-sm mb-4 flex-grow">
        {recipe.description}
      </p>
      <span className="inline-flex items-center text-bread-800 text-sm font-medium mt-auto">
        Read Recipe
        <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
      </span>
    </div>
  );
};

export default RecipeContent;
