
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './hooks/use-theme';
import FloatingAIButton from './components/ai/FloatingAIButton';
import UserMenu from './components/auth/UserMenu';
import Navbar from './components/Navbar';
import Index from './pages/Index';
import Books from './pages/Books';
import Tools from './pages/Tools';
import ChallengesArchive from './pages/ChallengesArchive';
import Blog from './pages/Blog';
import AppStore from './pages/AppStore';
import Community from './pages/Community';
import ComingSoon from './pages/ComingSoon';

// Import other pages as needed
const MyRecipes = () => <div className="container mx-auto p-4">My Recipes Page</div>;
const Favorites = () => <div className="container mx-auto p-4">Favorites Page</div>;

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="baking-ui-theme">
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/books" element={<Books />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/challenges" element={<ChallengesArchive />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/app" element={<AppStore />} />
              <Route path="/community" element={<Community />} />
              <Route path="/contact" element={<ComingSoon />} />
              <Route path="/my-recipes" element={<MyRecipes />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </main>
          
          <FloatingAIButton />
          <Toaster />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
