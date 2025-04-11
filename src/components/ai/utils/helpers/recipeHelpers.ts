
import { RecipeSearchResult } from '../types';
import { generateRecipeWithOpenAI } from '@/lib/ai-services';

/**
 * Helper function to search for recipes
 * @param query The search query
 * @returns An array of matching recipes
 */
export const searchRecipes = async (query: string): Promise<RecipeSearchResult[]> => {
  console.log(`[searchRecipes] Raw query: "${query}"`);
  
  // Clean up the query to improve matching
  const normalizedQuery = query.toLowerCase()
    .replace(/find me/i, '')
    .replace(/can you find/i, '')
    .replace(/are there/i, '')
    .replace(/do you have/i, '')
    .replace(/a recipe for/i, '')
    .replace(/recipes for/i, '')
    .replace(/from the blog/i, '')
    .replace(/on the blog/i, '')
    .replace(/search the blog for/i, '')
    .replace(/can you search for/i, '')
    .replace(/please/i, '')
    .trim();
  
  console.log(`[searchRecipes] Normalized query: "${normalizedQuery}"`);
  
  // Hardcoded recipes database for common recipe types
  const recipesDatabase: Record<string, RecipeSearchResult[]> = {
    'banana': [
      {
        title: 'Classic Banana Bread',
        description: 'A moist and flavorful banana bread that\'s perfect for using up overripe bananas.',
        imageUrl: 'https://images.unsplash.com/photo-1594086385051-a72d28c7b99a?q=80&w=1000&auto=format&fit=crop',
        link: '/recipes/classic-banana-bread'
      },
      {
        title: 'Banana Muffins with Streusel Topping',
        description: 'Delicious banana muffins topped with a crunchy streusel. Perfect for breakfast or dessert.',
        imageUrl: 'https://images.unsplash.com/photo-1588373756058-3d8b757a72e1?q=80&w=1000&auto=format&fit=crop',
        link: '/recipes/banana-muffins'
      },
      {
        title: 'Whole Wheat Banana Bread',
        description: 'A healthier take on the classic, using whole wheat flour and less sugar while maintaining that delicious banana flavor.',
        imageUrl: 'https://images.unsplash.com/photo-1585023657880-8d726c65ba4e?q=80&w=1000&auto=format&fit=crop',
        link: '/recipes/whole-wheat-banana-bread'
      },
      {
        title: 'Chocolate Chip Banana Bread',
        description: 'The perfect combination of ripe bananas and chocolate chips in a moist, delicious loaf.',
        imageUrl: '/lovable-uploads/b924f7a9-e665-495b-b90f-d8d5166775f8.png',
        link: '/recipes/chocolate-chip-banana-bread'
      }
    ],
    'sourdough': [
      {
        title: 'Basic Sourdough Bread',
        description: 'A simple and reliable sourdough recipe for beginners.',
        imageUrl: 'https://images.unsplash.com/photo-1585478259715-94acd1a91687?q=80&w=1000&auto=format&fit=crop',
        link: '/recipes/sourdough-basic'
      },
      {
        title: 'Rustic Sourdough Boule',
        description: 'A rustic round loaf with a crisp crust and open crumb.',
        imageUrl: 'https://images.unsplash.com/photo-1559548331-f9cb98280344?q=80&w=1000&auto=format&fit=crop',
        link: '/recipes/sourdough-boule'
      },
      {
        title: 'Henry\'s Foolproof Sourdough Loaf',
        description: 'A reliable and easy sourdough recipe that produces consistent results every time, ideal for both beginners and experienced bakers.',
        imageUrl: '/lovable-uploads/a815213f-9e06-4587-b2a7-a12b1317b262.png',
        link: '/recipes/henry-foolproof-sourdough'
      }
    ],
    'henry': [
      {
        title: 'Henry\'s Foolproof Sourdough Loaf',
        description: 'A reliable and easy sourdough recipe that produces consistent results every time, ideal for both beginners and experienced bakers.',
        imageUrl: '/lovable-uploads/a815213f-9e06-4587-b2a7-a12b1317b262.png',
        link: '/recipes/henry-foolproof-sourdough'
      }
    ],
    'foolproof': [
      {
        title: 'Henry\'s Foolproof Sourdough Loaf',
        description: 'A reliable and easy sourdough recipe that produces consistent results every time, ideal for both beginners and experienced bakers.',
        imageUrl: '/lovable-uploads/a815213f-9e06-4587-b2a7-a12b1317b262.png',
        link: '/recipes/henry-foolproof-sourdough'
      }
    ],
    'challah': [
      {
        title: 'Traditional Challah Bread',
        description: 'A beautiful braided Jewish bread that\'s slightly sweet and perfect for special occasions.',
        imageUrl: 'https://images.unsplash.com/photo-1603818652201-1c5a3fb9aa7c?q=80&w=1000&auto=format&fit=crop',
        link: '/recipes/traditional-challah'
      },
      {
        title: 'Sourdough Discard Challah',
        description: 'A braided bread with a beautifully open crumb and deep flavor, using sourdough discard.',
        imageUrl: '/lovable-uploads/564dc984-af39-40cd-9f11-d081182aaf5a.png',
        link: '/recipes/sourdough-discard-challah'
      }
    ],
    'cinnamon': [
      {
        title: 'Cardamom-Infused Cinnamon Rolls',
        description: 'Indulgent cinnamon rolls with a unique cardamom twist.',
        imageUrl: '/lovable-uploads/379f3564-8f61-454c-9abe-3c7394d3794d.png',
        link: '/recipes/cardamom-cinnamon-rolls'
      },
      {
        title: 'Cardamom-Infused Cinnamon Knots',
        description: 'Soft and subtly spiced, these cinnamon knots have a delightful cardamom flavor.',
        imageUrl: 'https://images.unsplash.com/photo-1568254183919-f9b136cc5710?q=80&w=1000&auto=format&fit=crop',
        link: '/recipes/cardamom-cinnamon-knots'
      }
    ],
    'dinner roll': [
      {
        title: 'The Ultimate Dinner Rolls',
        description: 'Soft, fluffy dinner rolls that will elevate any meal.',
        imageUrl: '/lovable-uploads/9a3c90f1-3424-45f9-b98b-35b547650d50.png',
        link: '/recipes/ultimate-dinner-rolls'
      }
    ]
  };
  
  // Add banana bread as its own category for more direct matches
  recipesDatabase['banana bread'] = recipesDatabase['banana'];
  
  // Special check for Henry's Foolproof Sourdough
  if (normalizedQuery.includes('henry') || 
      normalizedQuery.includes('foolproof') || 
      (normalizedQuery.includes('sourdough') && normalizedQuery.includes('loaf'))) {
    console.log(`[searchRecipes] Found special match for Henry's Foolproof Sourdough`);
    return recipesDatabase['henry'];
  }
  
  // Check direct matches first
  for (const [key, recipes] of Object.entries(recipesDatabase)) {
    if (normalizedQuery.includes(key)) {
      console.log(`[searchRecipes] Found direct match for key: "${key}"`);
      return recipes;
    }
  }
  
  // Check for partial matches using each word
  const queryWords = normalizedQuery.split(' ');
  for (const word of queryWords) {
    if (word.length < 3) continue; // Skip very short words
    
    for (const [key, recipes] of Object.entries(recipesDatabase)) {
      if (key.includes(word) || word.includes(key)) {
        console.log(`[searchRecipes] Found partial match: word="${word}", key="${key}"`);
        return recipes;
      }
    }
  }
  
  console.log(`[searchRecipes] No matches found for query: "${normalizedQuery}"`);
  // Default empty results if no match found
  return [];
};
