
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Book, ExternalLink, RefreshCw } from 'lucide-react';
import { logError } from '@/utils/logger';

interface FlipbookSectionProps {
  sectionRef: React.RefObject<HTMLElement>;
}

const FlipbookSection: React.FC<FlipbookSectionProps> = ({ sectionRef }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [flipbookUrl] = useState("https://heyzine.com/flip-book/b821d79d0c.html");
  
  // Handle iframe loading state
  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };
  
  // Handle iframe error
  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
    logError('Flipbook iframe failed to load', { url: flipbookUrl });
  };
  
  // Retry loading the flipbook
  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    
    // Force iframe reload by updating a key
    const iframe = document.getElementById('flipbook-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };
  
  useEffect(() => {
    // Set a timeout to detect slow loading
    const timeout = setTimeout(() => {
      if (isLoading) {
        logError('Flipbook iframe loading timed out', { url: flipbookUrl });
      }
    }, 10000); // 10 seconds timeout
    
    return () => clearTimeout(timeout);
  }, [isLoading, flipbookUrl]);
  
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
                  {/* Loading state */}
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-bread-100 dark:bg-bread-800 z-10">
                      <div className="flex flex-col items-center gap-3">
                        <RefreshCw className="h-8 w-8 animate-spin text-bread-700 dark:text-bread-300" />
                        <p className="text-sm text-bread-700 dark:text-bread-300">Loading flipbook...</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Error state */}
                  {hasError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20 z-10">
                      <div className="flex flex-col items-center gap-3">
                        <p className="text-red-700 dark:text-red-300 mb-2">Failed to load flipbook</p>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={handleRetry}
                          className="flex items-center gap-2"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Retry
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Iframe with proper event handlers */}
                  <iframe 
                    id="flipbook-iframe"
                    src={flipbookUrl}
                    className="absolute inset-0 w-full h-full border border-bread-200 dark:border-bread-700 rounded-lg"
                    style={{ minHeight: '500px' }}
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    allowFullScreen
                  />
                </div>
              </div>
              
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-bread-700 hover:bg-bread-800 text-white"
                  onClick={() => window.open(flipbookUrl, '_blank')}
                >
                  <Book className="mr-2 h-5 w-5" />
                  Open in New Tab
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-bread-200 text-bread-700 hover:bg-bread-50 dark:border-bread-700 dark:text-bread-200 dark:hover:bg-bread-800/50"
                  onClick={() => window.open(flipbookUrl, '_blank')}
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
