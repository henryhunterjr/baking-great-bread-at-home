
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface RecipesHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const RecipesHeader = ({ searchQuery, setSearchQuery }: RecipesHeaderProps) => {
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
                src="/lovable-uploads/8d2c0e57-1ea7-49b7-862c-3a2e056b5f05.png" 
                alt="Recipe Revue - Your recipes beautifully transformed" 
                className="w-full h-full object-cover object-center object-[center_top]"
                loading="lazy"
                width="600"
                height="200"
              />
            </AspectRatio>
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" aria-hidden="true" />
              <Input
                type="search"
                placeholder="Search for recipes, techniques, or ingredients..."
                className="pl-10 py-6 h-auto border-bread-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search recipes"
              />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              className="border-bread-200 text-bread-800 h-auto w-full sm:w-auto aspect-square sm:aspect-auto px-4 transition-all duration-300 hover:bg-bread-100 hover:border-bread-300"
              aria-label="Filter recipes"
            >
              <Filter className="h-4 w-4 sm:mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecipesHeader;
