
import { logInfo, logError } from '@/utils/logger';
import { IndexedContent, ContentType, SearchResult, ContentIndexOptions } from './types';
import { recipesData } from '@/data/recipesData';
import { breadRecipes } from '@/data/breadRecipes';
import Fuse from 'fuse.js';

/**
 * Content Indexer Service
 * Indexes content from various sources and provides search functionality
 */
class ContentIndexer {
  private static instance: ContentIndexer;
  private contentIndex: IndexedContent[] = [];
  private searchEngine: Fuse<IndexedContent> | null = null;
  private isInitialized = false;
  
  private constructor() {
    // Private constructor for singleton pattern
  }
  
  public static getInstance(): ContentIndexer {
    if (!ContentIndexer.instance) {
      ContentIndexer.instance = new ContentIndexer();
    }
    return ContentIndexer.instance;
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
      await this.indexRecipes();
      
      // Index blog posts 
      await this.indexBlogPosts();
      
      // Initialize the search engine
      this.initializeSearchEngine();
      
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
   * Initialize the search engine with the indexed content
   */
  private initializeSearchEngine(): void {
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
   * Index recipes from our data stores
   */
  private async indexRecipes(): Promise<void> {
    try {
      logInfo('Indexing recipes');
      
      // Combine recipes from multiple sources
      const allRecipes = [...recipesData, ...breadRecipes];
      
      const indexedRecipes = allRecipes.map(recipe => ({
        id: String(recipe.id), // Convert to string to match IndexedContent type
        title: recipe.title,
        content: recipe.description,
        excerpt: recipe.description.substring(0, 150) + '...',
        type: 'recipe' as ContentType,
        tags: recipe.tags || [],
        url: recipe.link || `/recipes/${recipe.id}`,
        imageUrl: recipe.imageUrl,
        metadata: {
          date: recipe.date
        }
      }));
      
      this.contentIndex.push(...indexedRecipes);
      logInfo('Recipes indexed successfully', { count: indexedRecipes.length });
    } catch (error) {
      logError('Error indexing recipes', { error });
    }
  }
  
  /**
   * Index blog posts from our data store or API
   */
  private async indexBlogPosts(): Promise<void> {
    try {
      logInfo('Indexing blog posts');
      
      // In a real implementation, this would fetch blog posts from an API
      // For now, we'll use some sample blog data from our recipes
      const blogPosts = recipesData.map(recipe => ({
        id: `blog-${recipe.id}`,
        title: `How to Make ${recipe.title}`,
        content: `This detailed guide walks you through creating ${recipe.title}. ${recipe.description} This post provides step-by-step instructions and helpful tips for bakers of all levels.`,
        excerpt: `Learn how to make ${recipe.title}. ${recipe.description.substring(0, 100)}...`,
        type: 'blog' as ContentType,
        tags: [...recipe.tags, 'tutorial', 'guide'],
        url: `/blog/${recipe.id}`,
        imageUrl: recipe.imageUrl,
        metadata: {
          date: recipe.date,
          author: 'Henry'
        }
      }));
      
      this.contentIndex.push(...blogPosts);
      logInfo('Blog posts indexed successfully', { count: blogPosts.length });
    } catch (error) {
      logError('Error indexing blog posts', { error });
    }
  }
  
  /**
   * Add or update a content item in the index
   */
  public addOrUpdateContent(content: IndexedContent): void {
    const existingIndex = this.contentIndex.findIndex(item => 
      item.id === content.id && item.type === content.type
    );
    
    if (existingIndex >= 0) {
      this.contentIndex[existingIndex] = content;
    } else {
      this.contentIndex.push(content);
    }
    
    // Reinitialize the search engine with updated content
    this.initializeSearchEngine();
    logInfo('Content index updated', { id: content.id, type: content.type });
  }
  
  /**
   * Remove a content item from the index
   */
  public removeContent(id: string, type: ContentType): void {
    this.contentIndex = this.contentIndex.filter(
      item => !(item.id === id && item.type === type)
    );
    
    // Reinitialize the search engine with updated content
    this.initializeSearchEngine();
    logInfo('Content removed from index', { id, type });
  }
  
  /**
   * Search for content in the index
   */
  public search(query: string, options?: ContentIndexOptions): SearchResult[] {
    if (!this.isInitialized) {
      logError('Content indexer not initialized before search');
      return [];
    }
    
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
            indices: match.indices || [],
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
   * Get all indexed content
   */
  public getAllContent(): IndexedContent[] {
    return [...this.contentIndex];
  }
  
  /**
   * Get content by type
   */
  public getContentByType(type: ContentType): IndexedContent[] {
    return this.contentIndex.filter(item => item.type === type);
  }
  
  /**
   * Get content by tags
   */
  public getContentByTags(tags: string[]): IndexedContent[] {
    return this.contentIndex.filter(item => 
      tags.some(tag => item.tags.includes(tag))
    );
  }
}

// Export the singleton instance
export const contentIndexer = ContentIndexer.getInstance();

// Export a function to initialize the indexer
export const initializeContentIndexer = async (): Promise<void> => {
  await contentIndexer.initialize();
};
