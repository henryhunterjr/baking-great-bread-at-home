import { Recipe } from '@/components/recipes/types';
import { getChallahRecipes } from './challah-recipes';
import { getBananaRecipes } from './banana-recipes';

/**
 * Maps of related terms to improve search functionality
 */
export const relatedTermsMap: Record<string, string[]> = {
  'challah': ['braided', 'jewish', 'bread', 'egg bread', 'sabbath', 'shabbat', 'holiday', 'honey'],
  'sourdough': ['starter', 'levain', 'fermented', 'wild yeast'],
  'bagel': ['boiled', 'new york', 'jewish'],
  'brioche': ['french', 'rich', 'buttery', 'egg'],
  'focaccia': ['italian', 'flat', 'olive oil'],
  'rye': ['pumpernickel', 'deli', 'caraway'],
  'ciabatta': ['italian', 'holes', 'rustic'],
  'banana bread': ['banana', 'quick bread', 'banana loaf', 'fruit bread'],
  'sourdough': ['artisan', 'starter', 'levain', 'boule', 'fermented', 'tangy'],
  'dinner roll': ['soft roll', 'pull-apart', 'dinner rolls', 'fluffy', 'yeast roll'],
  'cinnamon roll': ['cinnamon bun', 'sweet roll', 'sticky bun', 'morning roll', 'cardamom'],
};

/**
 * Handle special search for challah bread recipes
 */
export function handleChallahSearch(allPosts: Recipe[]): Recipe[] {
  // Get challah-specific recipes
  const challahRecipes = getChallahRecipes();
  
  // Combine with any matching recipes from allPosts
  const allMatchingRecipes = [...challahRecipes];
  
  // Add any other challah recipes from the main collection that aren't duplicates
  allPosts.forEach(recipe => {
    const fullText = (recipe.title + ' ' + recipe.description).toLowerCase();
    if (
      (fullText.includes('challah') || 
        fullText.includes('braided bread') || 
        fullText.includes('jewish bread') ||
        (fullText.includes('bread') && fullText.includes('braided'))) &&
      !allMatchingRecipes.some(r => r.id === recipe.id)
    ) {
      allMatchingRecipes.push(recipe);
    }
  });
  
  return allMatchingRecipes;
}

/**
 * Handle special search for banana bread recipes
 */
export function handleBananaBreadSearch(allPosts: Recipe[]): Recipe[] {
  // Get dedicated banana bread recipes
  const bananaRecipes = getBananaRecipes();
  
  // Combine with any matching recipes from allPosts
  const allMatchingRecipes = [...bananaRecipes];
  
  // Add any other banana bread recipes from the main collection that aren't duplicates
  allPosts.forEach(recipe => {
    const fullText = (recipe.title + ' ' + recipe.description).toLowerCase();
    if (
      (fullText.includes('banana bread') || 
        fullText.includes('banana loaf') || 
        (fullText.includes('banana') && fullText.includes('bread'))) &&
      !allMatchingRecipes.some(r => r.id === recipe.id)
    ) {
      allMatchingRecipes.push(recipe);
    }
  });
  
  return allMatchingRecipes;
}

/**
 * Normalize search query for better matching
 */
export function normalizeSearchQuery(query: string): string {
  // Clean up the query to improve matching
  return query.toLowerCase()
    .replace(/do you have a recipe for/i, '')
    .replace(/do you have/i, '')
    .replace(/find me/i, '')
    .replace(/can you find/i, '')
    .replace(/are there/i, '')
    .replace(/recipes for/i, '')
    .replace(/from the blog/i, '')
    .replace(/on the blog/i, '')
    .replace(/can you search for/i, '')
    .replace(/please/i, '')
    .trim();
}

/**
 * Perform enhanced search based on query and related terms
 */
export function performEnhancedSearch(query: string, allPosts: Recipe[]): Recipe[] {
  // Normalize the query first
  const normalizedQuery = normalizeSearchQuery(query);
  
  // Special case for challah
  if (normalizedQuery.includes('challah')) {
    return handleChallahSearch(allPosts);
  }
  
  // Special case for banana bread
  if (normalizedQuery.includes('banana bread') || 
      normalizedQuery.includes('banana loaf') ||
      (normalizedQuery.includes('banana') && normalizedQuery.includes('bread'))) {
    return handleBananaBreadSearch(allPosts);
  }
  
  // Enhanced search for other terms
  const matchingRecipes = allPosts.filter(recipe => {
    const fullText = (recipe.title + ' ' + recipe.description + ' ' + (recipe.link || '')).toLowerCase();
    
    // Direct match with normalized query
    if (fullText.includes(normalizedQuery)) {
      return true;
    }
    
    // Split query into keywords for better matching
    const queryWords = normalizedQuery.split(' ').filter(word => word.length > 2);
    if (queryWords.some(word => fullText.includes(word))) {
      return true;
    }
    
    // Related terms matching
    for (const [key, relatedTerms] of Object.entries(relatedTermsMap)) {
      if (normalizedQuery.includes(key) || key.includes(normalizedQuery)) {
        // Check if recipe contains any related terms
        if (relatedTerms.some(term => fullText.includes(term))) {
          return true;
        }
      }
    }
    
    return false;
  });
  
  // If no results, try a more lenient search with partial word matching
  if (matchingRecipes.length === 0) {
    return allPosts.filter(recipe => {
      const fullText = (recipe.title + ' ' + recipe.description).toLowerCase();
      const queryWords = normalizedQuery.split(' ').filter(word => word.length > 2);
      
      // Look for partial matches (e.g., "sour" would match "sourdough")
      return queryWords.some(word => 
        Array.from(Object.keys(relatedTermsMap)).some(key => 
          key.includes(word) || relatedTermsMap[key].some(term => term.includes(word))
        ) && fullText.length > 0
      );
    });
  }
  
  return matchingRecipes;
}
