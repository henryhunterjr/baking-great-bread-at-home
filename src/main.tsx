
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AIAssistantProvider } from './contexts/AIAssistantContext'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'  // Import the ThemeProvider
import App from './App.tsx'
import './index.css'  // This now points to our refactored CSS structure
import './styles/navigation.css'  // Add the new navigation styles

// Add DevToolsToggle for better development experience
import DevToolsToggle from './components/dev/DevToolsToggle'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark">
          <AIAssistantProvider>
            <App />
            <DevToolsToggle />
          </AIAssistantProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
