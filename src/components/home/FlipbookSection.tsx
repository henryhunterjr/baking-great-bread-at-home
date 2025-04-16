
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
            <div className="flex flex-col gap-8">
              {/* Title and Description */}
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-serif mb-4 text-bread-900 dark:text-bread-50">
                  Baking Essentials Guide
                </h2>
                <p className="text-lg mb-6 text-bread-700 dark:text-bread-200 max-w-3xl mx-auto">
                  New to bread baking? This comprehensive guide covers everything you need to know to get started. 
                  Discover the must-have tools, learn essential techniques, and understand what equipment you really need 
                  – and what can wait until later.
                </p>
              </div>
              
              {/* Embedded Flipbook */}
              <div className="w-full overflow-hidden rounded-lg shadow-xl">
                <div className="relative aspect-[16/9]">
                  <iframe 
                    src="https://heyzine.com/flip-book/b821d79d0c.html"
                    className="absolute inset-0 w-full h-full border border-bread-200 dark:border-bread-700 rounded-lg"
                    style={{ minHeight: '500px' }}
                    allowFullScreen
                  />
                </div>
              </div>
              
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-bread-700 hover:bg-bread-800 text-white"
                  onClick={() => window.open('https://heyzine.com/flip-book/b821d79d0c.html', '_blank')}
                >
                  <Book className="mr-2 h-5 w-5" />
                  Open in New Tab
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
    </section>
  );
};

export default FlipbookSection;
