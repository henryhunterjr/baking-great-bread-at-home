import React, { useState, useRef, useEffect } from 'react';
import { useBlogPosts } from '@/services/BlogService';
import BlogPostCard, { BlogPostCardSkeleton } from '@/components/BlogPostCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RefreshCw, Search, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const { posts, loading, error } = useBlogPosts(debouncedSearchQuery);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    };
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearchQuery(searchQuery);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  
  const refreshPosts = async () => {
    setIsRefreshing(true);
    
    localStorage.removeItem('blogPosts');
    
    const currentQuery = debouncedSearchQuery;
    setDebouncedSearchQuery('');
    
    setTimeout(() => {
      setDebouncedSearchQuery(currentQuery);
      setIsRefreshing(false);
      toast({
        title: "Blog Refreshed",
        description: "The latest posts have been loaded.",
      });
    }, 1000);
  };
  
  const displayedPosts = debouncedSearchQuery ? posts : posts.slice(0, 3);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section 
        ref={(el) => sectionRefs.current[0] = el}
        className="pt-32 pb-16 md:pt-40 md:pb-20 opacity-0"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge variant="outline" className="mb-6 bg-bread-50 text-bread-800 border-bread-200 dark:bg-bread-800 dark:text-white dark:border-bread-700 uppercase text-xs font-medium tracking-wider px-3 py-1">
              BLOG
            </Badge>
            <h1 className="section-title text-4xl md:text-5xl font-serif font-medium mb-4">
              Baking Great Bread at Home Blog
            </h1>
            <p className="section-subtitle text-xl text-muted-foreground">
              Crafting Bread, Cultivating Community.
            </p>
            <img 
              src="/lovable-uploads/27ebc720-4afd-4d56-a5aa-364c66ef2d5c.png" 
              alt="Baking Great Bread at Home Blog" 
              className="mx-auto mt-6 max-w-xs"
            />
          </div>
          
          <div className="max-w-2xl mx-auto mb-16">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search for recipes, techniques, or ingredients..."
                  className="pl-10 pr-10 py-6 h-auto border-bread-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button 
                variant="outline" 
                size="icon"
                title="Refresh blog posts"
                onClick={refreshPosts}
                disabled={isRefreshing}
                className="border-bread-200 text-bread-800 h-auto aspect-square"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </form>
          </div>
        </div>
      </section>
      
      <section 
        ref={(el) => sectionRefs.current[1] = el}
        className="pb-20 opacity-0"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {debouncedSearchQuery && (
            <div className="mb-8 text-center">
              <h2 className="text-xl font-serif">
                {posts.length === 0 
                  ? 'No results found for' 
                  : `Search results for`} 
                <span className="font-medium text-bread-800"> "{debouncedSearchQuery}"</span>
              </h2>
            </div>
          )}
          
          {error && !loading && posts.length === 0 && (
            <div className="text-center py-12 max-w-lg mx-auto">
              <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                <h3 className="font-serif text-xl mb-2 text-red-700">Unable to Load Blog Posts</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <Button 
                  onClick={refreshPosts} 
                  variant="outline"
                  className="border-red-200 hover:bg-red-50"
                >
                  <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                </Button>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <BlogPostCardSkeleton key={i} />
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displayedPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : !debouncedSearchQuery ? (
            <div className="text-center py-12">
              <h3 className="font-serif text-xl mb-2">No Blog Posts Available</h3>
              <p className="text-muted-foreground mb-4">Check back soon for new content!</p>
            </div>
          ) : null}
          
          {posts.length > 0 && debouncedSearchQuery && (
            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                onClick={clearSearch}
                className="border-bread-200 text-bread-800"
              >
                Clear Search Results
              </Button>
            </div>
          )}
        </div>
      </section>
      
      <div className="flex-grow"></div>
      <Footer />
    </div>
  );
};

export default Blog;
