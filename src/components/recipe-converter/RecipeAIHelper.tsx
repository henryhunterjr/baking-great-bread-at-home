
import React from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';
import { RecipeData } from '@/types/recipeTypes';

interface RecipeAIHelperProps {
  recipe?: RecipeData;
  updateRecipe?: (recipe: RecipeData) => void;
  onApplySuggestion?: (suggestion: string) => void;
}

const RecipeAIHelper: React.FC<RecipeAIHelperProps> = ({ 
  recipe,
  updateRecipe,
  onApplySuggestion 
}) => {
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const generateSuggestions = async () => {
    setIsLoading(true);
    try {
      // This is just a placeholder - in a real implementation, we would make an API call
      // to get AI-powered suggestions
      setSuggestions([
        'Consider adding a touch of cinnamon for extra flavor.',
        'Try using bread flour for better gluten development.',
        'A longer rise time will develop more complex flavors.'
      ]);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // If no recipe is provided, don't render anything
  if (!recipe) return null;

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-amber-500" />
        <h3 className="text-sm font-medium">AI Recipe Helper</h3>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={generateSuggestions} 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Generating...' : 'Get AI Suggestions'}
      </Button>
      
      {suggestions.length > 0 && (
        <ul className="text-sm space-y-2">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="p-2 border rounded-md bg-muted/50">
              <p>{suggestion}</p>
              {(onApplySuggestion || updateRecipe) && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-1" 
                  onClick={() => {
                    if (onApplySuggestion) {
                      onApplySuggestion(suggestion);
                    } else if (updateRecipe && recipe) {
                      // Add the suggestion to recipe notes
                      const updatedRecipe = {
                        ...recipe,
                        notes: [...(recipe.notes || []), suggestion]
                      };
                      updateRecipe(updatedRecipe);
                    }
                  }}
                >
                  Apply
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecipeAIHelper;
