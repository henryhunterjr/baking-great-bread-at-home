
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ComingSoon = () => {
  // Refs for animation elements
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Observer setup for animations
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    };
    
    const observerOptions = {
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    if (contentRef.current) {
      observer.observe(contentRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-24 px-4">
        <div 
          ref={contentRef}
          className="max-w-4xl mx-auto text-center opacity-0 transition-opacity duration-1000"
        >
          <div className="mb-10">
            <img 
              src="/lovable-uploads/bdd5d8b1-3208-448b-882e-339b7adb271d.png"
              alt="Baking Great Bread at Home: A Journey Through the Seasons"
              className="max-w-xs md:max-w-sm mx-auto rounded-lg shadow-lg"
            />
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium mb-6 dark:text-white">
            Coming Soon in 2025
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            "Baking Great Bread at Home: A Journey Through the Seasons" 
            will take you through a year of artisanal bread baking, with recipes 
            and techniques inspired by seasonal ingredients and traditions.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              asChild
              size="lg"
              className="bg-bread-800 hover:bg-bread-900 text-white"
            >
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              size="lg"
              className="border-bread-800 text-bread-800 hover:bg-bread-50 dark:border-bread-700 dark:text-gray-300 dark:hover:bg-bread-800"
            >
              <a href="http://bakinggreatbread.blog" target="_blank" rel="noopener noreferrer">
                Visit My Blog
              </a>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ComingSoon;
