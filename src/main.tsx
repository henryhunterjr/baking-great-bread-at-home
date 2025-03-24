
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './hooks/use-theme';
import { Toaster } from '@/components/ui/toaster';
import './index.css';
import { initDevErrorHandler, isDevelopmentEnvironment } from './utils/devErrorHandler';

// Initialize the development error handler in development environments
if (isDevelopmentEnvironment()) {
  initDevErrorHandler(true);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
