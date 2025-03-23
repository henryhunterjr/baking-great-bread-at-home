
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="py-20 md:py-28 lg:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="section-title mb-6">
            Learn the Art & Science of Baking Perfect Bread at Home
          </h1>
          <p className="section-subtitle mb-8">
            Discover techniques, recipes, and tools that will help you create bakery-quality bread in your own kitchen, no matter your experience level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link to="/books">Explore Guides</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/challenges">Join a Challenge</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
