
import { contentIndexerCore } from '../core/content-indexer-core';
import { mockLogger, getTestContent } from './test-utils';
import { IndexingService } from '../core/indexing-service';
import { SearchService } from '../core/search-service';
import { ContentManager } from '../core/content-manager';

// Mock the dependencies
jest.mock('../core/indexing-service');
jest.mock('../core/search-service');
jest.mock('../core/content-manager');

// Mock the logger
jest.mock('@/utils/logger', () => ({
  logInfo: (...args: any[]) => mockLogger.logInfo(...args),
  logError: (...args: any[]) => mockLogger.logError(...args),
  logWarn: (...args: any[]) => mockLogger.logWarn(...args),
  logDebug: (...args: any[]) => mockLogger.logDebug(...args)
}));

describe('ContentIndexerCore', () => {
  beforeEach(() => {
    // Reset all mock implementations
    jest.clearAllMocks();
    
    // Setup IndexingService mocks
    (IndexingService.prototype.indexRecipes as jest.Mock).mockResolvedValue(undefined);
    (IndexingService.prototype.indexBlogPosts as jest.Mock).mockResolvedValue(undefined);
    
    // Setup SearchService mocks
    (SearchService.prototype.initializeSearchEngine as jest.Mock).mockReturnValue(undefined);
    (SearchService.prototype.search as jest.Mock).mockReturnValue(getTestContent());
    
    // Setup ContentManager mocks
    (ContentManager.prototype.getAllContent as jest.Mock).mockReturnValue(getTestContent());
    (ContentManager.prototype.getContentByType as jest.Mock).mockReturnValue(getTestContent().slice(0, 1));
    (ContentManager.prototype.getContentByTags as jest.Mock).mockReturnValue(getTestContent().slice(1, 2));
    (ContentManager.prototype.addOrUpdateContent as jest.Mock).mockReturnValue(undefined);
    (ContentManager.prototype.removeContent as jest.Mock).mockReturnValue(undefined);
    
    // Reset isInitialized state of contentIndexerCore 
    // This requires accessing a private property, which is not ideal but necessary for testing
    // @ts-ignore: private property access for testing
    contentIndexerCore.isInitialized = false;
  });
  
  test('should initialize content indexer', async () => {
    await contentIndexerCore.initialize();
    
    expect(IndexingService.prototype.indexRecipes).toHaveBeenCalled();
    expect(IndexingService.prototype.indexBlogPosts).toHaveBeenCalled();
    expect(SearchService.prototype.initializeSearchEngine).toHaveBeenCalled();
    expect(mockLogger.logInfo).toHaveBeenCalledWith('Initializing content indexer service');
    expect(mockLogger.logInfo).toHaveBeenCalledWith('Content indexer initialized successfully', expect.any(Object));
  });
  
  test('should not initialize if already initialized', async () => {
    // Initialize once
    await contentIndexerCore.initialize();
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Try to initialize again
    await contentIndexerCore.initialize();
    
    // Should not call the initialization methods again
    expect(IndexingService.prototype.indexRecipes).not.toHaveBeenCalled();
    expect(IndexingService.prototype.indexBlogPosts).not.toHaveBeenCalled();
    expect(SearchService.prototype.initializeSearchEngine).not.toHaveBeenCalled();
  });
  
  test('should search content', async () => {
    // Initialize first
    await contentIndexerCore.initialize();
    
    const results = contentIndexerCore.search('test query');
    
    expect(SearchService.prototype.search).toHaveBeenCalledWith('test query', undefined);
    expect(results).toEqual(getTestContent());
  });
  
  test('should return empty array when searching before initialization', () => {
    const results = contentIndexerCore.search('test query');
    
    expect(SearchService.prototype.search).not.toHaveBeenCalled();
    expect(results).toEqual([]);
    expect(mockLogger.logError).toHaveBeenCalledWith('Content indexer not initialized before search');
  });
  
  test('should add or update content and reinitialize search engine', async () => {
    // Initialize first
    await contentIndexerCore.initialize();
    
    const newContent = getTestContent()[0];
    contentIndexerCore.addOrUpdateContent(newContent);
    
    expect(ContentManager.prototype.addOrUpdateContent).toHaveBeenCalledWith(newContent);
    expect(SearchService.prototype.initializeSearchEngine).toHaveBeenCalled();
  });
  
  test('should remove content and reinitialize search engine', async () => {
    // Initialize first
    await contentIndexerCore.initialize();
    
    contentIndexerCore.removeContent('test-id', 'blog');
    
    expect(ContentManager.prototype.removeContent).toHaveBeenCalledWith('test-id', 'blog');
    expect(SearchService.prototype.initializeSearchEngine).toHaveBeenCalled();
  });
  
  test('should get all content', async () => {
    // Initialize first
    await contentIndexerCore.initialize();
    
    const content = contentIndexerCore.getAllContent();
    
    expect(ContentManager.prototype.getAllContent).toHaveBeenCalled();
    expect(content).toEqual(getTestContent());
  });
  
  test('should get content by type', async () => {
    // Initialize first
    await contentIndexerCore.initialize();
    
    const content = contentIndexerCore.getContentByType('blog');
    
    expect(ContentManager.prototype.getContentByType).toHaveBeenCalledWith('blog');
    expect(content).toEqual(getTestContent().slice(0, 1));
  });
  
  test('should get content by tags', async () => {
    // Initialize first
    await contentIndexerCore.initialize();
    
    const content = contentIndexerCore.getContentByTags(['test']);
    
    expect(ContentManager.prototype.getContentByTags).toHaveBeenCalledWith(['test']);
    expect(content).toEqual(getTestContent().slice(1, 2));
  });
  
  test('should handle initialization errors', async () => {
    // Mock initialization error
    (IndexingService.prototype.indexRecipes as jest.Mock).mockRejectedValue(new Error('Test error'));
    
    await expect(contentIndexerCore.initialize()).rejects.toThrow('Failed to initialize content indexer');
    expect(mockLogger.logError).toHaveBeenCalledWith('Failed to initialize content indexer', expect.any(Object));
  });
});
