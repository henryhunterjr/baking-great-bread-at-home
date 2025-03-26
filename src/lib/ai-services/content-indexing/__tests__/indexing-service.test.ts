
import { IndexingService } from '../core/indexing-service';
import { getTestContent, mockLogger } from './test-utils';

// Mock the data sources
jest.mock('@/data/recipesData', () => ({
  recipesData: [
    {
      id: 'mock-recipe-1',
      title: 'Mock Recipe 1',
      description: 'This is mock recipe 1',
      imageUrl: '/mock-image-1.jpg',
      date: '2023-01-01',
      tags: ['mock', 'recipe']
    },
    {
      id: 'mock-recipe-2',
      title: 'Mock Recipe 2',
      description: 'This is mock recipe 2',
      imageUrl: '/mock-image-2.jpg',
      date: '2023-01-02',
      tags: ['mock', 'recipe']
    }
  ]
}));

jest.mock('@/data/breadRecipes', () => ({
  breadRecipes: [
    {
      id: 'mock-bread-1',
      title: 'Mock Bread 1',
      description: 'This is mock bread 1',
      imageUrl: '/mock-bread-1.jpg',
      date: new Date().toLocaleDateString(),
      link: '/recipes/mock-bread-1'
    }
  ]
}));

// Mock the logger
jest.mock('@/utils/logger', () => ({
  logInfo: (...args: any[]) => mockLogger.logInfo(...args),
  logError: (...args: any[]) => mockLogger.logError(...args),
  logWarn: (...args: any[]) => mockLogger.logWarn(...args),
  logDebug: (...args: any[]) => mockLogger.logDebug(...args)
}));

describe('IndexingService', () => {
  let indexingService: IndexingService;
  let testContent: ReturnType<typeof getTestContent>;
  
  beforeEach(() => {
    testContent = [];
    indexingService = new IndexingService(testContent);
    mockLogger.logInfo.mockClear();
    mockLogger.logError.mockClear();
  });
  
  test('should index recipes', async () => {
    await indexingService.indexRecipes();
    
    // Check that recipes from both sources were indexed
    expect(testContent.length).toBe(3); // 2 from recipesData + 1 from breadRecipes
    expect(testContent.filter(item => item.type === 'recipe').length).toBe(3);
    
    // Check that recipe data was transformed correctly
    const breadRecipe = testContent.find(item => item.id === 'mock-bread-1');
    expect(breadRecipe).toBeDefined();
    expect(breadRecipe?.title).toBe('Mock Bread 1');
    expect(breadRecipe?.url).toBe('/recipes/mock-bread-1');
    
    // Verify logging
    expect(mockLogger.logInfo).toHaveBeenCalledWith('Indexing recipes');
    expect(mockLogger.logInfo).toHaveBeenCalledWith('Recipes indexed successfully', expect.any(Object));
  });
  
  test('should index blog posts', async () => {
    await indexingService.indexBlogPosts();
    
    // Check that blog posts were created from recipes (mock implementation)
    expect(testContent.length).toBeGreaterThan(0);
    expect(testContent.filter(item => item.type === 'blog').length).toBeGreaterThan(0);
    
    // Verify the blog post transformation
    const blogPost = testContent.find(item => item.type === 'blog');
    expect(blogPost).toBeDefined();
    expect(blogPost?.title).toContain('How to Make');
    expect(blogPost?.tags).toContain('tutorial');
    
    // Verify logging
    expect(mockLogger.logInfo).toHaveBeenCalledWith('Indexing blog posts');
    expect(mockLogger.logInfo).toHaveBeenCalledWith('Blog posts indexed successfully', expect.any(Object));
  });
  
  test('should handle errors during indexing', async () => {
    // Mock an error in the recipes data
    jest.resetModules();
    jest.mock('@/data/recipesData', () => {
      throw new Error('Test error');
    });
    
    // This should catch the error and log it without crashing
    await indexingService.indexRecipes();
    
    expect(mockLogger.logError).toHaveBeenCalledWith('Error indexing recipes', expect.any(Object));
  });
});
