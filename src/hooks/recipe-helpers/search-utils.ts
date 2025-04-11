
import { Recipe } from '@/components/recipes/types';
import { getChallahRecipes } from './challah-recipes';

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
  const bananaBreadRecipes = allPosts.filter(recipe => {
    const fullText = (recipe.title + ' ' + recipe.description).toLowerCase();
    return fullText.includes('banana bread') || 
           fullText.includes('banana loaf') || 
           (fullText.includes('banana') && fullText.includes('bread'));
  });
  
  // If none found specifically, fallback to recipes with just "banana" in them
  if (bananaBreadRecipes.length === 0) {
    return allPosts.filter(recipe => {
      const fullText = (recipe.title + ' ' + recipe.description).toLowerCase();
      return fullText.includes('banana');
    });
  }
  
  return bananaBreadRecipes;
}

/**
 * Perform enhanced search based on query and related terms
 */
export function performEnhancedSearch(query: string, allPosts: Recipe[]): Recipe[] {
  // Special case for challah
  if (query === 'challah') {
    return handleChallahSearch(allPosts);
  }
  
  // Special case for banana bread
  if (query.includes('banana bread') || 
      query.includes('banana loaf') ||
      (query.includes('banana') && query.includes('bread'))) {
    return handleBananaBreadSearch(allPosts);
  }
  
  // Enhanced search for other terms
  return allPosts.filter(recipe => {
    const fullText = (recipe.title + ' ' + recipe.description + ' ' + recipe.link).toLowerCase();
    
    // Direct match
    if (fullText.includes(query)) {
      return true;
    }
    
    // Related terms matching
    for (const [key, relatedTerms] of Object.entries(relatedTermsMap)) {
      if (query.includes(key) || key.includes(query)) {
        // Check if recipe contains any related terms
        return relatedTerms.some(term => fullText.includes(term));
      }
    }
    
    return false;
  });
}
