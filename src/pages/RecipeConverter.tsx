
import React, { useEffect } from 'react';
import { useRecipeConverter } from '@/hooks/use-recipe-converter';
import RecipeConverterHeader from '@/components/recipe-converter/RecipeConverterHeader';
import RecipeConverterContent from '@/components/recipe-converter/RecipeConverterContent';
import RecipeConverterSidebar from '@/components/recipe-converter/RecipeConverterSidebar';
import RecipeConverterNav from '@/components/recipe-converter/RecipeConverterNav';
import { useLocation } from 'react-router-dom';
import { RecipeData } from '@/types/unifiedRecipe';

// Export RecipeData type to maintain backward compatibility
export type { RecipeData } from '@/types/unifiedRecipe';

const RecipeConverter: React.FC = () => {
  const {
    recipe,
    setRecipe,
    isEditing,
    setIsEditing,
    showConversionSuccess,
    activeTab,
    setActiveTab,
    handleConversionComplete,
    handleSaveRecipe,
    handleSelectSavedRecipe,
    resetRecipe,
    conversionError
  } = useRecipeConverter();
  
  const location = useLocation();
  
  // Handle incoming recipe data from navigation state or session storage
  useEffect(() => {
    // Check for recipe in location state first (from navigation)
    if (location.state?.recipe) {
      console.log("Recipe received from navigation:", location.state.recipe);
      setRecipe(location.state.recipe);
      setIsEditing(true);
      return;
    }
    
    // Then check session storage (for page refreshes)
    const storedRecipe = sessionStorage.getItem('viewedRecipe');
    if (storedRecipe) {
      try {
        const parsedRecipe = JSON.parse(storedRecipe);
        console.log("Recipe loaded from session storage:", parsedRecipe);
        setRecipe(parsedRecipe);
        setIsEditing(true);
        // Clear session storage after loading to prevent reloads
        sessionStorage.removeItem('viewedRecipe');
      } catch (error) {
        console.error("Error parsing stored recipe:", error);
      }
    }
  }, [location.state, setRecipe, setIsEditing]);
  
  // Function to handle going back to home/start
  const handleStartOver = () => {
    // Reset the recipe state
    resetRecipe();
    // Navigate to the first tab
    setActiveTab('convert');
    // Navigate to top of page
    window.scrollTo(0, 0);
  };
  
  // Create a wrapper function to handle the text conversion
  const handleConversion = (text: string) => {
    // We need to call handleConversionComplete with a string parameter
    // The actual conversion from text to RecipeData happens within the hook
    handleConversionComplete(text);
  };
  
  return (
    <div className="min-h-screen pb-12">
      <div className="container max-w-6xl mt-24 md:mt-28">
        <RecipeConverterHeader />
        <RecipeConverterNav />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RecipeConverterContent 
              recipe={recipe}
              isEditing={isEditing}
              showConversionSuccess={showConversionSuccess}
              onSetIsEditing={setIsEditing}
              onConversionComplete={handleConversion}
              onSaveRecipe={handleSaveRecipe}
              onResetRecipe={handleStartOver}
              updateRecipe={setRecipe}
              conversionError={conversionError}
            />
          </div>
          
          <div>
            <RecipeConverterSidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              recipe={recipe}
              onSelectRecipe={handleSelectSavedRecipe}
              isEditing={isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeConverter;
