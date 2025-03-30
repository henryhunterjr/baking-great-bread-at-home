
import React, { useState, useEffect } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipeConverter from './pages/RecipeConverter';
import ComingSoon from './pages/ComingSoon';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import Books from './pages/Books';
import Recipes from './pages/Recipes';
import Challenges from './pages/Challenges';
import Contact from './pages/Contact';
import Tools from './pages/Tools';
import AIHome from './pages/AIHome';
import AIChat from './pages/AIChat';
import AffiliateCollection from './pages/AffiliateCollection';
import CareCenter from './pages/CareCenter';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import ChallengesArchive from './pages/ChallengesArchive';
import Settings from './pages/Settings';
import MyRecipes from './pages/MyRecipes';
import FavoritesPage from './pages/FavoritesPage';
import SkipToContent from './components/recipe-converter/accessibility/SkipToContent';
import { Toaster } from './components/ui/toaster';

function App() {
  // State for AI initialization - we'll default to true for now
  // In a real app, you might check if an API key is present
  const [aiInitialized, setAiInitialized] = useState(true);

  return (
    <>
      <SkipToContent />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipe-converter" element={<RecipeConverter />} />
        <Route path="/books" element={<Books />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/challenges/archive" element={<ChallengesArchive />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/ai" element={<AIHome aiInitialized={aiInitialized} />} />
        <Route path="/ai/chat" element={<AIChat />} />
        <Route path="/shop/:category" element={<AffiliateCollection />} />
        <Route path="/care-center" element={<CareCenter />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/auth/:mode" element={<AuthPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        
        <Route path="/" element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="my-recipes" element={<MyRecipes />} />
          <Route path="favorites" element={<FavoritesPage />} />
        </Route>
        
        <Route path="/community" element={<ComingSoon title="Community" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
