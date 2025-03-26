
import { IndexedContent, ContentType } from '../types';

/**
 * Test helper functions and mock data for content indexing tests
 */

// Mock content items for testing
export const mockContentItems: IndexedContent[] = [
  {
    id: 'test-1',
    title: 'Test Recipe 1',
    content: 'This is a test recipe with sourdough and flour.',
    excerpt: 'This is a test recipe with sourdough...',
    type: 'recipe' as ContentType,
    tags: ['bread', 'sourdough'],
    url: '/recipes/test-1',
    imageUrl: '/test-image-1.jpg',
    metadata: { date: '2023-01-01' }
  },
  {
    id: 'test-2',
    title: 'Test Blog Post',
    content: 'This is a blog post about making bread at home.',
    excerpt: 'This is a blog post about making bread...',
    type: 'blog' as ContentType,
    tags: ['bread', 'tutorial'],
    url: '/blog/test-2',
    imageUrl: '/test-image-2.jpg',
    metadata: { date: '2023-01-02', author: 'Test Author' }
  },
  {
    id: 'test-3',
    title: 'Cinnamon Rolls Recipe',
    content: 'Delicious cinnamon rolls with frosting.',
    excerpt: 'Delicious cinnamon rolls with frosting...',
    type: 'recipe' as ContentType,
    tags: ['sweet', 'breakfast'],
    url: '/recipes/test-3',
    imageUrl: '/test-image-3.jpg',
    metadata: { date: '2023-01-03' }
  }
];

// Helper to create a clean content array copy for each test
export const getTestContent = (): IndexedContent[] => {
  return JSON.parse(JSON.stringify(mockContentItems));
};

// Mock logger to prevent console output during tests
export const mockLogger = {
  logInfo: jest.fn(),
  logError: jest.fn(),
  logWarn: jest.fn(),
  logDebug: jest.fn()
};

// Helper to reset all mocks between tests
export const resetAllMocks = () => {
  mockLogger.logInfo.mockReset();
  mockLogger.logError.mockReset();
  mockLogger.logWarn.mockReset();
  mockLogger.logDebug.mockReset();
};
