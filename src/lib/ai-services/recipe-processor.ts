
import { Recipe } from '@/types/recipe';

type ProcessSource = File | string;
type ProcessType = 'image' | 'text' | 'url';

/**
 * Process a recipe from an image, text, or URL using AI
 */
export const processRecipeImage = async (
  source: ProcessSource,
  type: ProcessType
): Promise<Recipe> => {
  // In a real implementation, this would call an AI service API
  // For now, we'll just simulate AI processing with a timeout
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simple mock response for the demo
  return {
    title: 'Classic Sourdough Bread',
    description: 'A traditional sourdough bread with a crispy crust and open crumb.',
    servings: 1,
    prepTime: 30,
    ingredients: [
      {
        name: 'bread flour',
        quantity: '500',
        unit: 'g'
      },
      {
        name: 'water',
        quantity: '350',
        unit: 'g'
      },
      {
        name: 'sourdough starter',
        quantity: '100',
        unit: 'g'
      },
      {
        name: 'salt',
        quantity: '10',
        unit: 'g'
      }
    ],
    steps: [
      'Mix flour and water until no dry spots remain. Cover and rest for 30 minutes (autolyse).',
      'Add starter and salt, then perform stretch and folds until dough becomes elastic.',
      'Cover and let rise at room temperature for 3-4 hours, performing stretch and folds every 30 minutes for the first 2 hours.',
      'Shape the dough into a boule or batard and place in a floured banneton.',
      'Refrigerate overnight (8-10 hours) for slow fermentation.',
      'Preheat oven to 500°F (260°C) with Dutch oven inside for 1 hour.',
      'Score dough and bake covered for 20 minutes, then uncovered for 20-25 minutes until deep golden brown.',
      'Cool completely on a wire rack before slicing.'
    ],
    tags: ['sourdough', 'bread', 'artisan'],
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop'
  };
};

/**
 * Save a recipe to local storage
 */
export const saveRecipe = async (recipe: Recipe): Promise<void> => {
  try {
    // Get existing recipes from storage, or initialize empty array
    const existingRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    
    // Add this recipe to the array
    const updatedRecipes = [...existingRecipes, recipe];
    
    // Save back to local storage
    localStorage.setItem('savedRecipes', JSON.stringify(updatedRecipes));
  } catch (error) {
    console.error('Error saving recipe:', error);
    throw new Error('Failed to save recipe');
  }
};

/**
 * Get all saved recipes from local storage
 */
export const getSavedRecipes = (): Recipe[] => {
  try {
    return JSON.parse(localStorage.getItem('savedRecipes') || '[]');
  } catch (error) {
    console.error('Error retrieving saved recipes:', error);
    return [];
  }
};
