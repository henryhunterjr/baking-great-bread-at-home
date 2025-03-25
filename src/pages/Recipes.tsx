
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RecipesHeader from '@/components/recipes/RecipesHeader';
import RecipeGrid from '@/components/recipes/RecipeGrid';
import { useRecipes } from '@/hooks/use-recipes';
import RecipeAnimationWrapper from '@/components/recipes/RecipeAnimationWrapper';
import FloatingAIButton from '@/components/ai/FloatingAIButton';

const Recipes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const { filteredRecipes: allFilteredRecipes, isLoading } = useRecipes(searchQuery);
  
  // Filter recipes by type if a type is selected
  const filteredRecipes = selectedType 
    ? allFilteredRecipes.filter(recipe => {
        // Check if recipe has tags and if any tag matches the selected type
        const typeMatches = recipe.tags?.some(tag => 
          tag.toLowerCase() === selectedType.toLowerCase()) || false;
          
        // Check title and description for type keywords to increase matches
        const titleContainsType = recipe.title.toLowerCase().includes(selectedType.toLowerCase());
        const descriptionContainsType = recipe.description.toLowerCase().includes(selectedType.toLowerCase());
          
        return typeMatches || titleContainsType || descriptionContainsType;
      })
    : allFilteredRecipes;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <RecipeAnimationWrapper>
        {/* Header Section */}
        <RecipesHeader 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />
        
        {/* Recipes Grid Section */}
        <RecipeGrid 
          isLoading={isLoading}
          searchQuery={searchQuery}
          filteredRecipes={filteredRecipes}
          setSearchQuery={setSearchQuery}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />
      </RecipeAnimationWrapper>
      
      <div className="flex-grow"></div>
      <Footer />
      <FloatingAIButton />
    </div>
  );
};

export default Recipes;
