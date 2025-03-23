
import React, { useEffect, useRef } from 'react';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import BooksSection from '@/components/home/BooksSection';
import ToolsSection from '@/components/home/ToolsSection';
import BlogPreviewSection from '@/components/home/BlogPreviewSection';
import AppPromoSection from '@/components/home/AppPromoSection';
import CTASection from '@/components/home/CTASection';
import CareCenterPreview from '@/components/home/CareCenterPreview';

const Index = () => {
  // Create refs for each section that requires one
  const aboutSectionRef = useRef<HTMLElement>(null);
  const booksSectionRef = useRef<HTMLElement>(null);
  const toolsSectionRef = useRef<HTMLElement>(null);
  const blogSectionRef = useRef<HTMLElement>(null);
  const appPromoSectionRef = useRef<HTMLElement>(null);
  const careCenterRef = useRef<HTMLElement>(null);
  const ctaSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <HeroSection />
      <AboutSection sectionRef={aboutSectionRef} />
      <BooksSection sectionRef={booksSectionRef} />
      <ToolsSection sectionRef={toolsSectionRef} />
      <BlogPreviewSection sectionRef={blogSectionRef} />
      <AppPromoSection sectionRef={appPromoSectionRef} />
      <CareCenterPreview sectionRef={careCenterRef} />
      <CTASection sectionRef={ctaSectionRef} />
    </div>
  );
};

export default Index;
