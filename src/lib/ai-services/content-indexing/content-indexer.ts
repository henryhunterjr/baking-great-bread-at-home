
import { contentIndexerCore } from './core/content-indexer-core';
import { IndexedContent, ContentType, SearchResult, ContentIndexOptions } from './types';

/**
 * Content Indexer 
 * Public facade for the content indexing system that maintains the original API
 * but delegates to the more specialized internal modules
 */
class ContentIndexer {
  /**
   * Initialize the content indexer by loading content from various sources
   */
  public async initialize(): Promise<void> {
    return contentIndexerCore.initialize();
  }
  
  /**
   * Search for content in the index
   */
  public search(query: string, options?: ContentIndexOptions): SearchResult[] {
    return contentIndexerCore.search(query, options);
  }
  
  /**
   * Add or update a content item in the index
   */
  public addOrUpdateContent(content: IndexedContent): void {
    contentIndexerCore.addOrUpdateContent(content);
  }
  
  /**
   * Remove a content item from the index
   */
  public removeContent(id: string, type: ContentType): void {
    contentIndexerCore.removeContent(id, type);
  }
  
  /**
   * Get all indexed content
   */
  public getAllContent(): IndexedContent[] {
    return contentIndexerCore.getAllContent();
  }
  
  /**
   * Get content by type
   */
  public getContentByType(type: ContentType): IndexedContent[] {
    return contentIndexerCore.getContentByType(type);
  }
  
  /**
   * Get content by tags
   */
  public getContentByTags(tags: string[]): IndexedContent[] {
    return contentIndexerCore.getContentByTags(tags);
  }
}

// Export the singleton instance
export const contentIndexer = new ContentIndexer();

// Export a function to initialize the indexer
export const initializeContentIndexer = async (): Promise<void> => {
  await contentIndexer.initialize();
};
