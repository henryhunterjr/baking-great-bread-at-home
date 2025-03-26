
import { BookRecommendation, ChallengeInfo } from './types';
import { books } from './data';
import { generateRecipeWithOpenAI } from '@/lib/ai-services';

/**
 * Find a relevant book based on a search query
 * @param query The search query
 * @returns A book recommendation or null if no relevant book is found
 */
export const findRelevantBook = (query: string): BookRecommendation | null => {
  const normalizedQuery = query.toLowerCase();
  
  // Find books that match the query based on title or keywords
  const matches = books.filter(book => {
    const titleMatch = book.title.toLowerCase().includes(normalizedQuery);
    const keywordMatch = book.keywords?.some(keyword => 
      normalizedQuery.includes(keyword.toLowerCase())
    );
    
    return titleMatch || keywordMatch;
  });
  
  return matches.length > 0 ? matches[0] : null;
};

/**
 * Get the current baking challenge
 * @returns The current baking challenge
 */
export const getCurrentChallenge = (): ChallengeInfo => {
  // Get the current month and year
  const now = new Date();
  const month = now.toLocaleString('en-US', { month: 'long' }).toLowerCase();
  const year = now.getFullYear();
  
  return {
    id: `${month}-${year}`,
    title: `${month.charAt(0).toUpperCase() + month.slice(1)} Baking Challenge`,
    description: `Join our community in this month's baking challenge focused on ${month} seasonal flavors and techniques.`,
    dueDate: new Date(year, now.getMonth() + 1, 0).toISOString(), // Last day of the current month
    link: `/challenges/${month}-${year}`
  };
};

/**
 * Helper function to search for recipes
 * @param query The search query
 * @returns An array of matching recipes
 */
export const searchRecipes = async (query: string) => {
  const normalizedQuery = query.toLowerCase();
  
  // For now, return a hardcoded list of recipes based on the query
  // In a real app, this would search an API or database
  
  // Special handling for sourdough queries
  if (normalizedQuery.includes('sourdough')) {
    return [
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
      }
    ];
  }
  
  // Default empty results
  return [];
};

/**
 * Process and handle recipe generation
 * @param prompt The recipe generation prompt
 */
export const handleGenerateRecipe = async (prompt: string) => {
  try {
    const response = await generateRecipeWithOpenAI(prompt);
    return response;
  } catch (error) {
    console.error('Error generating recipe:', error);
    return {
      success: false,
      error: 'Failed to generate recipe'
    };
  }
};
