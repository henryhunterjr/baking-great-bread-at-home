
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RecipeConverter from '@/pages/RecipeConverter';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { initializeWorkers, preloadWorkers } from '@/utils/workerUtils';
import { isAIConfigured } from '@/lib/ai-services';
import { logInfo } from '@/utils/logger';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthPage from '@/pages/AuthPage';
import ProfilePage from '@/pages/ProfilePage';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

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
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RecipeConverter />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/recipes" element={<Navigate to="/" />} />
          <Route path="/guides" element={<Navigate to="/" />} />
          <Route path="/challenges" element={<Navigate to="/" />} />
          <Route path="*" element={<RecipeConverter />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
