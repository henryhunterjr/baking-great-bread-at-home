
import React from 'react';
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

// Initialize error handler early to suppress development-related errors
if (typeof window !== 'undefined') {
  initDevErrorHandler(true);
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark">
        <AIAssistantProvider>
          <OnboardingProvider>
            <Navbar />
            <div className="min-h-screen">
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
          </OnboardingProvider>
        </AIAssistantProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

// Simple component for routes that are not yet implemented
const ComingSoon: React.FC<{title: string}> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-16 md:pt-20">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
      <p className="text-xl text-muted-foreground">Coming Soon</p>
      <p className="mt-4">This page is under construction.</p>
    </div>
  );
};

export default App;
