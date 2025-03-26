
import { ContentManager } from '../core/content-manager';
import { getTestContent, mockLogger } from './test-utils';
import { ContentType } from '../types';

// Mock the logger
jest.mock('@/utils/logger', () => ({
  logInfo: (...args: any[]) => mockLogger.logInfo(...args),
  logError: (...args: any[]) => mockLogger.logError(...args),
  logWarn: (...args: any[]) => mockLogger.logWarn(...args),
  logDebug: (...args: any[]) => mockLogger.logDebug(...args)
}));

describe('ContentManager', () => {
  let contentManager: ContentManager;
  let testContent: ReturnType<typeof getTestContent>;
  
  beforeEach(() => {
    testContent = getTestContent();
    contentManager = new ContentManager(testContent);
  });
  
  test('should get all content', () => {
    const allContent = contentManager.getAllContent();
    expect(allContent).toHaveLength(testContent.length);
    expect(allContent).not.toBe(testContent); // Should be a copy, not the same reference
  });
  
  test('should get content by type', () => {
    const recipeContent = contentManager.getContentByType('recipe');
    expect(recipeContent).toHaveLength(2); // Based on our mock data
    
    const blogContent = contentManager.getContentByType('blog');
    expect(blogContent).toHaveLength(1); // Based on our mock data
  });
  
  test('should get content by tags', () => {
    const breadContent = contentManager.getContentByTags(['bread']);
    expect(breadContent).toHaveLength(2); // Two items have the 'bread' tag
    
    const sweetContent = contentManager.getContentByTags(['sweet']);
    expect(sweetContent).toHaveLength(1); // One item has the 'sweet' tag
    
    // Test with multiple tags (should match any of the tags)
    const multiTagContent = contentManager.getContentByTags(['sweet', 'sourdough']);
    expect(multiTagContent).toHaveLength(2); // One with 'sweet', one with 'sourdough'
  });
  
  test('should add new content', () => {
    const newContent = {
      id: 'test-4',
      title: 'New Test Recipe',
      content: 'New content for testing',
      excerpt: 'New content for testing...',
      type: 'recipe' as ContentType,
      tags: ['test'],
      url: '/recipes/test-4'
    };
    
    contentManager.addOrUpdateContent(newContent);
    const allContent = contentManager.getAllContent();
    expect(allContent).toHaveLength(testContent.length + 1);
    expect(allContent.find(item => item.id === 'test-4')).toBeTruthy();
  });
  
  test('should update existing content', () => {
    const updatedContent = {
      ...testContent[0],
      title: 'Updated Title',
      content: 'Updated content'
    };
    
    contentManager.addOrUpdateContent(updatedContent);
    const allContent = contentManager.getAllContent();
    expect(allContent).toHaveLength(testContent.length); // No new items added
    
    const updated = allContent.find(item => item.id === testContent[0].id);
    expect(updated?.title).toBe('Updated Title');
    expect(updated?.content).toBe('Updated content');
  });
  
  test('should remove content', () => {
    contentManager.removeContent(testContent[0].id, testContent[0].type);
    const allContent = contentManager.getAllContent();
    expect(allContent).toHaveLength(testContent.length - 1);
    expect(allContent.find(item => item.id === testContent[0].id)).toBeFalsy();
  });
});
