
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
      threshold: 0.3,
      keys: [
        { name: 'title', weight: 2 },
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
      logError('Search engine not initialized');
      return [];
    }
    
    try {
      logInfo('Searching content index', { query });
      
      const searchOptions = {
        limit: 10, // Add a default limit to satisfy the type
        threshold: options?.threshold ?? 0.3,
        includeScore: options?.includeScore ?? true,
        includeMatches: options?.includeMatches ?? true,
      };
      
      const results = this.searchEngine.search(query, searchOptions);
      
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
}
