
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Recipe } from '@/components/recipes/RecipeCard';
import RecipesHeader from '@/components/recipes/RecipesHeader';
import RecipeGrid from '@/components/recipes/RecipeGrid';
import { useBlogPosts } from '@/services/BlogService';
import BlogService from '@/services/BlogService';
import { recipesData } from '@/data/recipesData';
import { toast } from 'sonner';
import FloatingAIButton from '@/components/ai/FloatingAIButton';

const Recipes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allPosts, setAllPosts] = useState<Recipe[]>([]);
  const prevSearchQuery = useRef('');
  
  // Fetch blog posts using the service
  const { posts, loading, error } = useBlogPosts(searchQuery);
  
  // Set up refs for animation elements
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  
  // Fetch all posts directly using the service instance to ensure we get everything
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const blogService = BlogService.getInstance();
        const allBlogPosts = await blogService.getPosts();
        
        // Convert blog posts to recipes with better image handling
        const recipesFromAllPosts = allBlogPosts.map(post => ({
          id: post.id.toString(),
          title: post.title,
          description: post.excerpt,
          imageUrl: post.imageUrl,
          date: post.date,
          link: post.link,
          blogPostId: post.id.toString() // Store the original blog post ID for reference
        }));
        
        // Combine with hardcoded recipes data for more comprehensive results
        // For hardcoded recipes, try to match them with actual blog posts when possible
        const enhancedRecipesData = recipesData.map(recipe => {
          // Try to find a matching blog post based on title similarity
          const matchingPost = allBlogPosts.find(post => 
            post.title.toLowerCase().includes(recipe.title.toLowerCase()) ||
            recipe.title.toLowerCase().includes(post.title.toLowerCase())
          );
          
          if (matchingPost) {
            return {
              ...recipe,
              imageUrl: matchingPost.imageUrl, // Use the blog post image
              blogPostId: matchingPost.id.toString()
            };
          }
          
          return recipe;
        });
        
        const combinedRecipes = [...recipesFromAllPosts, ...enhancedRecipesData];
        
        // Remove duplicates by title
        const uniqueRecipes = combinedRecipes.reduce((acc, current) => {
          const isDuplicate = acc.find(item => item.title === current.title);
          if (!isDuplicate) {
            acc.push(current);
          } else if (isDuplicate && !isDuplicate.imageUrl && current.imageUrl) {
            // If duplicate exists but doesn't have an image, use this one's image
            isDuplicate.imageUrl = current.imageUrl;
          }
          return acc;
        }, [] as Recipe[]);
        
        setAllPosts(uniqueRecipes);
        setFilteredRecipes(uniqueRecipes);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching all blog posts:", err);
        // Fallback to the static recipes data and posts from the hook
        const recipesFromPosts = posts.map(post => ({
          id: post.id.toString(),
          title: post.title,
          description: post.excerpt,
          imageUrl: post.imageUrl,
          date: post.date,
          link: post.link
        }));
        
        const combinedRecipes = [...recipesFromPosts, ...recipesData];
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
      const searchResults = posts.map(post => ({
        id: post.id.toString(),
        title: post.title,
        description: post.excerpt,
        imageUrl: post.imageUrl,
        date: post.date,
        link: post.link
      }));
      
      setFilteredRecipes(searchResults);
      return;
    }
    
    // Fallback to client-side search with enhanced matching
    const query = searchQuery.toLowerCase().trim();
    
    // Special handling for challah search to ensure we always have results
    if (query === 'challah') {
      // Get challah-specific recipes
      const challahRecipes = getChallahRecipes();
      
      // Combine with any matching recipes from allPosts
      const allMatchingRecipes = [...challahRecipes];
      
      // Add any other challah recipes from the main collection that aren't duplicates
      allPosts.forEach(recipe => {
        const fullText = (recipe.title + ' ' + recipe.description).toLowerCase();
        if (
          (fullText.includes('challah') || 
           fullText.includes('braided bread') || 
           fullText.includes('jewish bread') ||
           (fullText.includes('bread') && fullText.includes('braided'))) &&
          !allMatchingRecipes.some(r => r.id === recipe.id)
        ) {
          allMatchingRecipes.push(recipe);
        }
      });
      
      setFilteredRecipes(allMatchingRecipes);
      
      // If we previously had no results for challah but now we do, show a toast
      if (prevSearchQuery.current === 'challah' && filteredRecipes.length === 0 && allMatchingRecipes.length > 0) {
        toast.success(`Found ${allMatchingRecipes.length} challah bread recipes!`);
      }
      
      prevSearchQuery.current = query;
      return;
    }
    
    // Enhanced search for other terms
    const filtered = allPosts.filter(recipe => {
      const fullText = (recipe.title + ' ' + recipe.description + ' ' + recipe.link).toLowerCase();
      
      // Direct match
      if (fullText.includes(query)) {
        return true;
      }
      
      // Related terms matching
      const relatedTermsMap: Record<string, string[]> = {
        'challah': ['braided', 'jewish', 'bread', 'egg bread', 'sabbath', 'shabbat', 'holiday', 'honey'],
        'sourdough': ['starter', 'levain', 'fermented', 'wild yeast'],
        'bagel': ['boiled', 'new york', 'jewish'],
        'brioche': ['french', 'rich', 'buttery', 'egg'],
        'focaccia': ['italian', 'flat', 'olive oil'],
        'rye': ['pumpernickel', 'deli', 'caraway'],
        'ciabatta': ['italian', 'holes', 'rustic'],
      };
      
      // Check if query is in our related terms map
      for (const [key, relatedTerms] of Object.entries(relatedTermsMap)) {
        if (query.includes(key) || key.includes(query)) {
          // Check if recipe contains any related terms
          return relatedTerms.some(term => fullText.includes(term));
        }
      }
      
      return false;
    });
    
    setFilteredRecipes(filtered);
    prevSearchQuery.current = query;
  }, [searchQuery, allPosts, posts]);
  
  // Observer setup for animations
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
    
    // Observe sections
    sectionRefs.current.forEach((el) => {
      if (el) {
        observer.observe(el);
      }
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  // Helper function to get challah recipes as fallback
  const getChallahRecipes = (): Recipe[] => {
    return [
      {
        id: 'challah-1',
        title: "Traditional Challah Bread Recipe",
        description: "A traditional Jewish bread recipe for the Sabbath and holidays with a beautiful braided pattern and rich egg dough.",
        imageUrl: "https://images.unsplash.com/photo-1603379016822-e6d5e2770ece?q=80&w=1000&auto=format&fit=crop",
        date: "2023-12-15",
        link: "https://bakinggreatbread.blog/challah-bread-recipe"
      },
      {
        id: 'challah-2',
        title: "Honey Challah Bread",
        description: "Sweetened with honey, this challah bread recipe creates a tender, flavorful loaf perfect for special occasions and holiday tables.",
        imageUrl: "https://images.unsplash.com/photo-1574085733277-851d9d856a3a?q=80&w=1000&auto=format&fit=crop",
        date: "2023-10-05",
        link: "https://bakinggreatbread.blog/honey-challah-bread"
      },
      {
        id: 'challah-3',
        title: "Sourdough Discard Challah Bread",
        description: "Use your sourdough discard to create a flavorful and beautiful braided challah bread with a subtle tang and perfect texture.",
        imageUrl: "https://images.unsplash.com/photo-1590137876181-2a5a7e340de2?q=80&w=1000&auto=format&fit=crop",
        date: "2024-01-29",
        link: "https://bakinggreatbread.blog/sourdough-discard-challah-bread"
      }
    ];
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Header Section */}
      <div ref={(el) => sectionRefs.current[0] = el}>
        <RecipesHeader 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
      </div>
      
      {/* Recipes Grid Section */}
      <div ref={(el) => sectionRefs.current[1] = el}>
        <RecipeGrid 
          isLoading={isLoading || loading}
          searchQuery={searchQuery}
          filteredRecipes={filteredRecipes}
          setSearchQuery={setSearchQuery}
        />
      </div>
      
      <div className="flex-grow"></div>
      <Footer />
      <FloatingAIButton />
    </div>
  );
};

export default Recipes;
