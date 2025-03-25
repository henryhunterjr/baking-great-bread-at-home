
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Search, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BlogSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  clearSearch: () => void;
  refreshPosts: () => void;
  isRefreshing: boolean;
}

const BlogSearch: React.FC<BlogSearchProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  handleSearch, 
  clearSearch, 
  refreshPosts, 
  isRefreshing 
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
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
  );
};

export default BlogSearch;
