
import { RecipeData } from '../types/recipeTypes';

// Helper to determine if a message is a recipe-related question
export function isRecipeQuestion(message: string): boolean {
  const recipeKeywords = [
    'recipe', 'recipes', 'how to make', 'how do I make', 'bake', 'cook',
    'bread', 'cake', 'pastry', 'dessert', 'sourdough', 'pizza', 'biscuit',
    'cookie', 'pie', 'tart', 'loaf', 'dough', 'ingredients', 'method'
  ];
  
  const lowerMessage = message.toLowerCase();
  return recipeKeywords.some(keyword => lowerMessage.includes(keyword));
}

// Simplified blog search implementation
// In a real implementation, this would connect to your blog's API or database
export async function searchBlogForRecipes(query: string): Promise<RecipeData[]> {
  try {
    // For now, this is a mock implementation
    // Replace with actual blog search API call when available
    const response = await fetch('/api/search-blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to search blog');
    }
    
    const data = await response.json();
    return data.recipes;
  } catch (error) {
    console.error('Error searching blog:', error);
    return []; // Return empty array if search fails
  }
}
