
import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { initializeWorkers, preloadWorkers } from '@/utils/workerUtils';
import { isAIConfigured } from '@/lib/ai-services';
import { logInfo } from '@/utils/logger';
import { Toaster } from '@/components/ui/toaster';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { BreadAssistantProvider } from '@/contexts/BreadAssistantContext';
import { ErrorProvider, ErrorToast } from '@/utils/ErrorHandling';
import ErrorBoundary from '@/components/ErrorBoundary';

// Eagerly load critical route components
import RecipeConverter from '@/pages/RecipeConverter';
import AuthPage from '@/pages/AuthPage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Lazily load non-critical components
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'));
const Settings = lazy(() => import('@/pages/Settings'));
const FloatingAIButton = lazy(() => import('@/components/ai/FloatingAIButton'));
const AIBreadAssistant = lazy(() => import('@/components/AIBreadAssistant'));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bread-800"></div>
  </div>
);

const App: React.FC = () => {
  // Use the scroll to top hook to ensure navigation scrolls to top
  useScrollToTop();
  
  useEffect(() => {
    // Initialize workers for PDF and image processing
    initializeWorkers();
    
    // Preload the workers to prevent delays during first use
    preloadWorkers();
    
    // Check if AI services are configured
    const aiConfigured = isAIConfigured();
    logInfo('Application initialized', { 
      aiConfigured,
      environment: import.meta.env.MODE 
    });
  }, []);

  return (
    <ErrorProvider>
      <ErrorBoundary>
        <BreadAssistantProvider>
          <Routes>
            <Route path="/" element={<RecipeConverter />} />
            <Route path="/auth/*" element={<AuthPage />} />
            
            {/* Protected Routes - Lazily loaded */}
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
            
            <Route path="/recipes" element={<RecipeConverter />} />
            <Route path="/guides" element={<RecipeConverter />} />
            <Route path="/challenges" element={<RecipeConverter />} />
            <Route path="*" element={<RecipeConverter />} />
          </Routes>
          
          <Suspense fallback={null}>
            <AIBreadAssistant />
          </Suspense>
          
          <Suspense fallback={null}>
            <FloatingAIButton />
          </Suspense>
          
          <Toaster />
          <ErrorToast />
        </BreadAssistantProvider>
      </ErrorBoundary>
    </ErrorProvider>
  );
};

export default App;
