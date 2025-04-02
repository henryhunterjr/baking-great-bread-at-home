
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import RecipeConverter from '@/pages/RecipeConverter';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { initializeWorkers } from '@/utils/workerUtils';
import { isAIConfigured } from '@/lib/ai-services';
import { logInfo } from '@/utils/logger';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthPage from '@/pages/AuthPage';
import ProfilePage from '@/pages/ProfilePage';

const App: React.FC = () => {
  useEffect(() => {
    // Initialize workers for PDF and image processing
    initializeWorkers();
    
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
          <Route path="*" element={<RecipeConverter />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
