
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { runBrowserCompatibilityCheck } from './utils/crossBrowserTesting';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogPost from './pages/BlogPost';
import RecipeConverter from './pages/RecipeConverter';
import AboutPage from './pages/AboutPage';
import NotFound from './pages/NotFound';
import Contact from './pages/Contact';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import DevToolsToggle from './components/dev/DevToolsToggle';
import { initializeAIService } from './lib/ai-services';
import { logError, logInfo } from './utils/logger';
import { useToast } from '@/hooks/use-toast';
import FloatingAIButton from './components/ai/FloatingAIButton';
import CareCenter from './pages/CareCenter';
import Settings from './pages/Settings';
import AccessibilityManager from './components/recipe-converter/accessibility/AccessibilityManager';
import './App.css';

const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const AIHome = lazy(() => import('./pages/AIHome'));
const AIChat = lazy(() => import('./pages/AIChat'));
const ComingSoon = lazy(() => import('./pages/ComingSoon'));
const Challenges = lazy(() => import('./pages/Challenges'));
const PastChallenges = lazy(() => import('./pages/PastChallenges'));
const Tools = lazy(() => import('./pages/Tools'));
const Books = lazy(() => import('./pages/Books'));
const MyRecipes = lazy(() => import('./pages/MyRecipes'));

function App() {
  const [aiInitialized, setAiInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    runBrowserCompatibilityCheck();
    
    try {
      initializeAIService()
        .then(() => {
          logInfo('AI service initialized successfully');
          setAiInitialized(true);
        })
        .catch(error => {
          logError('Failed to initialize AI service:', error);
          setAiInitialized(false);
          
          toast({
            title: "AI Service Error",
            description: "Failed to initialize AI services. Some features may be limited.",
            variant: "destructive"
          });
        });
    } catch (error) {
      logError('Failed to initialize AI service:', error);
      setAiInitialized(false);
      
      toast({
        title: "AI Service Error",
        description: "Failed to initialize AI services. Some features may be limited.",
        variant: "destructive"
      });
    }
  }, [toast]);

  return (
    <ThemeProvider>
      <AuthProvider>
        <ErrorBoundary>
          <AccessibilityManager>
            <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/recipe-converter" element={<RecipeConverter />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/favorites" element={
                  <ProtectedRoute>
                    <FavoritesPage />
                  </ProtectedRoute>
                } />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                <Route path="/ai" element={<AIHome aiInitialized={aiInitialized} />} />
                <Route path="/ai/chat" element={<AIChat />} />
                <Route path="/community" element={<ComingSoon />} />
                <Route path="/challenges" element={<Challenges />} />
                <Route path="/challenges/past" element={<PastChallenges />} />
                <Route path="/tools" element={<Tools />} />
                <Route path="/books" element={<Books />} />
                <Route path="/care-center" element={<CareCenter />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/my-recipes" element={
                  <ProtectedRoute>
                    <MyRecipes />
                  </ProtectedRoute>
                } />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                
                {/* Redirect old paths to new ones if needed */}
                <Route path="/recipes" element={<Navigate to="/my-recipes" replace />} />
                
                {/* This must be the last route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AccessibilityManager>
        </ErrorBoundary>
        <DevToolsToggle />
        <FloatingAIButton />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
