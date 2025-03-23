
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  link: string;
}

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
    <Card 
      className="overflow-hidden card-hover border-bread-100 h-full flex flex-col relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-3 right-3 z-10">
        <button 
          onClick={toggleFavorite}
          className={`p-2 rounded-full transition-all duration-300 ${
            isHovered || isFavorite 
              ? 'bg-white/80 shadow-md scale-110' 
              : 'bg-white/30'
          }`}
        >
          <Heart 
            className={`h-5 w-5 transition-all ${
              isFavorite 
                ? 'fill-bread-800 text-bread-800' 
                : 'text-bread-800/70 group-hover:text-bread-800'
            }`} 
          />
        </button>
      </div>
      
      <a 
        href={recipe.link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex flex-col h-full"
      >
        <div className="aspect-video overflow-hidden">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              // Fallback image if the original fails to load
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop";
            }}
          />
        </div>
        <CardContent className="p-6 flex-grow flex flex-col">
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
        </CardContent>
      </a>
    </Card>
  );
};

export default RecipeCard;
