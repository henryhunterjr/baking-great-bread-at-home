
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RecipeCard, { Recipe } from '@/components/recipes/RecipeCard';
import RecipeCardSkeleton from '@/components/recipes/RecipeCardSkeleton';

interface RecipeGridProps {
  isLoading: boolean;
  searchQuery: string;
  filteredRecipes: Recipe[];
  setSearchQuery: (query: string) => void;
}

const RecipeGrid = ({ isLoading, searchQuery, filteredRecipes, setSearchQuery }: RecipeGridProps) => {
  return (
    <section className="pb-20 opacity-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {searchQuery && (
          <div className="mb-8 text-center">
            <h2 className="text-xl font-serif">
              {filteredRecipes.length === 0 
                ? 'No recipes found for' 
                : filteredRecipes.length === 1
                  ? '1 recipe found for'
                  : `${filteredRecipes.length} recipes found for`} 
              <span className="font-medium text-bread-800"> "{searchQuery}"</span>
            </h2>
          </div>
        )}
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <RecipeCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 max-w-lg mx-auto">
            <h3 className="font-serif text-xl mb-2">No Recipes Found</h3>
            <p className="text-muted-foreground mb-6">
              We couldn't find any recipes matching your search. Try using different keywords or browse our blog for more content.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setSearchQuery('')}
              className="border-bread-200 text-bread-800"
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
              className="inline-flex items-center text-bread-800 font-medium hover:underline"
            >
              View more recipes on our blog
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecipeGrid;
