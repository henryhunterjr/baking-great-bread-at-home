
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RecipeCard, { Recipe } from '@/components/recipes/RecipeCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Sample recipes data
const recipesData: Recipe[] = [
  {
    id: '1',
    title: 'Sourdough Discard Pretzels',
    description: 'A resourceful way to use your sourdough discard, these pretzels are chewy, flavorful, and perfect for snacking.',
    imageUrl: 'https://images.unsplash.com/photo-1583302355372-a9dee721efe9?q=80&w=1000&auto=format&fit=crop',
    date: 'February 2, 2024',
    link: 'https://bakinggreatbread.blog/2024/02/02/sourdough-discard-pretzels/',
  },
  {
    id: '2',
    title: 'Homemade Multigrain Bread',
    description: 'A hearty and nutritious multigrain bread that\'s perfect for sandwiches or toasting.',
    imageUrl: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?q=80&w=1000&auto=format&fit=crop',
    date: 'February 2, 2024',
    link: 'https://bakinggreatbread.blog/2024/02/02/homemade-multigrain-bread/',
  },
  {
    id: '3',
    title: 'Traditional No-Knead Sourdough',
    description: 'A braided bread with a beautifully open crumb and deep flavor.',
    imageUrl: 'https://images.unsplash.com/photo-1585478259715-1c195ae2b568?q=80&w=1000&auto=format&fit=crop',
    date: 'January 29, 2024',
    link: 'https://bakinggreatbread.blog/2024/01/29/sourdough-discard-challah-bread/',
  },
  {
    id: '4',
    title: 'Sourdough Discard Coffee Cake',
    description: 'A moist and flavorful coffee cake that uses up your sourdough discard.',
    imageUrl: 'https://images.unsplash.com/photo-1597403491447-3ab08f8e44dc?q=80&w=1000&auto=format&fit=crop',
    date: 'January 29, 2024',
    link: 'https://bakinggreatbread.blog/2024/01/29/sourdough-discard-coffee-cake/',
  },
  {
    id: '5',
    title: 'Baking Science Behind Crusty Breads',
    description: 'An in-depth look at the science behind achieving perfectly crusty bread.',
    imageUrl: 'https://images.unsplash.com/photo-1603135008591-d90e082c1bef?q=80&w=1000&auto=format&fit=crop',
    date: 'January 22, 2024',
    link: 'https://bakinggreatbread.blog/2024/01/22/baking-science-behind-crusty-breads/',
  },
  {
    id: '6',
    title: 'The Ultimate Dinner Rolls',
    description: 'Soft, fluffy dinner rolls that will elevate any meal.',
    imageUrl: 'https://images.unsplash.com/photo-1597895139270-a5408f35d17a?q=80&w=1000&auto=format&fit=crop',
    date: 'December 23, 2023',
    link: 'https://bakinggreatbread.blog/2023/12/23/the-ultimate-dinner-rolls/',
  },
  {
    id: '7',
    title: 'Honey-Foolproof Sourdough Loaf',
    description: 'A reliable and easy sourdough recipe with a touch of sweetness from honey.',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
    date: 'December 20, 2023',
    link: 'https://bakinggreatbread.blog/2023/12/20/honey-foolproof-sourdough-loaf/',
  },
  {
    id: '8',
    title: 'Cardamom-Infused Cinnamon Rolls',
    description: 'Indulgent cinnamon rolls with a unique cardamom twist.',
    imageUrl: 'https://images.unsplash.com/photo-1673698934271-4cb674032c4b?q=80&w=1000&auto=format&fit=crop',
    date: 'December 19, 2023',
    link: 'https://bakinggreatbread.blog/2023/12/19/cardamom-infused-cinnamon-rolls/',
  },
  {
    id: '9',
    title: 'Cardamom-Infused Cinnamon Knots',
    description: 'Soft and subtly spiced, these cinnamon knots have a delightful cardamom flavor.',
    imageUrl: 'https://images.unsplash.com/photo-1568254183919-f9b136cc5710?q=80&w=1000&auto=format&fit=crop',
    date: 'December 12, 2023',
    link: 'https://bakinggreatbread.blog/2023/12/12/cardamom-infused-cinnamon-knots/',
  },
  {
    id: '10',
    title: 'Homemade White Sandwich Bread',
    description: 'A classic recipe for soft, fluffy white sandwich bread that\'s perfect for everyday use.',
    imageUrl: 'https://images.unsplash.com/photo-1586444248879-bc604cbd555a?q=80&w=1000&auto=format&fit=crop',
    date: 'November 28, 2023',
    link: 'https://bakinggreatbread.blog/2023/11/28/homemade-white-sandwich-bread/',
  },
  {
    id: '11',
    title: 'Hermes Crusty White Bread',
    description: 'A detailed walkthrough of creating a rustic, crusty white bread with incredible flavor.',
    imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?q=80&w=1000&auto=format&fit=crop',
    date: 'November 21, 2023',
    link: 'https://bakinggreatbread.blog/2023/11/21/hermes-crusty-white-bread/',
  },
  {
    id: '12',
    title: 'Homemade Hoagie Rolls',
    description: 'Soft and sturdy hoagie rolls perfect for sandwiches and subs.',
    imageUrl: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?q=80&w=1000&auto=format&fit=crop',
    date: 'November 20, 2023',
    link: 'https://bakinggreatbread.blog/2023/11/20/homemade-hoagie-rolls-recipe/',
  },
];

// RecipeCardSkeleton for loading state
const RecipeCardSkeleton = () => (
  <div className="rounded-lg border border-bread-100 overflow-hidden h-full flex flex-col">
    <div className="aspect-video">
      <Skeleton className="h-full w-full" />
    </div>
    <div className="p-6 flex-grow">
      <Skeleton className="h-4 w-24 mb-3" />
      <Skeleton className="h-6 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-6" />
      <Skeleton className="h-4 w-32 mt-auto" />
    </div>
  </div>
);

const Recipes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(recipesData);
  const [isLoading, setIsLoading] = useState(true);
  
  // Set up refs for animation elements
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  
  // Simulate loading for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter recipes based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRecipes(recipesData);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const results = recipesData.filter(recipe => 
      recipe.title.toLowerCase().includes(query) || 
      recipe.description.toLowerCase().includes(query)
    );
    
    setFilteredRecipes(results);
  }, [searchQuery]);
  
  // Observer setup for animations
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    };
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe sections
    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Header Section */}
      <section 
        ref={(el) => sectionRefs.current[0] = el}
        className="pt-32 pb-16 md:pt-40 md:pb-20 opacity-0"
      >
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
      
      {/* Recipes Grid Section */}
      <section 
        ref={(el) => sectionRefs.current[1] = el}
        className="pb-20 opacity-0"
      >
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
                We couldn't find any recipes matching your search. Try using different keywords or browse our popular categories below.
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
      
      <div className="flex-grow"></div>
      <Footer />
    </div>
  );
};

export default Recipes;
