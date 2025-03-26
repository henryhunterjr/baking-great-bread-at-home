
import { contentIndexer, initializeContentIndexer } from '../content-indexer';
import { IndexedContent } from '../types';
import { mockLogger, generateRandomContent } from './test-utils';

// Mock the logger
jest.mock('@/utils/logger', () => ({
  logInfo: (...args: any[]) => mockLogger.logInfo(...args),
  logError: (...args: any[]) => mockLogger.logError(...args),
  logWarn: (...args: any[]) => mockLogger.logWarn(...args),
  logDebug: (...args: any[]) => mockLogger.logDebug(...args)
}));

// Mock the data sources to control test data
jest.mock('@/data/recipesData', () => ({
  recipesData: [
    {
      id: 'test-recipe-1',
      title: 'Test Recipe 1',
      description: 'Test recipe description',
      imageUrl: '/test-image.jpg',
      date: '2023-01-01',
      tags: ['test', 'recipe']
    }
  ]
}));

jest.mock('@/data/breadRecipes', () => ({
  breadRecipes: [
    {
      id: 'test-bread-1',
      title: 'Test Bread 1',
      description: 'Test bread description',
      imageUrl: '/test-bread.jpg',
      date: '2023-01-02',
      link: '/recipes/test-bread-1'
    }
  ]
}));

describe('Content Indexer Integration', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    
    // Reset contentIndexer state by accessing private property 
    // (only for testing purposes)
    const contentIndexerCore = require('../core/content-indexer-core').contentIndexerCore;
    // @ts-ignore: accessing private property for testing
    contentIndexerCore.isInitialized = false;
  });
  
  test('should initialize, index content, and search correctly', async () => {
    // Initialize the content indexer
    await initializeContentIndexer();
    
    // Verify initialization logs
    expect(mockLogger.logInfo).toHaveBeenCalledWith('Initializing content indexer service');
    expect(mockLogger.logInfo).toHaveBeenCalledWith('Content indexer initialized successfully', expect.any(Object));
    
    // Search for content
    const results = contentIndexer.search('test');
    
    // Verify we got search results
    expect(results.length).toBeGreaterThan(0);
    
    // Verify content management functions
    const allContent = contentIndexer.getAllContent();
    expect(allContent.length).toBeGreaterThan(0);
    
    // Test adding new content
    const newContent: IndexedContent = {
      id: 'new-test-content',
      title: 'New Test Content',
      content: 'This is new test content for integration testing',
      excerpt: 'This is new test content...',
      type: 'blog',
      tags: ['test', 'integration'],
      url: '/test/new-content'
    };
    
    contentIndexer.addOrUpdateContent(newContent);
    
    // Search for the new content
    const newResults = contentIndexer.search('integration');
    expect(newResults.length).toBeGreaterThan(0);
    expect(newResults[0].item.id).toBe('new-test-content');
    
    // Test removing content
    contentIndexer.removeContent('new-test-content', 'blog');
    
    // Search again to verify it's gone
    const finalResults = contentIndexer.search('integration');
    expect(finalResults.length).toBe(0);
  });
  
  test('should handle and filter content by type and tags', async () => {
    await initializeContentIndexer();
    
    // Add some test content of different types
    const recipes = generateRandomContent(3).map(content => ({
      ...content,
      type: 'recipe' as const
    }));
    
    const blogPosts = generateRandomContent(2).map(content => ({
      ...content,
      type: 'blog' as const
    }));
    
    // Add all content
    [...recipes, ...blogPosts].forEach(content => {
      contentIndexer.addOrUpdateContent(content);
    });
    
    // Test filtering by type
    const recipeResults = contentIndexer.getContentByType('recipe');
    expect(recipeResults.length).toBeGreaterThanOrEqual(recipes.length);
    
    const blogResults = contentIndexer.getContentByType('blog');
    expect(blogResults.length).toBeGreaterThanOrEqual(blogPosts.length);
    
    // Test filtering by tags
    const randomTag = recipes[0].tags[0];
    const tagResults = contentIndexer.getContentByTags([randomTag]);
    expect(tagResults.length).toBeGreaterThan(0);
    expect(tagResults.some(item => item.tags.includes(randomTag))).toBe(true);
  });
});
