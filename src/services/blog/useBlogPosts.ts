
import { useState, useEffect } from 'react';
import { BlogPost } from './types';
import { getBlogCache } from './blogCache';
import BlogServiceCore from './BlogServiceCore';

export function useBlogPosts(searchQuery: string = '') {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const blogService = BlogServiceCore.getInstance();
        const fetchedPosts = searchQuery 
          ? await blogService.searchPosts(searchQuery)
          : await blogService.getPosts();
        
        setPosts(fetchedPosts);
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setError("Unable to load blog posts. Please try again later.");
        
        // Try to get posts from localStorage as fallback
        const cache = getBlogCache();
        if (cache) {
          setPosts(cache.posts);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [searchQuery]);
  
  return { posts, loading, error };
}
