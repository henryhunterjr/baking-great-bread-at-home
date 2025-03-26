
import { BlogPost } from './types';

class SearchService {
  checkRelatedTerms(post: BlogPost, searchTerm: string): boolean {
    // Map of terms to related terms for bread recipes with expanded challah-related terms
    const relatedTermsMap: Record<string, string[]> = {
      'challah': ['braided', 'jewish', 'bread', 'egg bread', 'sabbath', 'shabbat', 'holiday', 'honey', 'sweet', 'traditional', 'kosher', 'brioche-like'],
      'sourdough': ['starter', 'levain', 'fermented', 'wild yeast', 'foolproof', 'henry', 'henry\'s', 'loaf'],
      'bagel': ['boiled', 'new york', 'jewish'],
      'brioche': ['french', 'rich', 'buttery', 'egg'],
      'focaccia': ['italian', 'flat', 'olive oil'],
      'rye': ['pumpernickel', 'deli', 'caraway'],
      'ciabatta': ['italian', 'holes', 'rustic'],
      'cinnamon rolls': ['cinnamon bun', 'sweet roll', 'breakfast roll', 'sticky bun', 'morning bun'],
      'dinner rolls': ['bread rolls', 'soft rolls', 'parker house', 'pull-apart'],
      'banana bread': ['banana loaf', 'fruit bread', 'quick bread'],
      'henry\'s': ['foolproof', 'sourdough', 'loaf', 'henry']
    };
    
    // Special case for Henry's Foolproof Sourdough
    if (searchTerm.toLowerCase().includes('henry') || 
        searchTerm.toLowerCase().includes('foolproof')) {
      return post.title.toLowerCase().includes('henry') || 
             post.title.toLowerCase().includes('foolproof') ||
             post.excerpt.toLowerCase().includes('henry') ||
             post.excerpt.toLowerCase().includes('foolproof');
    }
    
    // Enhanced search for challah specifically
    if (searchTerm === 'challah') {
      // Check title and excerpt more thoroughly for challah-related content
      const fullText = (post.title + ' ' + post.excerpt).toLowerCase();
      return fullText.includes('challah') || 
             fullText.includes('braided') || 
             fullText.includes('jewish bread') ||
             fullText.includes('egg bread') ||
             fullText.includes('holiday bread') ||
             (fullText.includes('bread') && fullText.includes('braided'));
    }
    
    // Enhanced search for cinnamon rolls specifically
    if (searchTerm.includes('cinnamon roll') || searchTerm.includes('cinnamon bun')) {
      const fullText = (post.title + ' ' + post.excerpt).toLowerCase();
      return fullText.includes('cinnamon roll') || 
             fullText.includes('cinnamon bun') || 
             fullText.includes('sweet roll') ||
             (fullText.includes('cinnamon') && fullText.includes('roll')) ||
             (fullText.includes('cinnamon') && fullText.includes('bun'));
    }
    
    // Check if search term is in our related terms map
    for (const [key, relatedTerms] of Object.entries(relatedTermsMap)) {
      if (searchTerm.includes(key) || key.includes(searchTerm)) {
        // Check if the post contains any related terms
        return relatedTerms.some(term => 
          post.title.toLowerCase().includes(term) ||
          post.excerpt.toLowerCase().includes(term) ||
          post.link.toLowerCase().includes(term)
        );
      }
    }
    
    return false;
  }
  
  /**
   * Normalize search query for better matching
   */
  normalizeQuery(query: string): string {
    // Remove filler phrases and clean up the query
    return query.toLowerCase()
      .replace(/find me|can you find|are there|do you have|a recipe for|recipes for|on the blog|from the blog|in existing recipe it's|it should be|should be/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

export default SearchService;
