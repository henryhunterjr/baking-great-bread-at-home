
import { contentIndexer, initializeContentIndexer } from '../content-indexer';
import { IndexedContent, ContentType } from '../types';
import { mockLogger, getTestContent, resetAllMocks } from './test-utils';

// Mock the logger
jest.mock('@/utils/logger', () => ({
  logInfo: (...args: any[]) => mockLogger.logInfo(...args),
  logError: (...args: any[]) => mockLogger.logError(...args),
  logWarn: (...args: any[]) => mockLogger.logWarn(...args),
  logDebug: (...args: any[]) => mockLogger.logDebug(...args)
}));

describe('Content Indexer Edge Cases', () => {
  beforeEach(async () => {
    resetAllMocks();
    
    // Reset contentIndexer state
    const contentIndexerCore = require('../core/content-indexer-core').contentIndexerCore;
    // @ts-ignore: accessing private property for testing
    contentIndexerCore.isInitialized = false;
    
    await initializeContentIndexer();
  });
  
  test('should handle empty content gracefully', () => {
    const emptyContent: IndexedContent = {
      id: 'empty-content',
      title: '',
      content: '',
      excerpt: '',
      type: 'blog' as ContentType,
      tags: [],
      url: '/empty'
    };
    
    // Should not throw an error
    expect(() => contentIndexer.addOrUpdateContent(emptyContent)).not.toThrow();
    
    // Should be able to retrieve the empty content
    const results = contentIndexer.search('empty');
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
  
  test('should handle duplicate content IDs correctly', () => {
    const content1: IndexedContent = {
      id: 'duplicate-id',
      title: 'Original Content',
      content: 'This is the original content',
      excerpt: 'Original excerpt',
      type: 'blog' as ContentType,
      tags: ['original'],
      url: '/original'
    };
    
    const content2: IndexedContent = {
      id: 'duplicate-id',
      title: 'Updated Content',
      content: 'This is the updated content',
      excerpt: 'Updated excerpt',
      type: 'blog' as ContentType,
      tags: ['updated'],
      url: '/updated'
    };
    
    contentIndexer.addOrUpdateContent(content1);
    contentIndexer.addOrUpdateContent(content2);
    
    // Should contain the updated content
    const results = contentIndexer.search('updated');
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].item.title).toBe('Updated Content');
    
    // Should not contain the original content
    const originalResults = contentIndexer.search('original');
    expect(originalResults.some(r => r.item.id === 'duplicate-id' && r.item.title === 'Original Content')).toBe(false);
  });
  
  test('should handle special characters in search queries', () => {
    const specialContent: IndexedContent = {
      id: 'special-chars',
      title: 'Content with special characters: & % $ #',
      content: 'This content has (parentheses), [brackets], {braces}, and other symbols like +*^%$#@!',
      excerpt: 'Special characters excerpt',
      type: 'blog' as ContentType,
      tags: ['special'],
      url: '/special'
    };
    
    contentIndexer.addOrUpdateContent(specialContent);
    
    // Should be able to search with special characters
    const results = contentIndexer.search('(parentheses)');
    expect(results.length).toBeGreaterThanOrEqual(1);
    
    const results2 = contentIndexer.search('special characters: &');
    expect(results2.length).toBeGreaterThanOrEqual(1);
  });
  
  test('should handle removal of non-existent content gracefully', () => {
    // Should not throw an error
    expect(() => contentIndexer.removeContent('non-existent-id', 'blog')).not.toThrow();
    expect(mockLogger.logWarn).toHaveBeenCalled();
  });
  
  test('should handle very large content without performance issues', () => {
    // Create a very large content item
    const largeContent: IndexedContent = {
      id: 'large-content',
      title: 'Very Large Content',
      content: 'a'.repeat(10000),  // 10KB of data
      excerpt: 'Large content excerpt',
      type: 'blog' as ContentType,
      tags: ['large'],
      url: '/large'
    };
    
    const startTime = Date.now();
    contentIndexer.addOrUpdateContent(largeContent);
    const indexTime = Date.now() - startTime;
    
    // Indexing should complete in a reasonable time (adjust threshold as needed)
    expect(indexTime).toBeLessThan(1000);  // Less than 1 second
    
    // Search should also be reasonably fast
    const searchStartTime = Date.now();
    contentIndexer.search('large');
    const searchTime = Date.now() - searchStartTime;
    
    expect(searchTime).toBeLessThan(500);  // Less than 500ms
  });
});
