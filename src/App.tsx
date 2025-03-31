
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { initializeWorkers } from './utils/worker-setup';
import { logInfo } from './utils/logger';
import { useScrollToTop } from './hooks/use-scroll-to-top';

// Pages
import HomePage from './pages/HomePage';
import Recipes from './pages/Recipes';
import RecipePage from './pages/BlogPost'; // Using BlogPost for RecipeDetail
import BakingGuides from './pages/Blog'; // Using Blog for BakingGuides
import GuideDetail from './pages/BlogPage'; // Using BlogPage for GuideDetail
import Challenges from './pages/Challenges';
import ChallengeDetail from './pages/PastChallenges'; // Using PastChallenges for ChallengeDetail
import RecipeConverter from './pages/RecipeConverter';
import Contact from './pages/Contact';
import About from './pages/About';
import ToolsAndEquipment from './pages/Tools'; // Using Tools for ToolsAndEquipment
import ProfilePage from './pages/ProfilePage'; // Using ProfilePage instead of Profile
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import AiAssistant from './pages/AIChat'; // Using AIChat for AiAssistant
import { Toaster } from './components/ui/toaster';

// Contexts and Providers
import { AuthProvider } from './contexts/AuthContext';
import AccessibilityManager from './components/recipe-converter/accessibility/AccessibilityManager';

function App() {
  // Add scroll to top hook for better navigation UX
  useScrollToTop();

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
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipes/:id" element={<RecipePage />} />
            <Route path="/guides" element={<BakingGuides />} />
            <Route path="/guides/:id" element={<GuideDetail />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/challenges/:id" element={<ChallengeDetail />} />
            <Route path="/recipe-converter" element={<RecipeConverter />} />
            <Route path="/tools-equipment" element={<ToolsAndEquipment />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/ai-assistant" element={<AiAssistant />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AccessibilityManager>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
