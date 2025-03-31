
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { initializeWorkers } from './utils/worker-setup';
import { logInfo } from './utils/logger';

// Pages
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import BakingGuides from './pages/BakingGuides';
import GuideDetail from './pages/GuideDetail';
import Challenges from './pages/Challenges';
import ChallengeDetail from './pages/ChallengeDetail';
import RecipeConverter from './pages/RecipeConverter';
import Contact from './pages/Contact';
import About from './pages/About';
import ToolsAndEquipment from './pages/ToolsAndEquipment';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import AiAssistant from './pages/AiAssistant';
import { Toaster } from './components/ui/toaster';

// Contexts and Providers
import { AuthProvider } from './contexts/AuthContext';
import AccessibilityManager from './components/recipe-converter/accessibility/AccessibilityManager';

function App() {
  // Initialize workers for PDF and OCR processing
  useEffect(() => {
    initializeWorkers();
  }, []);
  
  // Initialize theme based on system or user preference
  useEffect(() => {
    // Check for dark mode preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme') || 'system';
    
    // Apply theme to document
    const root = document.documentElement;
    
    if (savedTheme === 'dark' || (savedTheme === 'system' && prefersDark)) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    
    logInfo("Initial theme applied", { 
      savedTheme, 
      prefersDark, 
      appliedTheme: savedTheme === 'system' ? (prefersDark ? 'dark' : 'light') : savedTheme 
    });
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <AccessibilityManager>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/recipes/:id" element={<RecipeDetail />} />
              <Route path="/guides" element={<BakingGuides />} />
              <Route path="/guides/:id" element={<GuideDetail />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/challenges/:id" element={<ChallengeDetail />} />
              <Route path="/recipe-converter" element={<RecipeConverter />} />
              <Route path="/tools-equipment" element={<ToolsAndEquipment />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/ai-assistant" element={<AiAssistant />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Router>
        </AccessibilityManager>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
