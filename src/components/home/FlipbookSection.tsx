
import React from 'react';
import { Button } from '@/components/ui/button';
import { Book, ExternalLink } from 'lucide-react';

interface FlipbookSectionProps {
  sectionRef: React.RefObject<HTMLElement>;
}

const FlipbookSection: React.FC<FlipbookSectionProps> = ({ sectionRef }) => {
  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-white dark:bg-bread-950/30 opacity-0">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-bread-100/50 dark:bg-bread-900/50 rounded-lg p-8 md:p-12 shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Left side - Preview image */}
              <div className="w-full md:w-1/2">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src="/lovable-uploads/30b3084a-0b08-41e0-ad8d-a160bedbf123.png"
                    alt="Baking Essentials Flipbook" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
              </div>
              
              {/* Right side - Content */}
              <div className="w-full md:w-1/2 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-serif mb-4 text-bread-900 dark:text-bread-50">
                  Baking Essentials Guide
                </h2>
                <p className="text-lg mb-6 text-bread-700 dark:text-bread-200">
                  New to bread baking? This comprehensive guide covers everything you need to know to get started. 
                  Discover the must-have tools, learn essential techniques, and understand what equipment you really need 
                  – and what can wait until later.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button
                    size="lg"
                    className="bg-bread-700 hover:bg-bread-800 text-white"
                    onClick={() => window.open('https://heyzine.com/flip-book/b821d79d0c.html', '_blank')}
                  >
                    <Book className="mr-2 h-5 w-5" />
                    Open Guide
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-bread-200 text-bread-700 hover:bg-bread-50 dark:border-bread-700 dark:text-bread-200 dark:hover:bg-bread-800/50"
                    onClick={() => window.open('https://heyzine.com/flip-book/b821d79d0c.html', '_blank')}
                  >
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Full Screen View
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlipbookSection;

