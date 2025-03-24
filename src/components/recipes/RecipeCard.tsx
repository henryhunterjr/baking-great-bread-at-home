
import React, { useState, memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Recipe } from './types';
import FavoriteButton from './FavoriteButton';
import RecipeImage from './RecipeImage';
import RecipeContent from './RecipeContent';
import ErrorBoundary from '@/components/ErrorBoundary';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    
    toast(isFavorite ? "Recipe removed from favorites" : "Recipe saved to favorites", {
      description: isFavorite ? "You can re-add it anytime." : "Access your saved recipes from your profile.",
      action: {
        label: "View Favorites",
        onClick: () => console.log("View favorites clicked")
      }
    });
  };
  
  return (
    <ErrorBoundary>
      <Card 
        className="overflow-hidden card-hover border-bread-100 h-full flex flex-col relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <FavoriteButton 
          isFavorite={isFavorite}
          isHovered={isHovered}
          onClick={toggleFavorite}
        />
        
        <a 
          href={recipe.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col h-full"
        >
          <RecipeImage 
            id={recipe.id}
            imageUrl={recipe.imageUrl}
            title={recipe.title}
            isHovered={isHovered}
          />
          
          <CardContent className="p-0 flex-grow">
            <RecipeContent recipe={recipe} />
          </CardContent>
        </a>
      </Card>
    </ErrorBoundary>
  );
};

// Memoize the RecipeCard component to prevent unnecessary re-renders
const MemoizedRecipeCard = memo(RecipeCard);

export default MemoizedRecipeCard;

// Need to re-export the Recipe type for backward compatibility
export type { Recipe } from './types';
