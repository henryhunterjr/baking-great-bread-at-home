
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from '@/components/auth/UserMenu';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  
  const handleNavigation = (path: string) => {
    // Force a full page refresh if already on the same page
    if (location.pathname === path) {
      window.location.href = path;
    } else {
      navigate(path);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center h-16 md:h-20">
        <button 
          onClick={() => handleNavigation("/")}
          className="text-xl md:text-2xl font-bold font-serif text-bread-900 dark:text-bread-200 cursor-pointer"
        >
          Baking Great Bread At Home
        </button>
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 text-bread-300" /> : <Moon className="h-5 w-5 text-bread-700" />}
          </button>
          
          {user ? (
            <UserMenu />
          ) : (
            <button 
              onClick={() => handleNavigation("/auth")}
              className="px-4 py-2 bg-bread-700 dark:bg-bread-800 hover:bg-bread-800 dark:hover:bg-bread-700 text-white rounded-md transition-colors"
            >
              Login / Signup
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
