
import { useState, useEffect, useRef } from 'react';
import { Recipe } from '@/components/recipes/types';
import { useBlogPosts } from '@/services/BlogService';
import BlogService from '@/services/BlogService';
import { recipesData } from '@/data/recipesData';
import { breadRecipes } from '@/data/breadRecipes';
import { toast } from 'sonner';
import { performEnhancedSearch, handleBananaBreadSearch } from './recipe-helpers/search-utils';
import { 
  convertBlogPostsToRecipes, 
  removeDuplicateRecipes, 
  enhanceRecipesWithBlogPosts 
} from './recipe-helpers/data-transform';
import { getBananaRecipes } from './recipe-helpers/banana-recipes';

export function useRecipes(searchQuery: string) {
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allPosts, setAllPosts] = useState<Recipe[]>([]);
  const [error, setError] = useState<Error | string | null>(null);
  const prevSearchQuery = useRef('');
  
  // Fetch blog posts using the service
  const { posts, loading, error: blogError } = useBlogPosts(searchQuery);
  
  // Fetch all posts directly using the service instance to ensure we get everything
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const blogService = BlogService.getInstance();
        const allBlogPosts = await blogService.getPosts();
        
        // Convert blog posts to recipes with better image handling
        const recipesFromAllPosts = convertBlogPostsToRecipes(allBlogPosts);
        
        // Enhance hardcoded recipes data with blog post information
        const enhancedRecipesData = enhanceRecipesWithBlogPosts(recipesData, allBlogPosts);
        
        // Get banana bread recipes for specific searches
        const bananaRecipes = getBananaRecipes();
        
        // Combine and remove duplicates, prioritizing our custom bread recipes
        const combinedRecipes = [
          ...breadRecipes, 
          ...bananaRecipes, 
          ...recipesFromAllPosts, 
          ...enhancedRecipesData
        ];
        
        const uniqueRecipes = removeDuplicateRecipes(combinedRecipes);
        
        setAllPosts(uniqueRecipes);
        setFilteredRecipes(uniqueRecipes);
        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.error("Error fetching all blog posts:", err);
        setError(err instanceof Error ? err : String(err));
        
        // Fallback to the static recipes data, bread recipes, banana recipes, and posts from the hook
        const recipesFromPosts = convertBlogPostsToRecipes(posts);
        const bananaRecipes = getBananaRecipes();
        
        const combinedRecipes = [...breadRecipes, ...bananaRecipes, ...recipesFromPosts, ...recipesData];
        setAllPosts(combinedRecipes);
        setFilteredRecipes(combinedRecipes);
        setIsLoading(false);
      }
    };
    
    fetchAllPosts();
  }, [posts]);
  
  // Handle blog API errors
  useEffect(() => {
    if (blogError) {
      setError(blogError);
    }
  }, [blogError]);
  
  // Filter recipes based on search query with improved search logic
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRecipes(allPosts);
      return;
    }
    
    // Special case for banana bread
    if (searchQuery.toLowerCase().includes('banana bread') || 
        (searchQuery.toLowerCase().includes('banana') && searchQuery.toLowerCase().includes('bread'))) {
      const bananaResults = handleBananaBreadSearch(allPosts);
      if (bananaResults && bananaResults.length > 0) {
        setFilteredRecipes(bananaResults);
        return;
      }
    }
    
    // Use search results from the API if available
    if (posts.length > 0 && searchQuery.trim() !== '') {
      const searchResults = convertBlogPostsToRecipes(posts);
      
      // Get banana bread recipes for specific searches
      const bananaRecipes = getBananaRecipes();
      
      // Enhance search results with our custom bread recipes if they match the search
      const customMatches = breadRecipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      const combinedResults = [...bananaRecipes, ...customMatches, ...searchResults];
      const uniqueResults = removeDuplicateRecipes(combinedResults);
      
      setFilteredRecipes(uniqueResults);
      return;
    }
    
    // Fallback to client-side search with enhanced matching
    const query = searchQuery.toLowerCase().trim();
    
    // Perform enhanced search using the utility function
    const filtered = performEnhancedSearch(query, allPosts);
    
    setFilteredRecipes(filtered);
    
    // Handle special case for challah search to show toast
    if (query === 'challah' && prevSearchQuery.current === 'challah' && 
        filteredRecipes.length === 0 && filtered.length > 0) {
      toast.success(`Found ${filtered.length} challah bread recipes!`);
    }
    
    // Handle special case for banana bread to show toast
    if ((query.includes('banana bread') || (query.includes('banana') && query.includes('bread'))) && 
        prevSearchQuery.current.includes('banana') && 
        filteredRecipes.length === 0 && filtered.length > 0) {
      toast.success(`Found ${filtered.length} banana bread recipes!`);
    }
    
    prevSearchQuery.current = query;
  }, [searchQuery, allPosts, posts, filteredRecipes]);

  return {
    filteredRecipes,
    isLoading: isLoading || loading,
    error
  };
}
