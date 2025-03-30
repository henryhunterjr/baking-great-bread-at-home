
import React from 'react';
import { Clock, ChefHat, Calendar } from 'lucide-react';
import { Recipe } from './types';
import { Badge } from '@/components/ui/badge';

interface RecipeContentProps {
  recipe: Recipe;
}

const RecipeContent: React.FC<RecipeContentProps> = ({ recipe }) => {
  return (
    <div className="p-4 flex flex-col gap-2">
      <h3 className="font-serif text-lg font-medium line-clamp-2 mb-1">
        {recipe.title}
      </h3>
      
      <div className="flex flex-wrap gap-2 mt-1">
        {recipe.difficulty && (
          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            <ChefHat className="h-3 w-3" />
            {recipe.difficulty}
          </Badge>
        )}
        
        {recipe.cookTime && (
          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            <Clock className="h-3 w-3" />
            {recipe.cookTime}
          </Badge>
        )}
        
        {recipe.publishDate && (
          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            <Calendar className="h-3 w-3" />
            {new Date(recipe.publishDate).toLocaleDateString()}
          </Badge>
        )}
      </div>
      
      <p className="text-muted-foreground text-sm line-clamp-2 mt-2">
        {recipe.description || "A delicious recipe for you to try at home."}
      </p>
    </div>
  );
};

export default RecipeContent;
