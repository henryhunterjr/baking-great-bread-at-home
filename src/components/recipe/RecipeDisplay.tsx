
import React from 'react';
import { ImageService } from '@/utils/ImageService';
import { RecipeData } from '@/types/recipeTypes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Clock, Users, Info, FileText, Check } from 'lucide-react';

interface RecipeDisplayProps {
  recipe: RecipeData;
  onEdit?: () => void;
  onSave?: () => void;
  onGenerate?: () => void;
  compact?: boolean;
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({
  recipe,
  onEdit,
  onSave,
  onGenerate,
  compact = false
}) => {
  // Format time display
  const formatTime = (time?: string) => {
    if (!time) return '';
    return time;
  };

  // Generate printer-friendly version
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error('Unable to open print window');
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${recipe.title} Recipe</title>
        <style>
          body {
            font-family: 'Georgia', serif;
            line-height: 1.5;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 { font-size: 24pt; margin-bottom: 8px; }
          h2 {
            font-size: 14pt;
            margin-top: 24px;
            margin-bottom: 12px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 4px;
          }
          .meta { font-size: 10pt; color: #666; margin-bottom: 20px; }
          ul, ol { padding-left: 20px; }
          li { margin-bottom: 8px; }
          .notes { font-style: italic; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <h1>${recipe.title}</h1>
        <div class="meta">
          ${recipe.prepTime ? `Prep Time: ${recipe.prepTime}<br>` : ''}
          ${recipe.cookTime ? `Cook Time: ${recipe.cookTime}<br>` : ''}
          ${recipe.servings ? `Servings: ${recipe.servings}` : ''}
        </div>

        <h2>Ingredients</h2>
        <ul>
          ${recipe.ingredients.map(ingredient => `<li>${
            typeof ingredient === 'string' ? ingredient : 
            `${(ingredient as any).quantity || ''} ${(ingredient as any).unit || ''} ${(ingredient as any).name}`
          }</li>`).join('')}
        </ul>

        <h2>Instructions</h2>
        <ol>
          ${recipe.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
        </ol>

        ${recipe.notes && recipe.notes.length > 0 ? `
          <h2>Notes</h2>
          <ul class="notes">
            ${Array.isArray(recipe.notes) 
              ? recipe.notes.map(note => `<li>${note}</li>`).join('') 
              : `<li>${recipe.notes}</li>`}
          </ul>
        ` : ''}

        <div style="margin-top: 40px; text-align: center; font-size: 9pt; color: #666;">
          Recipe from Baking Great Bread at Home | Printed on ${new Date().toLocaleDateString()}
        </div>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for content to load before printing
    printWindow.onload = function() {
      printWindow.print();
    };
  };
  
  return (
    <div className={`bg-card rounded-lg border border-border shadow-sm ${compact ? 'p-4' : 'p-6'} max-w-4xl mx-auto`}>
      <h1 className={`${compact ? 'text-2xl' : 'text-3xl'} font-serif mb-4`}>{recipe.title}</h1>
      
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
      
      {(recipe.prepTime || recipe.cookTime || recipe.servings) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {recipe.prepTime && (
            <div className="text-center p-2 bg-muted rounded-md flex flex-col items-center justify-center">
              <Clock className="h-5 w-5 mb-1 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Prep Time</p>
              <p className="font-medium">{formatTime(recipe.prepTime)}</p>
            </div>
          )}
          
          {recipe.cookTime && (
            <div className="text-center p-2 bg-muted rounded-md flex flex-col items-center justify-center">
              <Clock className="h-5 w-5 mb-1 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Cook Time</p>
              <p className="font-medium">{formatTime(recipe.cookTime)}</p>
            </div>
          )}
          
          {recipe.servings && (
            <div className="text-center p-2 bg-muted rounded-md flex flex-col items-center justify-center">
              <Users className="h-5 w-5 mb-1 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Servings</p>
              <p className="font-medium">{recipe.servings}</p>
            </div>
          )}
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-xl font-serif mb-3 flex items-center">
          Ingredients
        </h2>
        {recipe.ingredients && recipe.ingredients.length > 0 ? (
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-baseline">
                <Check className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
                <span>
                  {typeof ingredient === 'string' ? ingredient : (
                    <>
                      {/* Handle case where ingredient might be an object with quantity, unit, name */}
                      <span className="font-medium mr-2">
                        {(ingredient as any).quantity} {(ingredient as any).unit}
                      </span>
                      <span>{(ingredient as any).name}</span>
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground italic">No ingredients available</p>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-serif mb-3 flex items-center">
          Instructions
        </h2>
        {recipe.instructions && recipe.instructions.length > 0 ? (
          <ol className="space-y-4 list-decimal list-inside">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="pl-2">
                <span className="ml-2">{instruction}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-muted-foreground italic">No instructions available</p>
        )}
      </div>
      
      {recipe.notes && recipe.notes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-serif mb-3 flex items-center">
            <Info className="h-5 w-5 mr-2" />
            Notes
          </h2>
          <ul className="space-y-2 list-disc list-inside">
            {Array.isArray(recipe.notes) ? (
              recipe.notes.map((note, index) => (
                <li key={index} className="pl-2">{note}</li>
              ))
            ) : (
              <li className="pl-2">{recipe.notes}</li>
            )}
          </ul>
        </div>
      )}
      
      <div className="flex flex-wrap gap-3 justify-end mt-6">
        <Button variant="outline" onClick={handlePrint}>
          <FileText className="h-4 w-4 mr-2" />
          Print
        </Button>
        
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
