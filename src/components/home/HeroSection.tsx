
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
      className="pt-32 pb-20 md:pt-40 md:pb-28 opacity-0"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              <span className="inline-block text-xs font-medium tracking-wider uppercase py-1 px-3 border border-bread-200 rounded-full text-bread-800 bg-bread-50">
                Artisanal Baking
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-tight">
                Master the Art of <br />
                <span className="text-bread-800">Baking Great Bread</span>
                <br /> at Home
              </h1>
              <p className="text-muted-foreground text-lg max-w-md">
                Join Henry's community of passionate home bakers and discover the simple joy of creating artisanal bread with your own hands.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-bread-800 hover:bg-bread-900 text-white"
                >
                  Explore Recipes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-bread-200 text-bread-800 hover:bg-bread-50"
                >
                  Join Community
                </Button>
              </div>
            </div>
            <div className="hero-image-container">
              <img 
                src="/lovable-uploads/ecf6ed85-89c2-44ae-97ef-35087b9b3b16.png" 
                alt="Cross-section of artisan sourdough bread showing open crumb structure" 
                className="hero-image rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
