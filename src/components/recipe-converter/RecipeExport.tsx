
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { RecipeData } from '@/pages/RecipeConverter';
import { recipeToJsonString, recipeToStandardFormat } from '@/lib/ai-services/recipe-formatter';
import { useToast } from '@/hooks/use-toast';

interface RecipeExportProps {
  recipe: RecipeData;
}

const RecipeExport: React.FC<RecipeExportProps> = ({ recipe }) => {
  const { toast } = useToast();
  
  const handleExportJson = () => {
    // Convert the recipe to the standard format
    const standardRecipe = recipeToStandardFormat(recipe);
    
    // Convert to a formatted JSON string
    const jsonString = JSON.stringify(standardRecipe, null, 2);
    
    // Create a Blob with the JSON content
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create a link element and trigger a download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${recipe.title.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Recipe Exported",
      description: "Your recipe has been exported as a standard JSON file.",
    });
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="flex items-center gap-1"
      onClick={handleExportJson}
    >
      <FileDown className="h-4 w-4" />
      <span>Export JSON</span>
    </Button>
  );
};

export default RecipeExport;
