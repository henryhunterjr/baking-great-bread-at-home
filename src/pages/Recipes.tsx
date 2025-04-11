
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RecipesHeader from '@/components/recipes/RecipesHeader';
import RecipeGrid from '@/components/recipes/RecipeGrid';
import { useRecipes } from '@/hooks/use-recipes';
import RecipeAnimationWrapper from '@/components/recipes/RecipeAnimationWrapper';
import FloatingAIButton from '@/components/ai/FloatingAIButton';
import ErrorAlert from '@/components/common/ErrorAlert';
import { logError, logInfo } from '@/utils/logger';

const Recipes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Use the recipes hook with error handling
  const { filteredRecipes: allFilteredRecipes, isLoading, error } = useRecipes(searchQuery);
  
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
  
  // Handle errors from the useRecipes hook
  useEffect(() => {
    if (error) {
      logError('Error in Recipes page', { error });
      setHasError(true);
      setErrorMessage(error.message || 'Failed to load recipes. Please try again.');
    } else {
      setHasError(false);
      setErrorMessage('');
    }
  }, [error]);

  // Log worker status when component mounts
  useEffect(() => {
    const checkWorkerStatus = async () => {
      try {
        // Check if PDF worker is available
        const workerPaths = [
          '/pdf.worker.min.js',
          '/assets/pdf.worker.min.js',
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
        ];
        
        for (const path of workerPaths) {
          try {
            const response = await fetch(path, { method: 'HEAD' });
            if (response.ok) {
              logInfo(`PDF worker available at: ${path}`);
              break;
            }
          } catch (e) {
            // Continue to next path
          }
        }
      } catch (e) {
        // Ignore errors in this diagnostic check
      }
    };
    
    checkWorkerStatus();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <RecipeAnimationWrapper>
        {/* Display any errors */}
        {hasError && (
          <div className="container mx-auto px-4 py-2">
            <ErrorAlert 
              error={errorMessage} 
              title="Error Loading Recipes"
              solution="The recipes are still available in your local storage. We've automatically switched to offline mode." 
            />
          </div>
        )}
        
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
