
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import RecipeConverter from '@/pages/RecipeConverter';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { initializeWorkers, preloadWorkers } from '@/utils/workerUtils';
import { isAIConfigured } from '@/lib/ai-services';
import { logInfo } from '@/utils/logger';
import { Toaster } from '@/components/ui/toaster';
import AuthPage from '@/pages/AuthPage';
import ProfilePage from '@/pages/ProfilePage';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import FavoritesPage from '@/pages/FavoritesPage';

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
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<RecipeConverter />} />
        <Route path="/auth" element={<AuthPage />} />
        
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
        
        <Route path="/recipes" element={<RecipeConverter />} />
        <Route path="/guides" element={<RecipeConverter />} />
        <Route path="/challenges" element={<RecipeConverter />} />
        <Route path="*" element={<RecipeConverter />} />
      </Routes>
      <Toaster />
    </ErrorBoundary>
  );
};

export default App;
