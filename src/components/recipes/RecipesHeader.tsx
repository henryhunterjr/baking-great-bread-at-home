
import React from 'react';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import RecipeTypeFilter from './RecipeTypeFilter';
import { FeatureTooltip } from '@/components/onboarding/FeatureTooltip';

interface RecipesHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
}

const RecipesHeader = ({ 
  searchQuery, 
  setSearchQuery,
  selectedType,
  setSelectedType
}: RecipesHeaderProps) => {
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic will trigger the search through parent state change
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
  };
  
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <span className="inline-block text-xs font-medium tracking-wider uppercase py-1 px-3 border border-bread-200 rounded-full text-bread-800 bg-bread-50 mb-6 dark:bg-bread-800 dark:text-white dark:border-bread-700">
            RECIPES
          </span>
          <h1 className="section-title text-4xl md:text-5xl font-serif font-medium mb-4">
            Explore Our Bread Recipes
          </h1>
          <p className="section-subtitle text-xl text-muted-foreground">
            From beginner-friendly to artisan techniques.
          </p>
          
          <div className="max-w-md mx-auto mt-6 mb-8">
            <AspectRatio ratio={3/1} className="bg-muted rounded-md overflow-hidden">
              <img 
                src="/lovable-uploads/77d45fd7-1b83-40ba-a929-5b311d18a9ad.png" 
                alt="Rustic baking scene with wooden mixing bowl, flour, and recipe book" 
                className="w-full h-full object-cover object-center"
                loading="lazy"
                width="600"
                height="200"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop";
                }}
              />
            </AspectRatio>
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="max-w-2xl mx-auto mb-16 recipe-converter-panel">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <FeatureTooltip
              id="recipe-search-tooltip"
              content="Search for recipes by name, ingredient, or type. Press Enter or click Search to find matching recipes."
              side="bottom"
              showIcon={false}
            >
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" aria-hidden="true" />
                <Input
                  type="search"
                  placeholder="Search for recipes, techniques, or ingredients..."
                  className="pl-10 pr-16 py-6 h-auto border-bread-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search recipes"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-12 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <div className="p-1 hover:bg-muted rounded-full">
                      <span className="sr-only">Clear search</span>
                      <Search className="h-4 w-4" />
                    </div>
                  </button>
                )}
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span className="sr-only">Search</span>
                </Button>
              </div>
            </FeatureTooltip>
            <RecipeTypeFilter 
              selectedType={selectedType}
              setSelectedType={setSelectedType}
            />
          </form>
        </div>
      </div>
    </section>
  );
};

export default RecipesHeader;

