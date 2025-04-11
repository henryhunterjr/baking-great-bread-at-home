
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  heroRef: React.RefObject<HTMLDivElement>;
}

const HeroSection: React.FC<HeroSectionProps> = ({ heroRef }) => {
  return (
    <section 
      ref={heroRef} 
      className="pt-16 pb-12 md:pt-24 md:pb-20 opacity-0"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="space-y-4 md:space-y-6">
              <span className="inline-block text-xs font-medium tracking-wider uppercase py-1 px-3 border border-bread-200 rounded-full text-bread-800 bg-bread-50 dark:bg-bread-800 dark:text-white dark:border-bread-700">
                Artisanal Baking
              </span>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium leading-tight">
                Master the Art of <br />
                <span className="text-bread-800">Baking Great Bread</span>
                <br /> at Home
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-md">
                Join me in my community of passionate home bakers and discover the simple joy of creating artisanal bread with your own hands.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-bread-800 hover:bg-bread-900 text-white"
                  asChild
                >
                  <Link to="/recipes">
                    Explore Recipes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-bread-200 text-bread-800 hover:bg-bread-50 dark:border-bread-700 dark:text-gray-300 dark:hover:bg-bread-800"
                >
                  Join Community
                </Button>
              </div>
            </div>
            <div className="hero-image-container mt-6 md:mt-0">
              <img 
                src="/lovable-uploads/ecf6ed85-89c2-44ae-97ef-35087b9b3b16.png" 
                alt="Cross-section of artisan sourdough bread showing open crumb structure" 
                className="hero-image rounded-lg shadow-xl"
                loading="eager"
                fetchpriority="high"
                decoding="async"
                width="600" 
                height="400"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?q=80&w=1000&auto=format&fit=crop";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
