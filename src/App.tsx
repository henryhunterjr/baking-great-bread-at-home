
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';
import FloatingAIButton from './components/ai/FloatingAIButton';
import UserMenu from './components/auth/UserMenu';

// Import pages as needed
// This is a placeholder for your actual pages
const Home = () => <div className="container mx-auto p-4">Home Page</div>;
const MyRecipes = () => <div className="container mx-auto p-4">My Recipes Page</div>;
const Favorites = () => <div className="container mx-auto p-4">Favorites Page</div>;

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <header className="border-b py-3 px-4 sm:px-6 md:px-8 bg-white">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <a href="/" className="text-xl font-serif font-bold text-bread-800">
                Baking Great Bread
              </a>
            </div>
            
            <nav className="flex items-center space-x-4">
              <UserMenu />
            </nav>
          </div>
        </header>
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/my-recipes" element={<MyRecipes />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </main>
        
        <FloatingAIButton />
        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default App;
