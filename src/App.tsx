
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/hooks/use-theme';
import FloatingAIButton from '@/components/ai/FloatingAIButton';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { lazy, Suspense } from 'react';
import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import DevToolsToggle from '@/components/dev/DevToolsToggle';

// Eagerly loaded components for critical paths
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';

// Lazy-loaded components for non-critical paths
const AppStore = lazy(() => import('@/pages/AppStore'));
const Blog = lazy(() => import('@/pages/Blog'));
const CareCenter = lazy(() => import('@/pages/CareCenter'));
const ChallengesArchive = lazy(() => import('@/pages/ChallengesArchive'));
const Challenges = lazy(() => import('@/pages/Challenges'));
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
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" storageKey="bread-theme">
        <Toaster />
        <FloatingAIButton />
        <DevToolsToggle />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
          
          {/* Lazy-loaded routes */}
          <Route path="/app" element={
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <AppStore />
              </Suspense>
            </ErrorBoundary>
          } />
          <Route path="/blog" element={
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <Blog />
              </Suspense>
            </ErrorBoundary>
          } />
          <Route path="/books" element={
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <Books />
              </Suspense>
            </ErrorBoundary>
          } />
          <Route path="/care-center" element={
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <CareCenter />
              </Suspense>
            </ErrorBoundary>
          } />
          <Route path="/challenges" element={
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <ChallengesArchive />
              </Suspense>
            </ErrorBoundary>
          } />
          <Route path="/challenge" element={
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <Challenges />
              </Suspense>
            </ErrorBoundary>
          } />
          <Route path="/community" element={
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <Community />
              </Suspense>
            </ErrorBoundary>
          } />
          <Route path="/recipe-converter" element={
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <RecipeConverter />
              </Suspense>
            </ErrorBoundary>
          } />
          <Route path="/affiliate-collection" element={
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <AffiliateCollection />
              </Suspense>
            </ErrorBoundary>
          } />
          <Route path="/tools" element={
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <Tools />
              </Suspense>
            </ErrorBoundary>
          } />
          <Route path="/recipes" element={
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <Recipes />
              </Suspense>
            </ErrorBoundary>
          } />
          <Route path="/about" element={
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <About />
              </Suspense>
            </ErrorBoundary>
          } />
          <Route path="/coming-soon" element={
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <ComingSoon />
              </Suspense>
            </ErrorBoundary>
          } />
        </Routes>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
