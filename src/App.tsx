
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { runBrowserCompatibilityCheck } from './utils/crossBrowserTesting';
import { isDevelopmentEnvironment } from './utils/devErrorHandler';
import { logInfo } from './utils/logger';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/hooks/use-theme';
import FloatingAIButton from '@/components/ai/FloatingAIButton';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import DevToolsToggle from './components/dev/DevToolsToggle';
import { initializeAIService } from './lib/ai-services';
import './App.css';

// Import all the page components
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import AppStore from './pages/AppStore';
import Blog from './pages/Blog';
import Books from './pages/Books';
import CareCenter from './pages/CareCenter';
import ChallengesArchive from './pages/ChallengesArchive';
import Challenges from './pages/Challenges';
import Community from './pages/Community';
import RecipeConverter from './pages/RecipeConverter';
import AffiliateCollection from './pages/AffiliateCollection';
import Tools from './pages/Tools';
import Recipes from './pages/Recipes';
import About from './pages/About';
import ComingSoon from './pages/ComingSoon';
import Contact from './pages/Contact';

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bread-800"></div>
  </div>
);

// Initialize AI service
initializeAIService();

function App() {
  useEffect(() => {
    if (isDevelopmentEnvironment()) {
      const compatibility = runBrowserCompatibilityCheck();
      logInfo('App initialized', { browserCompatible: compatibility.compatible });
    }
  }, []);

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
          <Route path="/contact" element={
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <Contact />
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
