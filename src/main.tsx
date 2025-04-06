
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AIAssistantProvider } from './contexts/AIAssistantContext'
import { AuthProvider } from './contexts/AuthContext'
import App from './App.tsx'
import './index.css'  // This now points to our refactored CSS structure
import './styles/navigation.css'  // Add the new navigation styles

// Add DevToolsToggle for better development experience
import DevToolsToggle from './components/dev/DevToolsToggle'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AIAssistantProvider>
          <App />
          <DevToolsToggle />
        </AIAssistantProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
