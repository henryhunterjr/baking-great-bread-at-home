
import React from 'react';
import { Button } from '@/components/ui/button';
import { RecipeData } from '@/types/recipeTypes';

interface RecipeGeneratorProps {
  onGenerateRecipe: (recipe: RecipeData) => void;
}

const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({ onGenerateRecipe }) => {
  const handleGenerateClick = () => {
    // For now, just generate a simple mock recipe
    const mockRecipe: RecipeData = {
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
    
    onGenerateRecipe(mockRecipe);
  };
  
  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <h3 className="text-lg font-medium mb-4">Recipe Generator</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Generate a custom recipe based on your preferences.
      </p>
      <Button onClick={handleGenerateClick} className="w-full">
        Generate Recipe
      </Button>
    </div>
  );
};

export default RecipeGenerator;
