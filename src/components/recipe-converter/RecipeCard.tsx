
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Printer, Clock, Users } from 'lucide-react';
import { RecipeData } from '@/pages/RecipeConverter';
import RecipeExport from './RecipeExport';

interface RecipeCardProps {
  recipe: RecipeData;
  onEdit: () => void;
  onPrint: () => void;
  onReset: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  onEdit, 
  onPrint, 
  onReset 
}) => {
  return (
    <Card className="shadow-md overflow-hidden">
      <div className="relative h-48 overflow-hidden bg-bread-100">
        <img 
          src={recipe.imageUrl || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop'} 
          alt={recipe.title} 
          className="w-full h-full object-cover" 
        />
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-serif font-medium">{recipe.title}</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button variant="outline" size="sm" onClick={onPrint}>
              <Printer className="h-4 w-4 mr-1" /> Print
            </Button>
            <RecipeExport recipe={recipe} />
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-medium">Introduction</h3>
            <p className="text-sm text-muted-foreground">{recipe.introduction}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
            {recipe.prepTime && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-bread-600" />
                <div>
                  <h3 className="text-md font-medium">Prep Time</h3>
                  <p className="text-sm text-muted-foreground">{recipe.prepTime}</p>
                </div>
              </div>
            )}
            
            {recipe.restTime && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-bread-600" />
                <div>
                  <h3 className="text-md font-medium">Rest/Proof Time</h3>
                  <p className="text-sm text-muted-foreground">{recipe.restTime}</p>
                </div>
              </div>
            )}
            
            {recipe.bakeTime && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-bread-600" />
                <div>
                  <h3 className="text-md font-medium">Bake Time</h3>
                  <p className="text-sm text-muted-foreground">{recipe.bakeTime}</p>
                </div>
              </div>
            )}
            
            {recipe.totalTime && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-bread-600" />
                <div>
                  <h3 className="text-md font-medium">Total Time</h3>
                  <p className="text-sm text-muted-foreground">{recipe.totalTime}</p>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-xl font-medium">Ingredients</h3>
            <ul className="list-disc pl-5 text-sm">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
          
          {recipe.equipmentNeeded.length > 0 && (
            <div>
              <h3 className="text-xl font-medium">Equipment</h3>
              <ul className="list-disc pl-5 text-sm">
                {recipe.equipmentNeeded.map((equipment, index) => (
                  <li key={equipment.id || index}>{equipment.name}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div>
            <h3 className="text-xl font-medium">Instructions</h3>
            <ol className="list-decimal pl-5 text-sm">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="mb-2">{instruction}</li>
              ))}
            </ol>
          </div>
          
          {recipe.tips.length > 0 && (
            <div>
              <h3 className="text-xl font-medium">Tips</h3>
              <ul className="list-disc pl-5 text-sm">
                {recipe.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
          
          {recipe.tags.length > 0 && (
            <div>
              <h3 className="text-xl font-medium">Tags</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {recipe.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="text-xs bg-bread-100 text-bread-800 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
