import { useState, useEffect } from 'react';

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  imageUrl: string;
  link: string;
}

// Cache expiration time in milliseconds (24 hours)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

class BlogService {
  private static instance: BlogService;
  private cache: {
    posts: BlogPost[];
    timestamp: number;
  } | null = null;

  public static getInstance(): BlogService {
    if (!BlogService.instance) {
      BlogService.instance = new BlogService();
    }
    return BlogService.instance;
  }

  public async getPosts(): Promise<BlogPost[]> {
    // Return cached posts if available and not expired
    if (this.cache && (Date.now() - this.cache.timestamp < CACHE_EXPIRATION)) {
      return this.cache.posts;
    }

    try {
      // Try WordPress REST API first
      const posts = await this.fetchFromWordPressAPI();
      this.updateCache(posts);
      return posts;
    } catch (error) {
      console.error("Error fetching from WordPress API:", error);
      
      try {
        // Fallback to RSS Feed parsing
        const posts = await this.fetchFromRSSFeed();
        this.updateCache(posts);
        return posts;
      } catch (rssError) {
        console.error("Error fetching from RSS Feed:", rssError);
        
        // Return cached posts if available (even if expired) as a last resort
        if (this.cache) {
          return this.cache.posts;
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

  private async fetchFromWordPressAPI(): Promise<BlogPost[]> {
    const response = await fetch('https://bakinggreatbread.blog/wp-json/wp/v2/posts?_embed&per_page=10');
    
    if (!response.ok) {
      throw new Error('WordPress API not available');
    }
    
    const data = await response.json();
    
    return data.map((post: any) => ({
      id: post.id,
      title: post.title.rendered,
      excerpt: this.stripHtmlTags(post.excerpt.rendered).substring(0, 150) + '...',
      date: new Date(post.date).toLocaleDateString(),
      imageUrl: this.extractFeaturedImage(post),
      link: post.link
    }));
  }

  private async fetchFromRSSFeed(): Promise<BlogPost[]> {
    const response = await fetch('https://bakinggreatbread.blog/feed/');
    
    if (!response.ok) {
      throw new Error('RSS feed not available');
    }
    
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    const items = xmlDoc.querySelectorAll('item');
    
    return Array.from(items).slice(0, 10).map((item, index) => {
      const title = item.querySelector('title')?.textContent || 'Untitled Post';
      const link = item.querySelector('link')?.textContent || '#';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const content = item.querySelector('content\\:encoded, encoded')?.textContent || '';
      
      // Extract the first image from content
      const imageMatch = content.match(/<img[^>]+src="([^">]+)"/);
      const imageUrl = imageMatch ? imageMatch[1] : this.getPlaceholderImage(index);
      
      // Extract text content for excerpt
      const div = document.createElement('div');
      div.innerHTML = content;
      const excerpt = div.textContent?.trim().substring(0, 150) + '...' || '';
      
      return {
        id: index,
        title,
        excerpt,
        date: new Date(pubDate).toLocaleDateString(),
        imageUrl,
        link
      };
    });
  }

  private updateCache(posts: BlogPost[]): void {
    this.cache = {
      posts,
      timestamp: Date.now()
    };
    
    // Also store in localStorage for offline access
    localStorage.setItem('blogPosts', JSON.stringify(this.cache));
  }

  private stripHtmlTags(html: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  private extractFeaturedImage(post: any): string {
    // Try to get featured media
    if (post._embedded && 
        post._embedded['wp:featuredmedia'] && 
        post._embedded['wp:featuredmedia'][0] && 
        post._embedded['wp:featuredmedia'][0].source_url) {
      return post._embedded['wp:featuredmedia'][0].source_url;
    }
    
    // Fallback to first image in content
    const contentMatch = post.content.rendered.match(/<img[^>]+src="([^">]+)"/);
    if (contentMatch) {
      return contentMatch[1];
    }
    
    // Default placeholder
    return this.getPlaceholderImage(post.id);
  }

  private getPlaceholderImage(index: number): string {
    const placeholders = [
      "https://images.unsplash.com/photo-1635321313157-5be9fde3fcbb?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586444248879-bc604cbd555a?q=80&w=1000&auto=format&fit=crop"
    ];
    
    return placeholders[index % placeholders.length];
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
        const cachedData = localStorage.getItem('blogPosts');
        if (cachedData) {
          try {
            const parsedData = JSON.parse(cachedData);
            setPosts(parsedData.posts);
          } catch (parseErr) {
            console.error("Error parsing cached blog posts:", parseErr);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [searchQuery]);
  
  return { posts, loading, error };
}

export default BlogService;
