
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import AccessibilityManager from './components/recipe-converter/accessibility/AccessibilityManager'
import './index.css'  // This now points to our refactored CSS structure

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AccessibilityManager>
          <App />
        </AccessibilityManager>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
