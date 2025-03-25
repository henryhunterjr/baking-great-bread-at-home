import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Apple, PanelRight, BarChart2, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AppPromoSectionProps {
  sectionRef: React.RefObject<HTMLElement>;
}

const AppPromoSection: React.FC<AppPromoSectionProps> = ({ sectionRef }) => {
  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-bread-50 dark:bg-bread-900/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="order-2 md:order-1">
              <Badge variant="tool" className="mb-4 text-sm px-3 py-1">Digital Tools</Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4">
                Crust & Crumb App
              </h2>
              <p className="text-muted-foreground mb-6 dark:text-white">
                Track your baking journey with precision using our dedicated app. From recipe management to fermentation timing, it's your perfect baking companion.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <PanelRight className="h-6 w-6 text-bread-800 dark:text-bread-400 mt-1" />
                  <div>
                    <h3 className="font-serif text-lg font-medium">Recipe Management</h3>
                    <p className="text-muted-foreground dark:text-white">Store and organize all your bread recipes with notes and adjustments.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <BarChart2 className="h-6 w-6 text-bread-800 dark:text-bread-400 mt-1" />
                  <div>
                    <h3 className="font-serif text-lg font-medium">Baking Analytics</h3>
                    <p className="text-muted-foreground dark:text-white">Track your progress and see patterns in your baking success over time.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-6 w-6 text-bread-800 dark:text-bread-400 mt-1" />
                  <div>
                    <h3 className="font-serif text-lg font-medium">Fermentation Timer</h3>
                    <p className="text-muted-foreground dark:text-white">Perfect timing tools for bulk fermentation, proofing, and baking.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Star className="h-6 w-6 text-bread-800 dark:text-bread-400 mt-1" />
                  <div>
                    <h3 className="font-serif text-lg font-medium">Community Features</h3>
                    <p className="text-muted-foreground dark:text-white">Share your bread, get feedback, and connect with fellow bakers.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button asChild className="bg-bread-800 hover:bg-bread-900 text-white">
                  <Link to="/app">
                    Learn More
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-bread-200 text-bread-800 hover:bg-bread-50 dark:border-bread-700 dark:text-white dark:hover:bg-bread-800">
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Apple className="mr-2 h-4 w-4" />
                    Download App
                  </a>
                </Button>
              </div>
            </div>
            
            <div className="order-1 md:order-2 relative">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl relative">
                <img 
                  src="/lovable-uploads/517ac596-6d3e-4c03-a1e5-f4348c47cca1.png"
                  alt="Crust & Crumb App Interface showing recipe management screen"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 rounded-full bg-bread-100 dark:bg-bread-800 p-3 shadow-lg animate-float hidden md:block">
                <img 
                  src="/lovable-uploads/9617c8fa-0274-4499-9a97-ef063adb2d83.png"
                  alt="App icon"
                  className="w-20 h-20 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppPromoSection;
