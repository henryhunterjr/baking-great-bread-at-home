
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AIAssistantProvider } from './contexts/AIAssistantContext';
import HomePage from './pages/HomePage';
import RecipeConverter from './pages/RecipeConverter';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DevToolsToggle from './components/dev/DevToolsToggle';
import { initDevErrorHandler } from './utils/devErrorHandler';

// Initialize error handler early to suppress development-related errors
if (typeof window !== 'undefined') {
  initDevErrorHandler(true);
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark">
        <AIAssistantProvider>
          <Navbar />
          <div className="min-h-screen pt-16 md:pt-20">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/recipe-converter" element={<RecipeConverter />} />
            </Routes>
          </div>
          <Footer />
          <DevToolsToggle />
        </AIAssistantProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
