
import React from 'react';
import { useRecipeConverter } from '@/hooks/use-recipe-converter';
import Navbar from '@/components/Navbar';
import RecipeConverterHeader from '@/components/recipe-converter/RecipeConverterHeader';
import RecipeConverterContent from '@/components/recipe-converter/RecipeConverterContent';
import RecipeConverterSidebar from '@/components/recipe-converter/RecipeConverterSidebar';

// Export RecipeData type here so other files can import it from this file
// This maintains backward compatibility with existing code
export type { RecipeData } from '@/types/recipeTypes';

const RecipeConverter: React.FC = () => {
  const {
    recipe,
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
  
  return (
    <div className="min-h-screen pb-12">
      <Navbar />

      <div className="container max-w-6xl mt-24 md:mt-28">
        <RecipeConverterHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RecipeConverterContent 
              recipe={recipe}
              isEditing={isEditing}
              showConversionSuccess={showConversionSuccess}
              onSetIsEditing={setIsEditing}
              onConversionComplete={handleConversionComplete}
              onSaveRecipe={handleSaveRecipe}
              onResetRecipe={resetRecipe}
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
