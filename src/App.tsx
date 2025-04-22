import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AIAssistantProvider } from './context/AIAssistantContext';
import Home from './pages/Home';
import { initDevErrorHandler } from './utils/devErrorHandler';
import DevToolsToggle from './components/dev/DevToolsToggle';

// Initialize error handler early to suppress development-related errors
if (typeof window !== 'undefined') {
  initDevErrorHandler(true);
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="bread-theme">
        <AIAssistantProvider>
          <Home />
          
          {/* Add DevToolsToggle at the bottom */}
          <DevToolsToggle />
        </AIAssistantProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
