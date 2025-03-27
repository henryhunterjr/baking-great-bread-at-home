
import React from 'react';
import { Button } from "@/components/ui/button";
import { Printer, Edit2, FileJson, Save } from 'lucide-react';
import { RecipeData } from '@/types/recipeTypes';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  
  const handleExportJson = () => {
    try {
      // Create a JSON string from the recipe data
      const jsonData = JSON.stringify(recipe, null, 2);
      
      // Create a Blob from the JSON string
      const blob = new Blob([jsonData], { type: 'application/json' });
      
      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);
      
      // Create a link element and set its attributes
      const link = document.createElement('a');
      link.href = url;
      link.download = `${recipe.title.replace(/\s+/g, '-').toLowerCase()}.json`;
      
      // Append the link to the document, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up by revoking the URL
      URL.revokeObjectURL(url);
      
      toast({
        title: "Recipe Exported",
        description: "Your recipe has been exported as a JSON file.",
      });
    } catch (error) {
      console.error('Error exporting recipe:', error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Failed to export recipe. Please try again.",
      });
    }
  };
  
  return (
    <div className="bg-background rounded-lg overflow-hidden">
      {recipe.imageUrl && (
        <div className="w-full h-64 overflow-hidden">
          <img 
            src={recipe.imageUrl} 
            alt={recipe.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6 pt-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-serif">{recipe.title}</h1>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onEdit}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onPrint}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportJson}
            >
              <FileJson className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
            
            {onSave && (
              <Button 
                variant="default" 
                size="sm" 
                onClick={onSave}
                className="bg-bread-600 hover:bg-bread-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Recipe
              </Button>
            )}
          </div>
        </div>
        
        {/* Introduction */}
        {recipe.introduction && (
          <div className="mb-6">
            <h2 className="text-xl font-serif text-center mb-2">Introduction</h2>
            <p className="text-muted-foreground text-center">{recipe.introduction}</p>
          </div>
        )}
        
        {/* Timing information */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {recipe.prepTime && (
            <div className="flex flex-col items-center">
              <div className="text-muted-foreground mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3 className="font-semibold">Prep Time</h3>
              <p className="text-sm text-muted-foreground">{recipe.prepTime}</p>
            </div>
          )}
          
          {recipe.bakeTime && (
            <div className="flex flex-col items-center">
              <div className="text-muted-foreground mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="5" width="16" height="16" rx="2"></rect>
                  <path d="M16 2v4"></path>
                  <path d="M8 2v4"></path>
                  <path d="M4 10h16"></path>
                </svg>
              </div>
              <h3 className="font-semibold">Bake Time</h3>
              <p className="text-sm text-muted-foreground">{recipe.bakeTime}</p>
            </div>
          )}
          
          {recipe.totalTime && (
            <div className="flex flex-col items-center">
              <div className="text-muted-foreground mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 6v6l4 2"></path>
                </svg>
              </div>
              <h3 className="font-semibold">Total Time</h3>
              <p className="text-sm text-muted-foreground">{recipe.totalTime}</p>
            </div>
          )}
        </div>
        
        {/* Ingredients */}
        <div className="mb-8">
          <h2 className="text-xl font-serif text-center mb-4">Ingredients</h2>
          <ul className="list-disc pl-6 space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="text-muted-foreground">{ingredient}</li>
            ))}
          </ul>
        </div>
        
        {/* Instructions */}
        <div className="mb-8">
          <h2 className="text-xl font-serif text-center mb-4">Instructions</h2>
          <ol className="list-decimal pl-6 space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="text-muted-foreground">{instruction}</li>
            ))}
          </ol>
        </div>
        
        {/* Equipment */}
        {recipe.equipmentNeeded && recipe.equipmentNeeded.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-serif text-center mb-4">Equipment Needed</h2>
            <ul className="list-disc pl-6 space-y-2">
              {recipe.equipmentNeeded.map((item, index) => (
                <li key={index} className="text-muted-foreground">
                  {item.name}
                  {item.affiliateLink && (
                    <a 
                      href={item.affiliateLink} 
                      className="ml-2 text-primary hover:underline"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      (View Recommended)
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Notes and tips */}
        {(recipe.notes?.length > 0 || recipe.tips?.length > 0 || recipe.proTips?.length > 0) && (
          <div className="mb-8">
            <h2 className="text-xl font-serif text-center mb-4">Notes & Tips</h2>
            
            {recipe.notes && recipe.notes.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Notes</h3>
                <ul className="list-disc pl-6 space-y-2">
                  {recipe.notes.map((note, index) => (
                    <li key={index} className="text-muted-foreground">{note}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {recipe.tips && recipe.tips.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Tips</h3>
                <ul className="list-disc pl-6 space-y-2">
                  {recipe.tips.map((tip, index) => (
                    <li key={index} className="text-muted-foreground">{tip}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {recipe.proTips && recipe.proTips.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Pro Tips</h3>
                <ul className="list-disc pl-6 space-y-2">
                  {recipe.proTips.map((proTip, index) => (
                    <li key={index} className="text-muted-foreground">{proTip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
