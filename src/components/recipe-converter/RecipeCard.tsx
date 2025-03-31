
import React from 'react';
import { RecipeData } from '@/types/recipeTypes';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, FileText, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StartOverButton from './StartOverButton';

interface RecipeCardProps {
  recipe: RecipeData;
  onEdit: () => void;
  onPrint: () => void;
  onReset: () => void;
  onSave?: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  onEdit, 
  onPrint, 
  onReset,
  onSave
}) => {
  // Check if recipe has valid ingredients and instructions
  const hasValidIngredients = Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0;
  const hasValidInstructions = Array.isArray(recipe.instructions) && recipe.instructions.length > 0;
  
  const ingredientsList = hasValidIngredients ? recipe.ingredients.map((ingredient, index) => (
    <li key={index} className="list-disc ml-4">{ingredient}</li>
  )) : <li className="list-disc ml-4">No ingredients available</li>;
  
  const instructionsList = hasValidInstructions ? recipe.instructions.map((instruction, index) => (
    <li key={index} className="mb-2">{instruction}</li>
  )) : <li className="mb-2">No instructions available</li>;
  
  return (
    <Card className="shadow-md print:shadow-none overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl sm:text-2xl">{recipe.title || 'Untitled Recipe'}</CardTitle>
            {recipe.introduction && (
              <CardDescription className="mt-2">{recipe.introduction}</CardDescription>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={onPrint}>
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Ingredients</h3>
          <ul className="list-none pl-0">{ingredientsList}</ul>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Instructions</h3>
          <ol className="list-decimal pl-6">{instructionsList}</ol>
        </div>
        
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 pb-6 flex flex-wrap gap-3 justify-between">
        <div className="flex flex-wrap gap-2">
          {onSave && (
            <Button variant="secondary" onClick={onSave} className="w-full sm:w-auto">
              <FileText className="mr-2 h-4 w-4" />
              Save Recipe
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <StartOverButton onClick={onReset} />
        </div>
      </CardFooter>
    </Card>
  );
};

export default RecipeCard;
