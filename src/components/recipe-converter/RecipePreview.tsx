
import React from 'react';
import { RecipeData } from '@/types/recipeTypes';

interface RecipePreviewProps {
  recipe: RecipeData;
}

const RecipePreview: React.FC<RecipePreviewProps> = ({ recipe }) => {
  return (
    <div className="space-y-6 p-4 border rounded-md bg-card">
      <h2 className="text-2xl font-bold">{recipe.title}</h2>
      
      {recipe.introduction && (
        <div className="text-muted-foreground italic">
          {recipe.introduction}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recipe.prepTime && (
          <div className="text-sm">
            <span className="font-medium">Prep Time:</span> {recipe.prepTime}
          </div>
        )}
        {recipe.cookTime && (
          <div className="text-sm">
            <span className="font-medium">Cook Time:</span> {recipe.cookTime}
          </div>
        )}
        {recipe.totalTime && (
          <div className="text-sm">
            <span className="font-medium">Total Time:</span> {recipe.totalTime}
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
        <ul className="list-disc pl-5 space-y-1">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="text-sm">
              {typeof ingredient === 'string' 
                ? ingredient 
                : `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Instructions</h3>
        <ol className="list-decimal pl-5 space-y-3">
          {recipe.instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ol>
      </div>
      
      {recipe.notes && recipe.notes.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Notes</h3>
          <div className="bg-muted p-3 rounded-md">
            {Array.isArray(recipe.notes)
              ? recipe.notes.map((note, index) => (
                  <p key={index} className="text-sm mb-2">{note}</p>
                ))
              : <p className="text-sm">{recipe.notes}</p>
            }
          </div>
        </div>
      )}
      
      {recipe.tags && recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {recipe.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipePreview;
