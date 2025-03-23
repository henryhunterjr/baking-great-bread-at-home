
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RecipesHeader from '@/components/recipes/RecipesHeader';
import RecipeGrid from '@/components/recipes/RecipeGrid';
import { useRecipes } from '@/hooks/use-recipes';
import RecipeAnimationWrapper from '@/components/recipes/RecipeAnimationWrapper';
import FloatingAIButton from '@/components/ai/FloatingAIButton';

const Recipes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { filteredRecipes, isLoading } = useRecipes(searchQuery);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <RecipeAnimationWrapper>
        {/* Header Section */}
        <RecipesHeader 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        
        {/* Recipes Grid Section */}
        <RecipeGrid 
          isLoading={isLoading}
          searchQuery={searchQuery}
          filteredRecipes={filteredRecipes}
          setSearchQuery={setSearchQuery}
        />
      </RecipeAnimationWrapper>
      
      <div className="flex-grow"></div>
      <Footer />
      <FloatingAIButton />
    </div>
  );
};

export default Recipes;
