import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { runBrowserCompatibilityCheck } from './utils/crossBrowserTesting';
import { ThemeProvider } from '@/contexts/ThemeContext';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogPost from './pages/BlogPost';
import RecipeConverter from './pages/RecipeConverter';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import { lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import DevToolsToggle from './components/dev/DevToolsToggle';
import { initializeAIService } from './lib/ai-services';
import './App.css';

const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const AIHome = lazy(() => import('./pages/AIHome'));

function App() {
  useEffect(() => {
    // Run compatibility check on app startup
    runBrowserCompatibilityCheck();
    
    // Initialize AI service from stored API key if available
    initializeAIService();
  }, []);

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/recipe-converter" element={<RecipeConverter />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/ai" element={<AIHome />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <DevToolsToggle />
    </ThemeProvider>
  );
}

export default App;
