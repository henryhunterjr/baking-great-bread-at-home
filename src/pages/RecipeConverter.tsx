
import React from 'react';
import { useRecipeConverter } from '@/hooks/use-recipe-converter';
import Navbar from '@/components/Navbar';
import RecipeConverterHeader from '@/components/recipe-converter/RecipeConverterHeader';
import RecipeConverterContent from '@/components/recipe-converter/RecipeConverterContent';
import RecipeConverterSidebar from '@/components/recipe-converter/RecipeConverterSidebar';
import RecipeConverterNav from '@/components/recipe-converter/RecipeConverterNav';

// Export RecipeData type here so other files can import it from this file
// This maintains backward compatibility with existing code
export type { RecipeData } from '@/types/recipeTypes';

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
  
  // Function to handle going back to home/start
  const handleStartOver = () => {
    // Reset the recipe state
    resetRecipe();
    // Navigate to the first tab
    setActiveTab('convert');
    // Navigate to top of page
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="min-h-screen pb-12">
      <Navbar />

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
              onConversionComplete={handleConversionComplete}
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
