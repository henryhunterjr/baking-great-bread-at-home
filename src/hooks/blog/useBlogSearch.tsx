
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useBlogSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearchQuery(searchQuery);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
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

  return {
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    isRefreshing,
    handleSearch,
    clearSearch,
    refreshPosts
  };
};
