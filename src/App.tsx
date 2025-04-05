
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import RecipeConverter from '@/pages/RecipeConverter';
import ErrorBoundary from '@/components/ErrorBoundary';
import { initializeWorkers, preloadWorkers } from '@/utils/workerUtils';
import { isAIConfigured } from '@/lib/ai-services';
import { logInfo } from '@/utils/logger';
import { Toaster } from '@/components/ui/toaster';
import AuthPage from '@/pages/AuthPage';
import ProfilePage from '@/pages/ProfilePage';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import FavoritesPage from '@/pages/FavoritesPage';
import { BreadAssistantProvider } from '@/contexts/BreadAssistantContext';
import AIBreadAssistant from '@/components/AIBreadAssistant';
import Settings from '@/pages/Settings';
import FloatingAIButton from '@/components/ai/FloatingAIButton';
import { ErrorProvider, ErrorToast } from '@/utils/ErrorHandling';

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
            
            {/* Protected Routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/favorites" element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            
            <Route path="/recipes" element={<RecipeConverter />} />
            <Route path="/guides" element={<RecipeConverter />} />
            <Route path="/challenges" element={<RecipeConverter />} />
            <Route path="*" element={<RecipeConverter />} />
          </Routes>
          <AIBreadAssistant />
          <FloatingAIButton />
          <Toaster />
          <ErrorToast />
        </BreadAssistantProvider>
      </ErrorBoundary>
    </ErrorProvider>
  );
};

export default App;
