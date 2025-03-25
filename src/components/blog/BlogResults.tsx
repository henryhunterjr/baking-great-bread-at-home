
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import BlogPostCard, { BlogPostCardSkeleton } from '@/components/BlogPostCard';
import { BlogPost } from '@/services/BlogService';

interface BlogResultsProps {
  debouncedSearchQuery: string;
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
  refreshPosts: () => void;
  clearSearch: () => void;
}

const BlogResults: React.FC<BlogResultsProps> = ({
  debouncedSearchQuery,
  posts,
  loading,
  error,
  refreshPosts,
  clearSearch
}) => {
  // Determine which posts to display
  const displayedPosts = debouncedSearchQuery ? posts : posts.slice(0, 3);

  return (
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
  );
};

export default BlogResults;
