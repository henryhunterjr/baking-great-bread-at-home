
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Recipe } from '@/components/recipes/RecipeCard';
import RecipesHeader from '@/components/recipes/RecipesHeader';
import RecipeGrid from '@/components/recipes/RecipeGrid';
import { useBlogPosts } from '@/services/BlogService';
import BlogService from '@/services/BlogService';

const Recipes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allPosts, setAllPosts] = useState<Recipe[]>([]);
  
  // Fetch blog posts using the service
  const { posts, loading, error } = useBlogPosts();
  
  // Set up refs for animation elements
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  
  // Fetch all posts directly using the service instance to ensure we get everything
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const blogService = BlogService.getInstance();
        const allBlogPosts = await blogService.getPosts();
        
        // Convert blog posts to recipes
        const recipesFromAllPosts = allBlogPosts.map(post => ({
          id: post.id,
          title: post.title,
          description: post.excerpt,
          imageUrl: post.imageUrl,
          date: post.date,
          link: post.link
        }));
        
        setAllPosts(recipesFromAllPosts);
        setFilteredRecipes(recipesFromAllPosts);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching all blog posts:", err);
        // Fallback to the posts from the hook if direct fetching fails
        if (posts.length > 0) {
          const recipesFromPosts = posts.map(post => ({
            id: post.id,
            title: post.title,
            description: post.excerpt,
            imageUrl: post.imageUrl,
            date: post.date,
            link: post.link
          }));
          
          setAllPosts(recipesFromPosts);
          setFilteredRecipes(recipesFromPosts);
        }
        setIsLoading(false);
      }
    };
    
    fetchAllPosts();
  }, []);
  
  // Filter recipes based on search query
  useEffect(() => {
    if (allPosts.length === 0) return;
    
    if (searchQuery.trim() === '') {
      setFilteredRecipes(allPosts);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = allPosts.filter(recipe => 
      recipe.title.toLowerCase().includes(query) || 
      recipe.description.toLowerCase().includes(query)
    );
    
    setFilteredRecipes(filtered);
  }, [searchQuery, allPosts]);
  
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
        el.classList.add('opacity-0');
        observer.observe(el);
      }
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
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
    </div>
  );
};

export default Recipes;
