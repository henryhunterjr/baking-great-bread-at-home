
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './hooks/use-theme';
import FloatingAIButton from './components/ai/FloatingAIButton';
import UserMenu from './components/auth/UserMenu';
import Index from './pages/Index';

// Import other pages as needed
const MyRecipes = () => <div className="container mx-auto p-4">My Recipes Page</div>;
const Favorites = () => <div className="container mx-auto p-4">Favorites Page</div>;

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="baking-ui-theme">
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
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
