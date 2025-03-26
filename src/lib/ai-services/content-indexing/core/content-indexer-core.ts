
import { logInfo, logError } from '@/utils/logger';
import { IndexedContent, ContentType, SearchResult, ContentIndexOptions } from '../types';
import { IndexingService } from './indexing-service';
import { SearchService } from './search-service';
import { ContentManager } from './content-manager';

/**
 * Content Indexer Core
 * Main orchestration class that coordinates indexing, searching and content management
 */
class ContentIndexerCore {
  private static instance: ContentIndexerCore;
  private contentIndex: IndexedContent[] = [];
  private indexingService: IndexingService;
  private searchService: SearchService;
  private contentManager: ContentManager;
  private isInitialized = false;
  
  private constructor() {
    this.indexingService = new IndexingService(this.contentIndex);
    this.searchService = new SearchService(this.contentIndex);
    this.contentManager = new ContentManager(this.contentIndex);
  }
  
  public static getInstance(): ContentIndexerCore {
    if (!ContentIndexerCore.instance) {
      ContentIndexerCore.instance = new ContentIndexerCore();
    }
    return ContentIndexerCore.instance;
  }
  
  /**
   * Initialize the content indexer by loading content from various sources
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }
    
    try {
      logInfo('Initializing content indexer service');
      
      // Index recipes from our data stores
      await this.indexingService.indexRecipes();
      
      // Index blog posts 
      await this.indexingService.indexBlogPosts();
      
      // Initialize the search engine
      this.searchService.initializeSearchEngine();
      
      this.isInitialized = true;
      logInfo('Content indexer initialized successfully', { 
        contentCount: this.contentIndex.length 
      });
    } catch (error) {
      logError('Failed to initialize content indexer', { error });
      throw new Error('Failed to initialize content indexer');
    }
  }
  
  /**
   * Search for content in the index
   */
  public search(query: string, options?: ContentIndexOptions): SearchResult[] {
    if (!this.isInitialized) {
      logError('Content indexer not initialized before search');
      return [];
    }
    
    return this.searchService.search(query, options);
  }
  
  /**
   * Add or update a content item in the index
   */
  public addOrUpdateContent(content: IndexedContent): void {
    this.contentManager.addOrUpdateContent(content);
    this.searchService.initializeSearchEngine();
  }
  
  /**
   * Remove a content item from the index
   */
  public removeContent(id: string, type: ContentType): void {
    this.contentManager.removeContent(id, type);
    this.searchService.initializeSearchEngine();
  }
  
  /**
   * Get all indexed content
   */
  public getAllContent(): IndexedContent[] {
    return this.contentManager.getAllContent();
  }
  
  /**
   * Get content by type
   */
  public getContentByType(type: ContentType): IndexedContent[] {
    return this.contentManager.getContentByType(type);
  }
  
  /**
   * Get content by tags
   */
  public getContentByTags(tags: string[]): IndexedContent[] {
    return this.contentManager.getContentByTags(tags);
  }
}

// Export the singleton instance
export const contentIndexerCore = ContentIndexerCore.getInstance();
