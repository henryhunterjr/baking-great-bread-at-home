
import { logInfo, logError } from '@/utils/logger';
import { IndexedContent, SearchResult, ContentIndexOptions } from '../types';
import Fuse from 'fuse.js';

/**
 * Search Service
 * Handles search functionality for indexed content
 */
export class SearchService {
  private searchEngine: Fuse<IndexedContent> | null = null;
  
  constructor(private contentIndex: IndexedContent[]) {}
  
  /**
   * Initialize the search engine with the indexed content
   */
  public initializeSearchEngine(): void {
    const options = {
      includeScore: true,
      includeMatches: true,
      threshold: 0.4, // Increased threshold to allow more fuzzy matches
      keys: [
        { name: 'title', weight: 2.5 }, // Increased weight for title
        { name: 'content', weight: 1 },
        { name: 'excerpt', weight: 1.5 },
        { name: 'tags', weight: 1.2 }
      ]
    };
    
    this.searchEngine = new Fuse(this.contentIndex, options);
    logInfo('Search engine initialized', { contentItems: this.contentIndex.length });
  }
  
  /**
   * Search for content in the index
   */
  public search(query: string, options?: ContentIndexOptions): SearchResult[] {
    if (!this.searchEngine) {
      logError('Search engine not initialized', undefined);
      return [];
    }
    
    try {
      logInfo('Searching content index', { query });
      
      // Normalize query for better matching
      const normalizedQuery = this.normalizeSearchQuery(query);
      
      // Convert our ContentIndexOptions to Fuse.js search options
      const searchOptions = {} as any; // Using any temporarily to resolve type issues
      
      if (options?.limit !== undefined) {
        searchOptions.limit = options.limit;
      }
      
      if (options?.includeScore !== undefined) {
        searchOptions.includeScore = options.includeScore;
      }
      
      if (options?.includeMatches !== undefined) {
        searchOptions.includeMatches = options.includeMatches;
      }
      
      // First try direct search with the normalized query
      let results = this.searchEngine.search(normalizedQuery, searchOptions);
      
      // If no results found and query contains specific recipe indicators, try special matching
      if (results.length === 0 && this.isSpecificRecipeQuery(query)) {
        // Try extracting key terms for more targeted matching
        const keyTerms = this.extractKeyTerms(query);
        if (keyTerms) {
          logInfo('Trying more targeted search with key terms', { keyTerms });
          results = this.searchEngine.search(keyTerms, searchOptions);
        }
      }
      
      // Transform Fuse.js results to match our SearchResult type
      return results.map(result => {
        // Properly transform matches to ensure they have the required properties
        const transformedMatches = result.matches ? 
          result.matches.map(match => ({
            key: match.key || '',  // Ensure key is always a string
            indices: match.indices ? 
              // Convert readonly tuples to regular mutable tuples
              match.indices.map(indexPair => [indexPair[0], indexPair[1]] as [number, number]) : 
              [] as [number, number][],
            value: match.value || ''
          })) : [];
          
        return {
          item: result.item,
          score: result.score || 1,
          matches: transformedMatches
        };
      });
    } catch (error) {
      logError('Error searching content index', { error, query });
      return [];
    }
  }
  
  /**
   * Normalize search query for better matching
   */
  private normalizeSearchQuery(query: string): string {
    // Lowercase the query
    let normalized = query.toLowerCase();
    
    // Remove common filler words and phrases
    normalized = normalized.replace(/find me|can you find|are there|do you have|a recipe for|recipes for|on the blog|from the blog|in existing recipe it's|it should be|should be/g, ' ');
    
    // Replace multiple spaces with a single space
    normalized = normalized.replace(/\s+/g, ' ').trim();
    
    logInfo('Normalized search query', { original: query, normalized });
    
    return normalized;
  }
  
  /**
   * Extract key terms from a query for targeted matching
   */
  private extractKeyTerms(query: string): string {
    // Look for recipe names with possessive forms (e.g., "Henry's Foolproof")
    const possessiveMatch = query.match(/(\w+)'s\s+(\w+)/i);
    if (possessiveMatch) {
      return `${possessiveMatch[1]}'s ${possessiveMatch[2]}`;
    }
    
    // Look for specific recipe types (e.g., "sourdough loaf", "dinner rolls")
    const recipeTypeMatch = query.match(/(sourdough|challah|banana|cinnamon|dinner)\s+(\w+)/i);
    if (recipeTypeMatch) {
      return `${recipeTypeMatch[1]} ${recipeTypeMatch[2]}`;
    }
    
    return '';
  }
  
  /**
   * Check if query is likely looking for a specific recipe
   */
  private isSpecificRecipeQuery(query: string): boolean {
    const specificIndicators = [
      "henry's", "henry", "foolproof", "sourdough loaf", 
      "recipe it's", "existing recipe", "should be on the blog"
    ];
    
    // Check if query contains any of the specific indicators
    return specificIndicators.some(indicator => 
      query.toLowerCase().includes(indicator.toLowerCase())
    );
  }
}
