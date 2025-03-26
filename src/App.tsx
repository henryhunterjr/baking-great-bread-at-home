
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
import { toast } from '@/hooks/use-toast';
import FloatingAIButton from './components/ai/FloatingAIButton';
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
  const [aiInitialized, setAiInitialized] = useState(false);

  useEffect(() => {
    runBrowserCompatibilityCheck();
    
    try {
      const initialized = initializeAIService();
      if (initialized) {
        logInfo('AI service initialized successfully');
        setAiInitialized(true);
      } else {
        logInfo('AI service not initialized - no API key found');
        setAiInitialized(false);
      }
    } catch (error) {
      logError('Failed to initialize AI service:', error);
      setAiInitialized(false);
      
      toast.error("AI Service Error: Failed to initialize AI services. Some features may be limited.");
    }
  }, []);

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
      <FloatingAIButton />
    </ThemeProvider>
  );
}

export default App;
