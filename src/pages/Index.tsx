
import React, { useEffect } from 'react';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import BooksSection from '@/components/home/BooksSection';
import ToolsSection from '@/components/home/ToolsSection';
import BlogPreviewSection from '@/components/home/BlogPreviewSection';
import AppPromoSection from '@/components/home/AppPromoSection';
import CTASection from '@/components/home/CTASection';
import CareCenterPreview from '@/components/home/CareCenterPreview';

const Index = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <HeroSection />
      <AboutSection />
      <BooksSection />
      <ToolsSection />
      <BlogPreviewSection />
      <AppPromoSection />
      <CareCenterPreview />
      <CTASection />
    </div>
  );
};

export default Index;
