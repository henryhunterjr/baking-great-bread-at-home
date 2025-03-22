
import { useState, useEffect } from 'react';
import { BlogPost } from './blog/types';
import { getBlogCache, isCacheValid, updateBlogCache } from './blog/blogCache';
import { fetchFromWordPressAPI } from './blog/wordpressService';
import { fetchFromRSSFeed } from './blog/rssFeedService';

class BlogService {
  private static instance: BlogService;

  public static getInstance(): BlogService {
    if (!BlogService.instance) {
      BlogService.instance = new BlogService();
    }
    return BlogService.instance;
  }

  public async getPosts(): Promise<BlogPost[]> {
    // Return cached posts if available and not expired
    const cache = getBlogCache();
    if (isCacheValid(cache)) {
      return cache.posts;
    }

    try {
      // Try WordPress REST API first
      const posts = await fetchFromWordPressAPI();
      updateBlogCache(posts);
      return posts;
    } catch (error) {
      console.error("Error fetching from WordPress API:", error);
      
      try {
        // Fallback to RSS Feed parsing
        const posts = await fetchFromRSSFeed();
        updateBlogCache(posts);
        return posts;
      } catch (rssError) {
        console.error("Error fetching from RSS Feed:", rssError);
        
        // Return cached posts if available (even if expired) as a last resort
        if (cache) {
          return cache.posts;
        }
        
        throw new Error("Failed to fetch blog posts");
      }
    }
  }

  public async searchPosts(query: string): Promise<BlogPost[]> {
    const allPosts = await this.getPosts();
    const searchTerm = query.toLowerCase();
    
    return allPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) || 
      post.excerpt.toLowerCase().includes(searchTerm)
    );
  }
}

export function useBlogPosts(searchQuery: string = '') {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const blogService = BlogService.getInstance();
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

export { BlogPost };
export default BlogService;
