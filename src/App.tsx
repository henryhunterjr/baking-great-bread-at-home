
import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AIAssistantProvider } from './contexts/AIAssistantContext';
import HomePage from './pages/HomePage';
import { initDevErrorHandler } from './utils/devErrorHandler';
import DevToolsToggle from './components/dev/DevToolsToggle';

// Initialize error handler early to suppress development-related errors
if (typeof window !== 'undefined') {
  initDevErrorHandler(true);
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark">
        <AIAssistantProvider>
          <HomePage />
          
          {/* Add DevToolsToggle at the bottom */}
          <DevToolsToggle />
        </AIAssistantProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
