
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Recipe } from '@/components/recipes/RecipeCard';
import RecipesHeader from '@/components/recipes/RecipesHeader';
import RecipeGrid from '@/components/recipes/RecipeGrid';
import { useBlogPosts } from '@/services/BlogService';

const Recipes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch blog posts using the same service as the blog section
  const { posts, loading, error } = useBlogPosts();
  
  // Set up refs for animation elements
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  
  // Convert blog posts to recipes when they're loaded
  useEffect(() => {
    if (!loading && posts.length > 0) {
      const recipesFromPosts = posts.map(post => ({
        id: post.id,
        title: post.title,
        description: post.excerpt,
        imageUrl: post.imageUrl,
        date: post.date,
        link: post.link
      }));
      
      setFilteredRecipes(recipesFromPosts);
      setIsLoading(false);
    }
  }, [posts, loading]);
  
  // Filter recipes based on search query
  useEffect(() => {
    if (!posts.length) return;
    
    if (searchQuery.trim() === '') {
      const recipesFromPosts = posts.map(post => ({
        id: post.id,
        title: post.title,
        description: post.excerpt,
        imageUrl: post.imageUrl,
        date: post.date,
        link: post.link
      }));
      
      setFilteredRecipes(recipesFromPosts);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filteredPosts = posts.filter(post => 
      post.title.toLowerCase().includes(query) || 
      post.excerpt.toLowerCase().includes(query)
    );
    
    const recipesFromFilteredPosts = filteredPosts.map(post => ({
      id: post.id,
      title: post.title,
      description: post.excerpt,
      imageUrl: post.imageUrl,
      date: post.date,
      link: post.link
    }));
    
    setFilteredRecipes(recipesFromFilteredPosts);
  }, [searchQuery, posts]);
  
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
      if (el) observer.observe(el);
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
