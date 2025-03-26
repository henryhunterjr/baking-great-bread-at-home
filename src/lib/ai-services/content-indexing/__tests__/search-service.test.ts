
import { SearchService } from '../core/search-service';
import { getTestContent, mockLogger } from './test-utils';

// Mock the logger
jest.mock('@/utils/logger', () => ({
  logInfo: (...args: any[]) => mockLogger.logInfo(...args),
  logError: (...args: any[]) => mockLogger.logError(...args),
  logWarn: (...args: any[]) => mockLogger.logWarn(...args),
  logDebug: (...args: any[]) => mockLogger.logDebug(...args)
}));

// Create a mock implementation for Fuse
const mockFuseSearch = jest.fn();
const mockFuseInstance = {
  search: mockFuseSearch
};

// Mock the Fuse constructor
jest.mock('fuse.js', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => mockFuseInstance)
  };
});

// Import the mocked Fuse after mocking
import Fuse from 'fuse.js';

describe('SearchService', () => {
  let searchService: SearchService;
  let testContent: ReturnType<typeof getTestContent>;
  
  beforeEach(() => {
    testContent = getTestContent();
    searchService = new SearchService(testContent);
    
    // Clear all mocks
    jest.clearAllMocks();
    
    // Setup search mock implementations for different test cases
    mockFuseSearch.mockImplementation((query: string) => {
      if (query.includes('bread')) {
        return [
          {
            item: getTestContent()[0],
            score: 0.3,
            matches: [
              {
                key: 'content',
                indices: [[10, 15]],
                value: 'This is a test recipe with sourdough and flour.'
              }
            ]
          },
          {
            item: getTestContent()[1],
            score: 0.2,
            matches: [
              {
                key: 'content',
                indices: [[22, 27]],
                value: 'This is a blog post about making bread at home.'
              }
            ]
          }
        ];
      }
      if (query.includes('cinnamon')) {
        return [
          {
            item: getTestContent()[2],
            score: 0.1,
            matches: [
              {
                key: 'title',
                indices: [[0, 8]],
                value: 'Cinnamon Rolls Recipe'
              }
            ]
          }
        ];
      }
      return [];
    });
  });
  
  test('should initialize search engine', () => {
    searchService.initializeSearchEngine();
    expect(Fuse).toHaveBeenCalledTimes(1);
    expect(Fuse).toHaveBeenCalledWith(testContent, expect.any(Object));
  });
  
  test('should return empty array if search engine not initialized', () => {
    const results = searchService.search('test');
    expect(results).toEqual([]);
    expect(mockLogger.logError).toHaveBeenCalledWith('Search engine not initialized', undefined);
  });
  
  test('should search for bread content', () => {
    searchService.initializeSearchEngine();
    const results = searchService.search('bread');
    
    expect(results).toHaveLength(2);
    expect(results[0].item.id).toBe(testContent[0].id);
    expect(results[1].item.id).toBe(testContent[1].id);
    
    // Check matches transformation
    expect(results[0].matches).toBeDefined();
    expect(results[0].matches![0].key).toBe('content');
    expect(results[0].matches![0].indices).toEqual([[10, 15]]);
  });
  
  test('should search for cinnamon content', () => {
    searchService.initializeSearchEngine();
    const results = searchService.search('cinnamon');
    
    expect(results).toHaveLength(1);
    expect(results[0].item.id).toBe(testContent[2].id);
  });
  
  test('should handle search options', () => {
    searchService.initializeSearchEngine();
    
    searchService.search('test', { threshold: 0.5, includeScore: false });
    
    expect(mockFuseSearch).toHaveBeenCalledWith('test', expect.objectContaining({
      threshold: 0.5,
      includeScore: false
    }));
  });
});
