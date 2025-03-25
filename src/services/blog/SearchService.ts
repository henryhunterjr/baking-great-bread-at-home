
import { BlogPost } from './types';

class SearchService {
  checkRelatedTerms(post: BlogPost, searchTerm: string): boolean {
    // Map of terms to related terms for bread recipes with expanded challah-related terms
    const relatedTermsMap: Record<string, string[]> = {
      'challah': ['braided', 'jewish', 'bread', 'egg bread', 'sabbath', 'shabbat', 'holiday', 'honey', 'sweet', 'traditional', 'kosher', 'brioche-like'],
      'sourdough': ['starter', 'levain', 'fermented', 'wild yeast'],
      'bagel': ['boiled', 'new york', 'jewish'],
      'brioche': ['french', 'rich', 'buttery', 'egg'],
      'focaccia': ['italian', 'flat', 'olive oil'],
      'rye': ['pumpernickel', 'deli', 'caraway'],
      'ciabatta': ['italian', 'holes', 'rustic'],
    };
    
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
}

export default SearchService;
