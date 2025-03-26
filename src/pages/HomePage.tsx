
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import BooksSection from '@/components/home/BooksSection';
import ToolsSection from '@/components/home/ToolsSection';
import CTASection from '@/components/home/CTASection';
import BlogPreviewSection from '@/components/home/BlogPreviewSection';
import CareCenterPreview from '@/components/home/CareCenterPreview';
import ChallengePreviewSection from '@/components/home/ChallengePreviewSection';
import { useIsMobile } from '@/hooks/use-mobile';

const HomePage = () => {
  const isMobile = useIsMobile();
  
  // Refs for animation elements
  const heroRef = React.useRef<HTMLDivElement>(null);
  const aboutRef = React.useRef<HTMLElement>(null);
  const booksRef = React.useRef<HTMLElement>(null);
  const toolsRef = React.useRef<HTMLElement>(null);
  const careCenterRef = React.useRef<HTMLElement>(null);
  const challengeRef = React.useRef<HTMLElement>(null);
  const blogRef = React.useRef<HTMLElement>(null);
  const ctaRef = React.useRef<HTMLElement>(null);
  
  // Optimized observer setup for animations - with reduced work and better thresholds
  React.useEffect(() => {
    // Using a more performant approach with fewer callbacks
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Only animate if not already animated
          if (entry.isIntersecting && !entry.target.classList.contains('animate-fade-in')) {
            entry.target.classList.add('animate-fade-in');
            // Unobserve after animation to reduce overhead
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Reduced margin for better performance
      }
    );
    
    // Collect all refs to observe
    const elements = [
      heroRef.current, 
      aboutRef.current, 
      booksRef.current, 
      toolsRef.current, 
      careCenterRef.current, 
      challengeRef.current, 
      blogRef.current, 
      ctaRef.current
    ].filter(Boolean); // Filter out any null refs
    
    // Observe elements
    elements.forEach(element => {
      if (element) observer.observe(element);
    });
    
    return () => {
      elements.forEach(element => {
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection heroRef={heroRef} />
        
        {/* Section divider - using a more performant approach */}
        <div className="h-1 w-full bg-gradient-to-r from-bread-100 via-bread-200 to-bread-100 dark:from-bread-800 dark:via-bread-700 dark:to-bread-800" 
             role="presentation" 
             aria-hidden="true" />
        
        <AboutSection sectionRef={aboutRef} />
        
        {/* Section divider */}
        <div className="h-1 w-full bg-gradient-to-r from-bread-100 via-bread-200 to-bread-100 dark:from-bread-800 dark:via-bread-700 dark:to-bread-800" 
             role="presentation" 
             aria-hidden="true" />
        
        <BooksSection sectionRef={booksRef} />
        
        {/* Section divider */}
        <div className="h-1 w-full bg-gradient-to-r from-bread-100 via-bread-200 to-bread-100 dark:from-bread-800 dark:via-bread-700 dark:to-bread-800" 
             role="presentation" 
             aria-hidden="true" />
        
        <ToolsSection sectionRef={toolsRef} />
        
        {/* Section divider */}
        <div className="h-1 w-full bg-gradient-to-r from-bread-100 via-bread-200 to-bread-100 dark:from-bread-800 dark:via-bread-700 dark:to-bread-800" 
             role="presentation" 
             aria-hidden="true" />
        
        <CareCenterPreview sectionRef={careCenterRef} />
        
        {/* Section divider */}
        <div className="h-1 w-full bg-gradient-to-r from-bread-100 via-bread-200 to-bread-100 dark:from-bread-800 dark:via-bread-700 dark:to-bread-800" 
             role="presentation" 
             aria-hidden="true" />
        
        <ChallengePreviewSection sectionRef={challengeRef} />
        
        {/* Section divider */}
        <div className="h-1 w-full bg-gradient-to-r from-bread-100 via-bread-200 to-bread-100 dark:from-bread-800 dark:via-bread-700 dark:to-bread-800" 
             role="presentation" 
             aria-hidden="true" />
        
        <BlogPreviewSection sectionRef={blogRef} />
        
        {/* Section divider */}
        <div className="h-1 w-full bg-gradient-to-r from-bread-100 via-bread-200 to-bread-100 dark:from-bread-800 dark:via-bread-700 dark:to-bread-800" 
             role="presentation" 
             aria-hidden="true" />
        
        <CTASection sectionRef={ctaRef} />
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
