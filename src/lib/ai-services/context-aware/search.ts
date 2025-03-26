
import { ContentItem, ContentIndexOptions, SearchResult } from './types';

/**
 * Handles content searching and relevance calculations
 */
export class ContentSearchEngine {
  private contentIndex: ContentItem[];
  
  constructor(contentIndex: ContentItem[]) {
    this.contentIndex = contentIndex;
  }
  
  /**
   * Search the content index for relevant context
   */
  public async searchContent(query: string, options?: ContentIndexOptions): Promise<SearchResult> {
    const defaultOptions: ContentIndexOptions = {
      limit: 3
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    // For now, we'll use a simple search algorithm
    let results = this.contentIndex
      .filter(item => {
        // If sources are specified, filter by source type
        if (mergedOptions.sources && mergedOptions.sources.length > 0) {
          if (!mergedOptions.sources.includes(item.type)) {
            return false;
          }
        }
        
        // If tags are specified, filter by tags
        if (mergedOptions.tags && mergedOptions.tags.length > 0) {
          if (!item.tags || !item.tags.some(tag => mergedOptions.tags!.includes(tag))) {
            return false;
          }
        }
        
        // Search in title and content
        const normalizedQuery = query.toLowerCase();
        const normalizedTitle = item.title.toLowerCase();
        const normalizedContent = item.content.toLowerCase();
        
        return normalizedTitle.includes(normalizedQuery) || 
               normalizedContent.includes(normalizedQuery);
      })
      .slice(0, mergedOptions.limit);
      
    // If no results, try a more lenient search
    if (results.length === 0) {
      const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 3);
      
      results = this.contentIndex
        .filter(item => {
          const normalizedTitle = item.title.toLowerCase();
          const normalizedContent = item.content.toLowerCase();
          
          // Check if any of the significant words are in the content
          return queryWords.some(word => 
            normalizedTitle.includes(word) || normalizedContent.includes(word)
          );
        })
        .slice(0, mergedOptions.limit);
    }
    
    return {
      items: results,
      total: results.length
    };
  }
  
  /**
   * Get a short excerpt from content
   */
  public getExcerpt(content: string, maxLength: number): string {
    if (content.length <= maxLength) return content;
    
    const excerpt = content.substring(0, maxLength);
    return excerpt + '...';
  }
  
  /**
   * Format sources for citation
   */
  public formatSourcesForCitation(contentItems: ContentItem[]): Array<{
    title: string;
    excerpt: string;
    url: string;
    type: string;
  }> {
    return contentItems.map(item => ({
      title: item.title,
      excerpt: this.getExcerpt(item.content, 120),
      url: item.url,
      type: item.type
    }));
  }
}
