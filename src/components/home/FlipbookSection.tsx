
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
                    src="/lovable-uploads/f0ad0c4f-e5f5-4e6a-90b0-9bc1d341874b.png"
                    alt="Flipbook Preview" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
              </div>
              
              {/* Right side - Content */}
              <div className="w-full md:w-1/2 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-serif mb-4 text-bread-900 dark:text-bread-50">
                  Interactive Bread Guide
                </h2>
                <p className="text-lg mb-6 text-bread-700 dark:text-bread-200">
                  Explore our comprehensive bread baking guide in an interactive flipbook format. Learn techniques, discover recipes, and master the art of bread making through this engaging digital experience.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button
                    size="lg"
                    className="bg-bread-700 hover:bg-bread-800 text-white"
                    onClick={() => window.open('https://heyzine.com/flip-book/4f7bec29f9.html', '_blank')}
                  >
                    <Book className="mr-2 h-5 w-5" />
                    Open Flipbook
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-bread-200 text-bread-700 hover:bg-bread-50 dark:border-bread-700 dark:text-bread-200 dark:hover:bg-bread-800/50"
                    onClick={() => window.open('https://heyzine.com/flip-book/4f7bec29f9.html', '_blank')}
                  >
                    <ExternalLink className="mr-2 h-5 w-5" />
                    View Full Screen
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
