
import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { initializeWorkers, preloadWorkers } from '@/utils/workerUtils';
import { Toaster } from '@/components/ui/toaster';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { BreadAssistantProvider } from '@/contexts/BreadAssistantContext';
import { ErrorProvider, ErrorToast } from '@/utils/ErrorHandling';
import ErrorBoundary from '@/components/ErrorBoundary';
import HoverNavbar from '@/components/navigation/HoverNavbar';
import NotFound from '@/pages/NotFound';
import { OnboardingComponents } from '@/components/onboarding';
import FloatingAIButton from '@/components/ai/FloatingAIButton';
import AIBreadAssistantPanel from '@/components/ai/AIBreadAssistantPanel';
import HelpCenter from '@/components/onboarding/HelpCenter';

// Eagerly load critical components
import HomePage from '@/pages/HomePage';
import RecipeConverter from '@/pages/RecipeConverter';
import Recipes from '@/pages/Recipes';
import AuthPage from '@/pages/AuthPage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Challenges from '@/pages/Challenges';
import PastChallenges from '@/pages/PastChallenges';
import Guides from '@/pages/Guides';
import Books from '@/pages/Books';

// Lazily load non-critical components
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'));
const Settings = lazy(() => import('@/pages/Settings'));
const AIBreadAssistant = lazy(() => import('@/components/AIBreadAssistant'));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bread-800"></div>
  </div>
);

const App: React.FC = () => {
  useScrollToTop();
  
  useEffect(() => {
    // Initialize workers
    initializeWorkers();
    preloadWorkers();
    
    // Set page title
    document.title = "Baking Great Bread at Home with Henry";
    
    // Log that the app is initialized
    console.info("App initialized correctly");
  }, []);

  return (
    <ErrorProvider>
      <ErrorBoundary>
        <OnboardingComponents>
          <BreadAssistantProvider>
            {/* HoverNavbar component - always visible initially */}
            <HoverNavbar />
            
            <main className="pt-16 pb-8">
              <Routes>
                {/* Home page */}
                <Route path="/" element={<HomePage />} />
                
                {/* Authentication */}
                <Route path="/auth/*" element={<AuthPage />} />
                
                {/* Recipe converter */}
                <Route path="/recipe-converter" element={<RecipeConverter />} />
                
                {/* Recipes page */}
                <Route path="/recipes" element={<Recipes />} />
                
                {/* Books and Guides pages */}
                <Route path="/guides" element={<Guides />} />
                <Route path="/books" element={<Books />} />
                
                {/* Challenges pages */}
                <Route path="/challenges" element={<Challenges />} />
                <Route path="/challenges/past" element={<PastChallenges />} />
                
                {/* Protected routes */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingFallback />}>
                      <ProfilePage />
                    </Suspense>
                  </ProtectedRoute>
                } />
                <Route path="/favorites" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingFallback />}>
                      <FavoritesPage />
                    </Suspense>
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingFallback />}>
                      <Settings />
                    </Suspense>
                  </ProtectedRoute>
                } />
                
                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            
            {/* Help Center button and Floating AI Button - order matters for z-index */}
            <HelpCenter />
            <FloatingAIButton />
            <AIBreadAssistantPanel />
            
            <Toaster />
            <ErrorToast />
          </BreadAssistantProvider>
        </OnboardingComponents>
      </ErrorBoundary>
    </ErrorProvider>
  );
};

export default App;
