
/**
 * Types for the content indexing system
 */

export interface IndexedContent {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  type: ContentType;
  tags: string[];
  url: string;
  imageUrl?: string;
  metadata?: Record<string, any>;
}

export type ContentType = 'blog' | 'recipe' | 'book' | 'challenge';

export interface SearchResult {
  item: IndexedContent;
  score: number;
  matches?: Array<{
    key: string;
    indices: Array<[number, number]>;
    value: string;
  }>;
}

export interface ContentIndexOptions {
  threshold?: number;
  tokenize?: boolean;
  matchAllTokens?: boolean;
  includeScore?: boolean;
  includeMatches?: boolean;
}
