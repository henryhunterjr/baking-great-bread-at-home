
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AppPromoSectionProps {
  sectionRef: React.RefObject<HTMLElement>;
}

const AppPromoSection: React.FC<AppPromoSectionProps> = ({ sectionRef }) => {
  return (
    <section 
      ref={sectionRef}
      className="py-20 opacity-0"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-bread-50 to-cream-100 border border-bread-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="p-8 md:p-12 lg:p-16">
              <img 
                src="/lovable-uploads/57ca7c7a-c958-4126-b81f-4bbf30028a7f.png" 
                alt="Baking Great Bread at Home Logo" 
                className="w-40 h-auto mb-6"
              />
              <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4">
                Crust & Crumb App
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                Our intuitive baking calculator helps you scale recipes, convert measurements, and adjust hydration levels with ease.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="rounded-full bg-bread-100 p-1 mr-3 mt-1">
                    <svg className="h-3 w-3 text-bread-800" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm">Precise recipe scaling for any batch size</span>
                </li>
                <li className="flex items-start">
                  <div className="rounded-full bg-bread-100 p-1 mr-3 mt-1">
                    <svg className="h-3 w-3 text-bread-800" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm">Instant unit conversions between metric and imperial</span>
                </li>
                <li className="flex items-start">
                  <div className="rounded-full bg-bread-100 p-1 mr-3 mt-1">
                    <svg className="h-3 w-3 text-bread-800" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm">Hydration calculator for perfect dough consistency</span>
                </li>
              </ul>
              <Button 
                size="lg" 
                className="bg-bread-800 hover:bg-bread-900 text-white"
                asChild
              >
                <Link to="/app">
                  Download Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="flex justify-center p-8">
              <img 
                src="/lovable-uploads/0194d34b-b540-4a18-97b8-bcede6d0c4fe.png" 
                alt="Crust & Crumb App" 
                className="max-w-full h-auto rounded-xl shadow-xl animate-float"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppPromoSection;
