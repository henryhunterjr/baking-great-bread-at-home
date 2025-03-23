
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface RecipesHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const RecipesHeader = ({ searchQuery, setSearchQuery }: RecipesHeaderProps) => {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-20 opacity-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block text-xs font-medium tracking-wider uppercase py-1 px-3 border border-bread-200 rounded-full text-bread-800 bg-bread-50 mb-6 dark:bg-bread-800 dark:text-white dark:border-bread-700">
            RECIPES
          </span>
          <h1 className="section-title text-4xl md:text-5xl font-serif font-medium mb-4">
            Explore Our Bread Recipes
          </h1>
          <p className="section-subtitle text-xl text-muted-foreground">
            From beginner-friendly to artisan techniques.
          </p>
          <img 
            src="/lovable-uploads/a1b2c671-db0a-4699-9e70-ac6f138b43f1.png" 
            alt="Bread Recipes Collection" 
            className="mx-auto mt-6 max-h-32 object-contain"
          />
        </div>
        
        {/* Search and Filter */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search for recipes, techniques, or ingredients..."
                className="pl-10 py-6 h-auto border-bread-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              className="border-bread-200 text-bread-800 h-auto w-full sm:w-auto aspect-square sm:aspect-auto px-4"
            >
              <Filter className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecipesHeader;
