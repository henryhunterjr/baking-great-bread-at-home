
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { RecipeData } from '@/types/recipeTypes';
import { logInfo } from '@/utils/logger';

interface RecipeGeneratorProps {
  onGenerateRecipe: (recipe: RecipeData) => void;
}

const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({ onGenerateRecipe }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipeType, setRecipeType] = useState<string>('sourdough');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  
  const handleGenerateClick = async () => {
    setIsGenerating(true);
    logInfo('Generating recipe', { type: recipeType, hasCustomPrompt: !!customPrompt });
    
    try {
      // In a real implementation, this would call an AI service
      // For now, we'll use mock data
      setTimeout(() => {
        const mockRecipe: RecipeData = generateMockRecipe(recipeType, customPrompt);
        onGenerateRecipe(mockRecipe);
        setIsGenerating(false);
      }, 2000);
    } catch (error) {
      console.error('Error generating recipe:', error);
      setIsGenerating(false);
    }
  };
  
  return (
    <Card className="border rounded-lg p-6 bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <h3 className="text-lg font-medium mb-4">Recipe Generator</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Generate a custom recipe based on your preferences.
      </p>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="recipe-type">Recipe Type</Label>
          <Select 
            value={recipeType} 
            onValueChange={setRecipeType}
          >
            <SelectTrigger id="recipe-type" className="w-full">
              <SelectValue placeholder="Select recipe type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sourdough">Sourdough Bread</SelectItem>
              <SelectItem value="pizza">Pizza Dough</SelectItem>
              <SelectItem value="focaccia">Focaccia</SelectItem>
              <SelectItem value="baguette">Baguette</SelectItem>
              <SelectItem value="ciabatta">Ciabatta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="custom-prompt">Custom Requirements (Optional)</Label>
          <Textarea 
            id="custom-prompt"
            placeholder="Add any specific requirements (e.g., 'gluten-free', 'no nuts', etc.)"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        
        <Button 
          onClick={handleGenerateClick} 
          className="w-full"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Recipe...
            </>
          ) : (
            'Generate Recipe'
          )}
        </Button>
      </div>
    </Card>
  );
};

// Helper function to generate mock recipes
const generateMockRecipe = (type: string, customPrompt: string): RecipeData => {
  const baseRecipe: RecipeData = {
    id: 'mock-' + Date.now(),
    title: 'Simple Sourdough Bread',
    introduction: 'A beginner-friendly sourdough recipe that produces a crusty, flavorful loaf.',
    prepTime: '30 minutes',
    restTime: '12-14 hours',
    bakeTime: '45 minutes',
    totalTime: '14 hours',
    servings: '1 loaf',
    difficulty: 'Medium',
    ingredients: [
      '500g bread flour',
      '350g water',
      '100g active sourdough starter',
      '10g salt'
    ],
    instructions: [
      'Mix flour and water, let rest for 30 minutes.',
      'Add starter and salt, then mix thoroughly.',
      'Perform stretch and folds every 30 minutes for 2-3 hours.',
      'Shape the dough and place in a banneton.',
      'Refrigerate overnight for 8-12 hours.',
      'Preheat oven to 500°F with a Dutch oven inside.',
      'Score the dough and bake covered for 25 minutes.',
      'Remove lid and bake for an additional 20 minutes until golden brown.'
    ],
    tips: [
      'Use a kitchen scale for precise measurements.',
      'The dough should increase in volume by about 50% before refrigerating.'
    ],
    equipmentNeeded: [
      { id: '1', name: 'Dutch Oven' },
      { id: '2', name: 'Banneton Basket' },
      { id: '3', name: 'Scoring Blade' }
    ],
    isConverted: true
  };
  
  // Customize based on type
  switch (type) {
    case 'pizza':
      baseRecipe.title = 'Artisan Pizza Dough';
      baseRecipe.introduction = 'A versatile pizza dough that creates the perfect balance of crispy and chewy.';
      baseRecipe.prepTime = '20 minutes';
      baseRecipe.restTime = '4-24 hours';
      baseRecipe.bakeTime = '10-12 minutes';
      break;
    case 'focaccia':
      baseRecipe.title = 'Rosemary Focaccia';
      baseRecipe.introduction = 'A fragrant, olive oil-rich Italian flatbread with a crisp exterior and soft interior.';
      baseRecipe.ingredients.push('4 tbsp olive oil', '2 sprigs fresh rosemary', 'Flaky sea salt');
      break;
    case 'baguette':
      baseRecipe.title = 'Classic French Baguette';
      baseRecipe.introduction = 'Traditional French baguettes with a crisp crust and airy crumb.';
      baseRecipe.difficulty = 'Hard';
      break;
    case 'ciabatta':
      baseRecipe.title = 'Italian Ciabatta Bread';
      baseRecipe.introduction = 'Rustic Italian bread with a thin crust and airy interior, perfect for sandwiches.';
      break;
  }
  
  // Add custom prompt influence
  if (customPrompt.toLowerCase().includes('gluten-free')) {
    baseRecipe.title = `Gluten-Free ${baseRecipe.title}`;
    baseRecipe.introduction = `${baseRecipe.introduction} Made with gluten-free flour blend.`;
    baseRecipe.ingredients[0] = '500g gluten-free flour blend';
    baseRecipe.ingredients.push('1 tbsp xanthan gum (if not included in flour blend)');
  }
  
  if (customPrompt.toLowerCase().includes('whole wheat') || customPrompt.toLowerCase().includes('wholemeal')) {
    baseRecipe.title = `Whole Wheat ${baseRecipe.title}`;
    baseRecipe.introduction = `${baseRecipe.introduction} Made with nutritious whole wheat flour.`;
    baseRecipe.ingredients[0] = '400g whole wheat flour + 100g bread flour';
  }
  
  return baseRecipe;
};

export default RecipeGenerator;
