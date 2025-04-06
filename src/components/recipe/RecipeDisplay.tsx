
import React from 'react';
import { ImageService } from '@/utils/ImageService';
import { RecipeData } from '@/types/recipeTypes';
import { Button } from '@/components/ui/button';

interface RecipeDisplayProps {
  recipe: RecipeData;
  onEdit?: () => void;
  onSave?: () => void;
  onGenerate?: () => void;
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({
  recipe,
  onEdit,
  onSave,
  onGenerate
}) => {
  // Format time display
  const formatTime = (time?: string) => {
    if (!time) return '';
    return time;
  };
  
  return (
    <div className="bg-card rounded-lg border border-border shadow-sm p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-serif mb-4">{recipe.title}</h1>
      
      {recipe.imageUrl && (
        <div className="mb-6 rounded-lg overflow-hidden aspect-video">
          <img 
            src={ImageService.getImageUrl(recipe.imageUrl)} 
            alt={recipe.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback for image loading errors
              e.currentTarget.src = '/images/placeholder-recipe.jpg';
            }}
          />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {recipe.prepTime && (
          <div className="text-center p-2 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">Prep Time</p>
            <p className="font-medium">{formatTime(recipe.prepTime)}</p>
          </div>
        )}
        
        {recipe.cookTime && (
          <div className="text-center p-2 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">Cook Time</p>
            <p className="font-medium">{formatTime(recipe.cookTime)}</p>
          </div>
        )}
        
        {recipe.servings && (
          <div className="text-center p-2 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">Servings</p>
            <p className="font-medium">{recipe.servings}</p>
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-serif mb-3">Ingredients</h2>
        {recipe.ingredients.length > 0 ? (
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-baseline">
                {typeof ingredient === 'string' ? (
                  <span>{ingredient}</span>
                ) : (
                  <>
                    {/* Handle case where ingredient might be an object with quantity, unit, name */}
                    <span className="font-medium mr-2">
                      {(ingredient as any).quantity} {(ingredient as any).unit}
                    </span>
                    <span>{(ingredient as any).name}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground italic">No ingredients available</p>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-serif mb-3">Instructions</h2>
        {recipe.instructions.length > 0 ? (
          <ol className="space-y-4 list-decimal list-inside">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="pl-2">
                {instruction}
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-muted-foreground italic">No instructions available</p>
        )}
      </div>
      
      {recipe.notes && recipe.notes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-serif mb-3">Notes</h2>
          <ul className="space-y-2 list-disc list-inside">
            {recipe.notes.map((note, index) => (
              <li key={index} className="pl-2">{note}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="flex flex-wrap gap-3 justify-end mt-6">
        {onEdit && (
          <Button variant="outline" onClick={onEdit}>
            Edit Recipe
          </Button>
        )}
        
        {onGenerate && (
          <Button variant="outline" onClick={onGenerate}>
            Generate Image
          </Button>
        )}
        
        {onSave && (
          <Button onClick={onSave}>
            Save Recipe
          </Button>
        )}
      </div>
    </div>
  );
};

export default RecipeDisplay;
