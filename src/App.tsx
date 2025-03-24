
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/hooks/use-theme';
import FloatingAIButton from '@/components/ai/FloatingAIButton';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { lazy, Suspense } from 'react';
import React from 'react';

// Eagerly loaded components for critical paths
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';

// Lazy-loaded components for non-critical paths
const AppStore = lazy(() => import('@/pages/AppStore'));
const Blog = lazy(() => import('@/pages/Blog'));
const CareCenter = lazy(() => import('@/pages/CareCenter'));
const ChallengesArchive = lazy(() => import('@/pages/ChallengesArchive'));
const Community = lazy(() => import('@/pages/Community'));
const ComingSoon = lazy(() => import('@/pages/ComingSoon'));
const RecipeConverter = lazy(() => import('@/pages/RecipeConverter'));
const AffiliateCollection = lazy(() => import('@/pages/AffiliateCollection'));
const Tools = lazy(() => import('@/pages/Tools'));
const Recipes = lazy(() => import('@/pages/Recipes'));
const Books = lazy(() => import('@/pages/Books'));
const About = lazy(() => import('@/pages/About'));

import './App.css';

// Loading component for lazy-loaded routes
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bread-800"></div>
  </div>
);

function App() {
  // Use the scroll to top hook
  useScrollToTop();
  
  return (
    <ThemeProvider defaultTheme="dark" storageKey="bread-theme">
      <Toaster />
      <FloatingAIButton />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<NotFound />} />
        
        {/* Lazy-loaded routes */}
        <Route path="/app" element={
          <Suspense fallback={<PageLoader />}>
            <AppStore />
          </Suspense>
        } />
        <Route path="/blog" element={
          <Suspense fallback={<PageLoader />}>
            <Blog />
          </Suspense>
        } />
        <Route path="/books" element={
          <Suspense fallback={<PageLoader />}>
            <Books />
          </Suspense>
        } />
        <Route path="/care-center" element={
          <Suspense fallback={<PageLoader />}>
            <CareCenter />
          </Suspense>
        } />
        <Route path="/challenges" element={
          <Suspense fallback={<PageLoader />}>
            <ChallengesArchive />
          </Suspense>
        } />
        <Route path="/community" element={
          <Suspense fallback={<PageLoader />}>
            <Community />
          </Suspense>
        } />
        <Route path="/recipe-converter" element={
          <Suspense fallback={<PageLoader />}>
            <RecipeConverter />
          </Suspense>
        } />
        <Route path="/affiliate-collection" element={
          <Suspense fallback={<PageLoader />}>
            <AffiliateCollection />
          </Suspense>
        } />
        <Route path="/tools" element={
          <Suspense fallback={<PageLoader />}>
            <Tools />
          </Suspense>
        } />
        <Route path="/recipes" element={
          <Suspense fallback={<PageLoader />}>
            <Recipes />
          </Suspense>
        } />
        <Route path="/about" element={
          <Suspense fallback={<PageLoader />}>
            <About />
          </Suspense>
        } />
        <Route path="/coming-soon" element={
          <Suspense fallback={<PageLoader />}>
            <ComingSoon />
          </Suspense>
        } />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
