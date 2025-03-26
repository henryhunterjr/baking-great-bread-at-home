
import { BlogPost } from './types';
import { getBlogCache, isCacheValid, updateBlogCache } from './blogCache';
import { fetchFromWordPressAPI } from './wordpressService';
import { fetchFromRSSFeed } from './rssFeedService';
import { stripHtmlTags, extractFeaturedImage } from './blogUtils';
import SearchService from './SearchService';
import FallbackRecipesService from './FallbackRecipesService';

class BlogServiceCore {
  private static instance: BlogServiceCore;
  private searchService: SearchService;

  constructor() {
    this.searchService = new SearchService();
  }

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
    
    // Special case for Henry's Foolproof Sourdough
    const isHenrysFoolproofSearch = searchTerm.includes('henry') || 
                                    searchTerm.includes('foolproof') ||
                                    searchTerm.includes('sourdough loaf');
    
    if (isHenrysFoolproofSearch) {
      console.log("Detected search for Henry's Foolproof Sourdough");
      // Try to find this specific recipe in our static data first
      const allPosts = await this.getPosts();
      const henryRecipe = allPosts.find(post => 
        post.title.toLowerCase().includes('henry') && 
        post.title.toLowerCase().includes('foolproof')
      );
      
      if (henryRecipe) {
        console.log("Found Henry's Foolproof recipe:", henryRecipe.title);
        return [henryRecipe];
      }
      
      // Also check our fallback recipes
      const fallbackService = new FallbackRecipesService();
      const henryFallbackRecipe = fallbackService.getFallbackRecipes().find(recipe => 
        recipe.title.toLowerCase().includes('henry') || 
        recipe.title.toLowerCase().includes('foolproof')
      );
      
      if (henryFallbackRecipe) {
        console.log("Found Henry's Foolproof recipe in fallbacks");
        return [henryFallbackRecipe];
      }
    }
    
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
    
    // Use normalized query for search
    const normalizedQuery = this.searchService.normalizeQuery(searchTerm);
    
    // Perform a more thorough search with broader matching for specific bread types
    return allRecipes.filter(post => 
      post.title.toLowerCase().includes(normalizedQuery) || 
      post.excerpt.toLowerCase().includes(normalizedQuery) ||
      post.link.toLowerCase().includes(normalizedQuery) ||
      this.searchService.checkRelatedTerms(post, normalizedQuery)
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
