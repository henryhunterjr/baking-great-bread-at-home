
import { contentIndexer, initializeContentIndexer } from '../content-indexer';
import { contentIndexerCore } from '../core/content-indexer-core';
import { mockLogger } from './test-utils';

// Mock the core module
jest.mock('../core/content-indexer-core', () => ({
  contentIndexerCore: {
    initialize: jest.fn(),
    search: jest.fn(),
    addOrUpdateContent: jest.fn(),
    removeContent: jest.fn(),
    getAllContent: jest.fn(),
    getContentByType: jest.fn(),
    getContentByTags: jest.fn()
  }
}));

// Mock the logger
jest.mock('@/utils/logger', () => ({
  logInfo: (...args: any[]) => mockLogger.logInfo(...args),
  logError: (...args: any[]) => mockLogger.logError(...args),
  logWarn: (...args: any[]) => mockLogger.logWarn(...args),
  logDebug: (...args: any[]) => mockLogger.logDebug(...args)
}));

describe('ContentIndexer (Facade)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('should initialize through the facade', async () => {
    await initializeContentIndexer();
    expect(contentIndexerCore.initialize).toHaveBeenCalled();
  });
  
  test('should delegate search to core', () => {
    contentIndexer.search('test', { threshold: 0.5 });
    expect(contentIndexerCore.search).toHaveBeenCalledWith('test', { threshold: 0.5 });
  });
  
  test('should delegate addOrUpdateContent to core', () => {
    const content = { id: 'test', title: 'Test', content: 'Content', excerpt: 'Excerpt', type: 'blog' as const, tags: [], url: 'url' };
    contentIndexer.addOrUpdateContent(content);
    expect(contentIndexerCore.addOrUpdateContent).toHaveBeenCalledWith(content);
  });
  
  test('should delegate removeContent to core', () => {
    contentIndexer.removeContent('test', 'blog');
    expect(contentIndexerCore.removeContent).toHaveBeenCalledWith('test', 'blog');
  });
  
  test('should delegate getAllContent to core', () => {
    contentIndexer.getAllContent();
    expect(contentIndexerCore.getAllContent).toHaveBeenCalled();
  });
  
  test('should delegate getContentByType to core', () => {
    contentIndexer.getContentByType('recipe');
    expect(contentIndexerCore.getContentByType).toHaveBeenCalledWith('recipe');
  });
  
  test('should delegate getContentByTags to core', () => {
    contentIndexer.getContentByTags(['test', 'tag']);
    expect(contentIndexerCore.getContentByTags).toHaveBeenCalledWith(['test', 'tag']);
  });
});
