
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  heroRef: React.RefObject<HTMLDivElement>;
}

const HeroSection: React.FC<HeroSectionProps> = ({ heroRef }) => {
  return (
    <section 
      ref={heroRef} 
      className="pt-32 pb-20 md:pt-40 md:pb-28 opacity-0 bg-bread-950"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="flex justify-center lg:justify-start">
                <span className="inline-block text-xs font-medium tracking-wider uppercase py-1 px-4 rounded-full bg-bread-800/80 text-bread-100">
                  ARTISANAL BAKING
                </span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-tight text-white">
                Master the Art of<br />
                <span className="text-bread-400">Baking Great<br />Bread</span><br />
                <span className="text-white">at Home</span>
              </h1>
              <p className="text-bread-200 text-lg max-w-md mx-auto lg:mx-0">
                Join Henry's community of passionate home bakers 
                and discover the simple joy of creating artisanal 
                bread with your own hands.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  className="bg-bread-100 hover:bg-bread-200 text-bread-950 border-bread-300"
                >
                  Explore Recipes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-bread-700 text-bread-100 hover:bg-bread-800 hover:border-bread-600"
                >
                  Join Community
                </Button>
              </div>
            </div>
            <div className="hero-image-container">
              <img 
                src="/lovable-uploads/f054575c-8d92-407f-bbeb-ee58654105ed.png" 
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
