
import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { initializeWorkers, preloadWorkers } from '@/utils/workerUtils';
import { Toaster } from '@/components/ui/toaster';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { BreadAssistantProvider } from '@/contexts/BreadAssistantContext';
import { ErrorProvider, ErrorToast } from '@/utils/ErrorHandling';
import ErrorBoundary from '@/components/ErrorBoundary';
import Navbar from '@/components/Navbar';

// Eagerly load critical components
import HomePage from '@/pages/HomePage';
import RecipeConverter from '@/pages/RecipeConverter';
import AuthPage from '@/pages/AuthPage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import NotFound from '@/pages/NotFound';

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
  }, []);

  return (
    <ErrorProvider>
      <ErrorBoundary>
        <BreadAssistantProvider>
          {/* Use standard Navbar component */}
          <Navbar />
          
          <main className="pt-16 pb-8">
            <Routes>
              {/* Home page */}
              <Route path="/" element={<HomePage />} />
              
              {/* Authentication */}
              <Route path="/auth/*" element={<AuthPage />} />
              
              {/* Recipe converter */}
              <Route path="/recipes" element={<RecipeConverter />} />
              <Route path="/recipe-converter" element={<Navigate to="/recipes" replace />} />
              
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
              
              {/* Content pages */}
              <Route path="/guides" element={<RecipeConverter />} />
              <Route path="/challenges" element={<RecipeConverter />} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          
          <Suspense fallback={null}>
            <AIBreadAssistant />
          </Suspense>
          
          <Toaster />
          <ErrorToast />
        </BreadAssistantProvider>
      </ErrorBoundary>
    </ErrorProvider>
  );
};

export default App;
