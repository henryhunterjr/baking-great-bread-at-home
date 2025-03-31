
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'  // This now points to our refactored CSS structure

// Add DevToolsToggle for better development experience
import DevToolsToggle from './components/dev/DevToolsToggle'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <DevToolsToggle />
    </BrowserRouter>
  </React.StrictMode>,
)
