
import React from 'react';
import { RecipeData } from '@/types/recipeTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, User } from 'lucide-react';

interface RecipeDisplayProps {
  recipe: RecipeData;
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe }) => {
  return (
    <Card className="bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-serif">{recipe.title}</CardTitle>
        {recipe.introduction && (
          <p className="text-muted-foreground mt-1 text-sm">{recipe.introduction}</p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Recipe image if available */}
        {recipe.imageUrl && (
          <div className="w-full rounded-md overflow-hidden h-48">
            <img 
              src={recipe.imageUrl} 
              alt={recipe.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Servings info */}
        {recipe.servings && (
          <div className="bg-muted/50 rounded-md p-3 w-24 mx-auto text-center">
            <User className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-sm font-medium">Servings</p>
            <p className="text-xl">{recipe.servings}</p>
          </div>
        )}
        
        {/* Ingredients */}
        <div>
          <h3 className="text-lg font-medium mb-2">Ingredients</h3>
          <ul className="space-y-1.5">
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-4 w-4 mr-2 mt-0.5 text-bread-600 flex-shrink-0" />
                  <span className="text-sm">
                    {typeof ingredient === 'string' 
                      ? ingredient 
                      : `${ingredient.quantity || ''} ${ingredient.unit || ''} ${ingredient.name || ''}`}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-sm italic text-muted-foreground">No ingredients provided</li>
            )}
          </ul>
        </div>
        
        {/* Instructions */}
        <div>
          <h3 className="text-lg font-medium mb-2">Instructions</h3>
          <ol className="list-decimal list-inside space-y-2">
            {recipe.instructions && recipe.instructions.length > 0 ? (
              recipe.instructions.map((instruction, index) => (
                <li key={index} className="text-sm pl-1">
                  <span className="ml-2">{instruction}</span>
                </li>
              ))
            ) : (
              <li className="text-sm italic text-muted-foreground">No instructions provided</li>
            )}
          </ol>
        </div>
        
        {/* Notes/Tips */}
        {(recipe.tips && recipe.tips.length > 0) || (recipe.notes && recipe.notes.length > 0) ? (
          <div className="bg-muted/30 p-3 rounded-md">
            <h3 className="text-sm font-medium mb-1">Tips & Notes</h3>
            <ul className="space-y-1">
              {recipe.tips && recipe.tips.map((tip, index) => (
                <li key={`tip-${index}`} className="text-sm text-muted-foreground">• {tip}</li>
              ))}
              
              {recipe.notes && (Array.isArray(recipe.notes) 
                ? recipe.notes.map((note, index) => (
                  <li key={`note-${index}`} className="text-sm text-muted-foreground">• {note}</li>
                ))
                : <li className="text-sm text-muted-foreground">• {recipe.notes}</li>
              )}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default RecipeDisplay;
