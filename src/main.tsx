
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'  // This now points to our refactored CSS structure
import './styles/navigation.css'  // Add the new navigation styles
import { Toaster } from '@/components/ui/toaster'

// Add console logs to help with debugging
console.log('Main.tsx is executing');
console.log('Attempting to render React app');

// Ensure the root element exists
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found in the DOM!');
} else {
  console.log('Root element found, creating React root');
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </React.StrictMode>,
  );
  console.log('React render called');
}
