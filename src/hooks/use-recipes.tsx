
import { useState, useEffect, useRef } from 'react';
import { Recipe } from '@/components/recipes/types';
import { useBlogPosts } from '@/services/BlogService';
import BlogService from '@/services/BlogService';
import { recipesData } from '@/data/recipesData';
import { breadRecipes } from '@/data/breadRecipes';
import { toast } from 'sonner';
import { performEnhancedSearch } from './recipe-helpers/search-utils';
import { 
  convertBlogPostsToRecipes, 
  removeDuplicateRecipes, 
  enhanceRecipesWithBlogPosts 
} from './recipe-helpers/data-transform';

export function useRecipes(searchQuery: string) {
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allPosts, setAllPosts] = useState<Recipe[]>([]);
  const prevSearchQuery = useRef('');
  
  // Fetch blog posts using the service
  const { posts, loading, error } = useBlogPosts(searchQuery);
  
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
        
        // Combine and remove duplicates, prioritizing our custom bread recipes
        const combinedRecipes = [...breadRecipes, ...recipesFromAllPosts, ...enhancedRecipesData];
        const uniqueRecipes = removeDuplicateRecipes(combinedRecipes);
        
        setAllPosts(uniqueRecipes);
        setFilteredRecipes(uniqueRecipes);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching all blog posts:", err);
        // Fallback to the static recipes data, bread recipes, and posts from the hook
        const recipesFromPosts = convertBlogPostsToRecipes(posts);
        
        const combinedRecipes = [...breadRecipes, ...recipesFromPosts, ...recipesData];
        setAllPosts(combinedRecipes);
        setFilteredRecipes(combinedRecipes);
        setIsLoading(false);
      }
    };
    
    fetchAllPosts();
  }, []);
  
  // Filter recipes based on search query with improved search logic
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRecipes(allPosts);
      return;
    }
    
    // Use search results from the API if available
    if (posts.length > 0 && searchQuery.trim() !== '') {
      const searchResults = convertBlogPostsToRecipes(posts);
      
      // Enhance search results with our custom bread recipes if they match the search
      const customMatches = breadRecipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      const combinedResults = [...customMatches, ...searchResults];
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
    
    prevSearchQuery.current = query;
  }, [searchQuery, allPosts, posts, filteredRecipes]);

  return {
    filteredRecipes,
    isLoading: isLoading || loading,
    error
  };
}
