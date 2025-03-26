import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { runBrowserCompatibilityCheck } from './utils/crossBrowserTesting';
import { ThemeProvider } from '@/contexts/ThemeContext';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogPost from './pages/BlogPost';
import RecipeConverter from './pages/RecipeConverter';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import Contact from './pages/Contact';
import { lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import DevToolsToggle from './components/dev/DevToolsToggle';
import { initializeAIService } from './lib/ai-services';
import { logError, logInfo } from './utils/logger';
import { useToast } from './hooks/use-toast';
import './App.css';

const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const AIHome = lazy(() => import('./pages/AIHome'));
const ComingSoon = lazy(() => import('./pages/ComingSoon'));
const Challenges = lazy(() => import('./pages/Challenges'));
const Tools = lazy(() => import('./pages/Tools'));
const Books = lazy(() => import('./pages/Books'));

function App() {
  const { toast } = useToast();
  const [aiInitialized, setAiInitialized] = useState<boolean>(false);

  useEffect(() => {
    runBrowserCompatibilityCheck();
    
    try {
      const initialized = initializeAIService();
      setAiInitialized(initialized);
      
      if (initialized) {
        logInfo('AI service initialized successfully');
      } else {
        logInfo('AI service not initialized - no API key found');
      }
    } catch (error) {
      logError('Failed to initialize AI service:', error);
      
      toast({
        variant: "destructive",
        title: "AI Service Error",
        description: "Failed to initialize AI services. Some features may be limited.",
      });
    }
  }, [toast]);

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/recipe-converter" element={<RecipeConverter />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/ai" element={<AIHome aiInitialized={aiInitialized} />} />
            <Route path="/community" element={<ComingSoon />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/books" element={<Books />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <DevToolsToggle />
    </ThemeProvider>
  );
}

export default App;
