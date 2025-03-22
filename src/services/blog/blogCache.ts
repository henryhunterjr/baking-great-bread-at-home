
import { BlogPost, BlogCache } from './types';

// Cache expiration time in milliseconds (24 hours)
export const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

export const getBlogCache = (): BlogCache | null => {
  const cachedData = localStorage.getItem('blogPosts');
  if (!cachedData) return null;
  
  try {
    return JSON.parse(cachedData);
  } catch (err) {
    console.error("Error parsing cached blog posts:", err);
    return null;
  }
};

export const isCacheValid = (cache: BlogCache | null): boolean => {
  if (!cache) return false;
  return (Date.now() - cache.timestamp < CACHE_EXPIRATION);
};

export const updateBlogCache = (posts: BlogPost[]): void => {
  const cache = {
    posts,
    timestamp: Date.now()
  };
  
  // Store in localStorage for offline access
  localStorage.setItem('blogPosts', JSON.stringify(cache));
};
