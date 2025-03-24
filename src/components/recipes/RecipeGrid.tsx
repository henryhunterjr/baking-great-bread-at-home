
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RecipeCard from '@/components/recipes/RecipeCard';
import RecipeCardSkeleton from '@/components/recipes/RecipeCardSkeleton';
import { Recipe } from '@/components/recipes/types';

interface RecipeGridProps {
  isLoading: boolean;
  searchQuery: string;
  filteredRecipes: Recipe[];
  setSearchQuery: (query: string) => void;
}

const RecipeGrid = ({ isLoading, searchQuery, filteredRecipes, setSearchQuery }: RecipeGridProps) => {
  const resultText = searchQuery 
    ? filteredRecipes.length === 0 
      ? 'No recipes found for' 
      : filteredRecipes.length === 1
        ? '1 recipe found for'
        : `${filteredRecipes.length} recipes found for`
    : '';

  return (
    <section className="pb-20" aria-label="Recipe results">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {searchQuery && (
          <div className="mb-8 text-center">
            <h2 className="text-xl font-serif" id="search-results">
              {resultText}
              <span className="font-medium text-bread-800 dark:text-bread-300"> "{searchQuery}"</span>
            </h2>
          </div>
        )}
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" aria-busy="true" aria-label="Loading recipes">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <RecipeCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredRecipes.length > 0 ? (
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
            aria-label={`Recipe grid with ${filteredRecipes.length} recipes`}
          >
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 max-w-lg mx-auto" aria-live="polite">
            <h3 className="font-serif text-xl mb-2">No Recipes Found</h3>
            <p className="text-muted-foreground mb-6">
              We couldn't find any recipes matching your search. Try using different keywords or browse our blog for more content.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setSearchQuery('')}
              className="border-bread-200 text-bread-800 hover:bg-bread-100"
              aria-label="View all recipes"
            >
              View All Recipes
            </Button>
          </div>
        )}
        
        {/* View More Link - if more recipes are available */}
        {!searchQuery && filteredRecipes.length > 0 && (
          <div className="text-center mt-16">
            <a 
              href="/blog" 
              className="inline-flex items-center text-bread-800 font-medium hover:underline transition-all duration-300 hover:translate-x-1"
              aria-label="View more recipes on our blog"
            >
              View more recipes on our blog
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecipeGrid;
