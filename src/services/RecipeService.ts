import { RecipeData, Recipe, Ingredient } from '@/types/recipe';
import { v4 as uuidv4 } from 'uuid';

type ProcessSource = File | string;
type ProcessType = 'image' | 'text' | 'url';

/**
 * Convert from the API Recipe type to our RecipeData type
 */
const convertToRecipeData = (recipe: Recipe): RecipeData => {
  return {
    title: recipe.title,
    introduction: recipe.description,
    ingredients: recipe.ingredients.map(ing => 
      `${ing.quantity}${ing.unit ? ' ' + ing.unit : ''} ${ing.name}`
    ),
    prepTime: recipe.prepTime ? `${recipe.prepTime} minutes` : '',
    restTime: '',
    bakeTime: recipe.cookTime ? `${recipe.cookTime} minutes` : '',
    totalTime: recipe.prepTime && recipe.cookTime 
      ? `${recipe.prepTime + recipe.cookTime} minutes` 
      : '',
    instructions: recipe.steps,
    tips: [],
    proTips: [],
    equipmentNeeded: recipe.tags
      .filter(tag => ['oven', 'mixer', 'blender', 'food processor'].includes(tag))
      .map(tag => ({ id: uuidv4(), name: tag.charAt(0).toUpperCase() + tag.slice(1) })),
    imageUrl: recipe.imageUrl || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
    tags: recipe.tags,
    isPublic: recipe.isPublic || false,
    isConverted: true
  };
};

/**
 * Process a recipe from an image, text, or URL using AI
 */
export const processRecipe = async (
  source: ProcessSource,
  type: ProcessType
): Promise<RecipeData> => {
  // In a real implementation, this would call an AI service API
  // For now, we'll just simulate AI processing with a timeout
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simple mock response for the demo
  const mockRecipe: Recipe = {
    title: 'Classic Sourdough Bread',
    description: 'A traditional sourdough bread with a crispy crust and open crumb.',
    servings: 1,
    prepTime: 30,
    cookTime: 45,
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
    tags: ['sourdough', 'bread', 'artisan', 'dutch oven'],
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop'
  };

  // Add some tips and pro tips that weren't in the original recipe-processor
  const recipeData = convertToRecipeData(mockRecipe);
  recipeData.tips = [
    'The dough should increase in volume by about 30-50% during bulk fermentation.',
    'If you don\'t have a Dutch oven, use a baking stone with a metal bowl as a cover.',
    'The bread is done when it sounds hollow when tapped on the bottom.'
  ];
  recipeData.proTips = [
    'For a more open crumb, increase hydration to 75-80% once you\'re comfortable with the process.',
    'Try cold autolyse by mixing flour and water and refrigerating overnight before adding starter.',
    'Use rice flour for dusting your banneton to prevent sticking.'
  ];
  
  // Create proper equipment objects with IDs
  recipeData.equipmentNeeded = [
    { id: uuidv4(), name: 'Dutch Oven', affiliateLink: '/tools/dutch-oven' },
    { id: uuidv4(), name: 'Banneton Basket', affiliateLink: '/tools/banneton' },
    { id: uuidv4(), name: 'Bread Lame', affiliateLink: '/tools/bread-lame' },
    { id: uuidv4(), name: 'Kitchen Scale', affiliateLink: '/tools/kitchen-scale' }
  ];

  return recipeData;
};

/**
 * Process recipe text and convert it to structured recipe data
 */
export const convertRecipeText = async (text: string): Promise<RecipeData> => {
  // For now, we'll use the same mock data but we could extend this
  // to do simple text parsing in the future
  return processRecipe(text, 'text');
};

/**
 * Save a recipe to local storage
 */
export const saveRecipe = async (recipe: RecipeData): Promise<void> => {
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
export const getSavedRecipes = (): RecipeData[] => {
  try {
    return JSON.parse(localStorage.getItem('savedRecipes') || '[]');
  } catch (error) {
    console.error('Error retrieving saved recipes:', error);
    return [];
  }
};
