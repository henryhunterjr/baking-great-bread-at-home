
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AIAssistantProvider } from './contexts/AIAssistantContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import HomePage from './pages/HomePage';
import RecipeConverter from './pages/RecipeConverter';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DevToolsToggle from './components/dev/DevToolsToggle';
import { initDevErrorHandler } from './utils/devErrorHandler';
import CareCenter from './pages/CareCenter';
import ComingSoon from './pages/ComingSoon';
import { ErrorProvider } from './utils/ErrorHandling';

// Initialize error handler early to suppress development-related errors
if (typeof window !== 'undefined') {
  initDevErrorHandler(true);
}

function App() {
  useEffect(() => {
    // Log when App component mounts
    console.log('App component mounted');
  }, []);

  return (
    <ErrorProvider>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark">
          <AIAssistantProvider>
            <OnboardingProvider>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-grow">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/recipe-converter" element={<RecipeConverter />} />
                    <Route path="/recipes" element={<ComingSoon title="Recipes" />} />
                    <Route path="/guides" element={<ComingSoon title="Guides" />} />
                    <Route path="/challenges" element={<ComingSoon title="Challenges" />} />
                    <Route path="/community" element={<ComingSoon title="Community" />} />
                    <Route path="/auth" element={<ComingSoon title="Login/Signup" />} />
                    <Route path="/care-center" element={<CareCenter />} />
                  </Routes>
                </div>
                <Footer />
                <DevToolsToggle />
              </div>
            </OnboardingProvider>
          </AIAssistantProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorProvider>
  );
}

export default App;
