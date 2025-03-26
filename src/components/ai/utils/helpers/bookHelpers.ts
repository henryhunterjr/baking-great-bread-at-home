
import { BookRecommendation } from '../types';
import { books } from '../data';

/**
 * Find a relevant book based on a search query
 * @param query The search query
 * @returns A book recommendation or null if no relevant book is found
 */
export const findRelevantBook = (query: string): BookRecommendation | null => {
  const normalizedQuery = query.toLowerCase();
  
  // Find books that match the query based on title or keywords
  const matches = books.filter(book => {
    const titleMatch = book.title.toLowerCase().includes(normalizedQuery);
    const keywordMatch = book.keywords?.some(keyword => 
      normalizedQuery.includes(keyword.toLowerCase())
    );
    
    return titleMatch || keywordMatch;
  });
  
  return matches.length > 0 ? matches[0] : null;
};
