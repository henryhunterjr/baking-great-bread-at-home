
import { BlogPost } from './types';
import { getBlogCache, isCacheValid, updateBlogCache } from './blogCache';
import { fetchFromWordPressAPI } from './wordpressService';
import { fetchFromRSSFeed } from './rssFeedService';
import { stripHtmlTags, extractFeaturedImage } from './blogUtils';

class BlogServiceCore {
  private static instance: BlogServiceCore;

  public static getInstance(): BlogServiceCore {
    if (!BlogServiceCore.instance) {
      BlogServiceCore.instance = new BlogServiceCore();
    }
    return BlogServiceCore.instance;
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
    // Normalize search term
    const searchTerm = query.toLowerCase().trim();
    
    // Always try to fetch directly from the blog first for the most current results
    try {
      // Try to fetch directly from WordPress for the most up-to-date results
      const directResults = await this.fetchDirectFromWordPress(searchTerm);
      if (directResults && directResults.length > 0) {
        return directResults;
      }
    } catch (error) {
      console.error("Error searching directly from WordPress:", error);
      // Continue with local search if direct search fails
    }
    
    // If direct search fails or returns no results, fall back to local search
    const allPosts = await this.getPosts();
    
    // Include challah-specific recipes and fallbacks
    const fallbackService = new FallbackRecipesService();
    const allRecipes = [...allPosts, ...fallbackService.getChallahRecipes(), ...fallbackService.getFallbackRecipes()];
    
    // Perform a more thorough search with broader matching for specific bread types
    const searchService = new SearchService();
    return allRecipes.filter(post => 
      post.title.toLowerCase().includes(searchTerm) || 
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.link.toLowerCase().includes(searchTerm) ||
      searchService.checkRelatedTerms(post, searchTerm)
    );
  }
  
  private async fetchDirectFromWordPress(query: string): Promise<BlogPost[] | null> {
    try {
      // Direct search to WordPress blog with the search parameter
      const response = await fetch(`https://bakinggreatbread.blog/wp-json/wp/v2/posts?search=${encodeURIComponent(query)}&_embed&per_page=10`);
      
      if (!response.ok) {
        return null;
      }
      
      const data = await response.json();
      
      if (!data || data.length === 0) {
        return null;
      }
      
      return data.map((post: any) => ({
        id: post.id,
        title: post.title.rendered,
        excerpt: stripHtmlTags(post.excerpt.rendered).substring(0, 150) + '...',
        date: new Date(post.date).toLocaleDateString(),
        imageUrl: extractFeaturedImage(post),
        link: post.link
      }));
    } catch (error) {
      console.error("Error in direct WordPress search:", error);
      return null;
    }
  }
}

export default BlogServiceCore;
