
import React from 'react';
import { RecipeData } from '@/types/recipeTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Printer, RotateCcw, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    navigate('/');
  };
  
  return (
    <Card className="shadow-md print:shadow-none">
      <CardContent className="pt-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-serif font-medium print:text-3xl">{recipe.title}</h2>
          <div className="flex space-x-2 print:hidden">
            <Button variant="ghost" size="sm" onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={onPrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="ghost" size="sm" onClick={onReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              New
            </Button>
            {onSave && (
              <Button variant="default" size="sm" onClick={onSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            )}
          </div>
        </div>
        
        {recipe.introduction && (
          <div className="prose">
            <p className="text-gray-600">{recipe.introduction}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-medium mb-2 font-serif">Ingredients</h3>
            <ul className="list-disc pl-5 space-y-1">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="text-gray-600">{ingredient}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-2 font-serif">Instructions</h3>
            <ol className="list-decimal pl-5 space-y-2">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="text-gray-600">{instruction}</li>
              ))}
            </ol>
          </div>
        </div>
        
        {recipe.notes && recipe.notes.length > 0 && (
          <div>
            <h3 className="text-xl font-medium mb-2 font-serif">Notes</h3>
            <ul className="list-disc pl-5 space-y-1">
              {recipe.notes.map((note, index) => (
                <li key={index} className="text-gray-600">{note}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
