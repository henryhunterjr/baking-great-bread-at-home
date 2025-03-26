
/**
 * Content-aware AI Types
 */

// Types for the content index
export interface ContentItem {
  id: string;
  title: string;
  content: string;
  url: string;
  type: 'blog' | 'recipe' | 'book' | 'faq';
  tags?: string[];
}

export interface ContentIndexOptions {
  sources?: string[];
  tags?: string[];
  limit?: number;
}

export interface SearchResult {
  items: ContentItem[];
  total: number;
}

// Response interface for context-aware AI
export interface ContextAwareResponse {
  success: boolean;
  answer: string;
  error?: string;
  sources?: Array<{
    title: string;
    excerpt: string;
    url: string;
    type: string;
  }>;
}
