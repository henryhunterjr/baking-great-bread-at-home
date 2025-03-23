
import React, { useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import BooksSection from '@/components/home/BooksSection';
import ToolsSection from '@/components/home/ToolsSection';
import CTASection from '@/components/home/CTASection';
import BlogPreviewSection from '@/components/home/BlogPreviewSection';
import AppPromoSection from '@/components/home/AppPromoSection';
import CareCenterPreview from '@/components/home/CareCenterPreview';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();
  
  // Refs for animation elements
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const booksRef = useRef<HTMLElement>(null);
  const toolsRef = useRef<HTMLElement>(null);
  const careCenterRef = useRef<HTMLElement>(null);
  const blogRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const appPromoRef = useRef<HTMLElement>(null);
  
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
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe hero section
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    
    // Observe other sections
    [aboutRef, booksRef, toolsRef, careCenterRef, blogRef, ctaRef, appPromoRef].forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <HeroSection heroRef={heroRef} />
      
      {/* Section divider for both mobile and desktop */}
      <div className="h-1 w-full bg-gradient-to-r from-bread-100 via-bread-200 to-bread-100 dark:from-bread-800 dark:via-bread-700 dark:to-bread-800" role="presentation" aria-hidden="true" />
      
      <AboutSection sectionRef={aboutRef} />
      
      {/* Section divider for both mobile and desktop */}
      <div className="h-1 w-full bg-gradient-to-r from-bread-100 via-bread-200 to-bread-100 dark:from-bread-800 dark:via-bread-700 dark:to-bread-800" role="presentation" aria-hidden="true" />
      
      <BooksSection sectionRef={booksRef} />
      
      {/* Section divider for both mobile and desktop */}
      <div className="h-1 w-full bg-gradient-to-r from-bread-100 via-bread-200 to-bread-100 dark:from-bread-800 dark:via-bread-700 dark:to-bread-800" role="presentation" aria-hidden="true" />
      
      <ToolsSection sectionRef={toolsRef} />
      
      {/* Section divider for both mobile and desktop */}
      <div className="h-1 w-full bg-gradient-to-r from-bread-100 via-bread-200 to-bread-100 dark:from-bread-800 dark:via-bread-700 dark:to-bread-800" role="presentation" aria-hidden="true" />
      
      <CareCenterPreview sectionRef={careCenterRef} />
      
      {/* Section divider for both mobile and desktop */}
      <div className="h-1 w-full bg-gradient-to-r from-bread-100 via-bread-200 to-bread-100 dark:from-bread-800 dark:via-bread-700 dark:to-bread-800" role="presentation" aria-hidden="true" />
      
      <BlogPreviewSection sectionRef={blogRef} />
      
      {/* Section divider for both mobile and desktop */}
      <div className="h-1 w-full bg-gradient-to-r from-bread-100 via-bread-200 to-bread-100 dark:from-bread-800 dark:via-bread-700 dark:to-bread-800" role="presentation" aria-hidden="true" />
      
      <CTASection sectionRef={ctaRef} />
      
      {/* Section divider for both mobile and desktop */}
      <div className="h-1 w-full bg-gradient-to-r from-bread-100 via-bread-200 to-bread-100 dark:from-bread-800 dark:via-bread-700 dark:to-bread-800" role="presentation" aria-hidden="true" />
      
      <AppPromoSection sectionRef={appPromoRef} />
      
      <Footer />
    </div>
  );
};

export default Index;
