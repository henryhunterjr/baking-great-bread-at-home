
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { runBrowserCompatibilityCheck } from './utils/crossBrowserTesting'
import { logInfo } from './utils/logger';

// Run compatibility check on startup
const compatibilityResult = runBrowserCompatibilityCheck();

// Log application start
logInfo('Application starting', {
  timestamp: new Date().toISOString(),
  compatibility: compatibilityResult
});

// Ensure the window.resetNetworkSimulation property is properly initialized
if (typeof window !== 'undefined' && !window.resetNetworkSimulation) {
  window.resetNetworkSimulation = () => {
    logInfo('Default network simulation reset called');
  };
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
