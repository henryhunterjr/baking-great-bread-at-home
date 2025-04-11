
import { NextApiRequest, NextApiResponse } from 'next';
import { RecipeData } from '../src/types/recipeTypes';

// Mock database of blog recipes
// Replace this with actual database access or API calls to your blog
const blogRecipes: RecipeData[] = [
  {
    id: 'classic-sourdough',
    title: 'Classic Sourdough Bread',
    ingredients: ['flour', 'water', 'salt', 'sourdough starter'],
    instructions: [
      'Mix flour, water, and starter.',
      'Let rest for 30 minutes.',
      'Add salt and mix.',
      'Bulk ferment for 4-5 hours with stretches and folds.',
      'Shape and proof overnight in the refrigerator.',
      'Bake in a Dutch oven at 475°F.'
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    description: 'A traditional sourdough bread with great flavor and texture.',
    keyIngredients: ['bread flour', 'water', 'salt', 'sourdough starter']
  },
  // Add more recipes from your blog here
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    // Simple search logic - can be made more sophisticated
    const searchTerms = query.toLowerCase().split(' ');
    
    const matchedRecipes = blogRecipes.filter(recipe => {
      const recipeText = [
        recipe.title,
        recipe.description,
        ...(recipe.ingredients || []),
        ...(recipe.keyIngredients || [])
      ].join(' ').toLowerCase();
      
      return searchTerms.some(term => recipeText.includes(term));
    });
    
    return res.status(200).json({ recipes: matchedRecipes });
  } catch (error) {
    console.error('Error searching blog:', error);
    return res.status(500).json({ 
      error: 'Failed to search blog',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
