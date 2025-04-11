
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from '@/components/auth/UserMenu';
import { Home, Book, Calendar, Coffee, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import MobileMenu from './MobileMenu';

const HoverNavbar: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const { user } = useAuth();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  // Show navbar when mouse is near top of screen or on scroll to top
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY <= 50) {
        setVisible(true);
      } else if (e.clientY > 100) {
        setVisible(false);
      }
    };

    const handleScroll = () => {
      if (window.scrollY < 50) {
        setVisible(true);
      } else if (!visible && window.scrollY > 100) {
        setVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    // Initial check - always show navbar first
    setVisible(true);
    
    // Hide after initial display if not at top
    const initialTimeout = setTimeout(() => {
      if (window.scrollY > 50) {
        setVisible(false);
      }
    }, 5000); // Increased from 2000 to 5000ms
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(initialTimeout);
    };
  }, [visible]);

  // Toggle theme between light and dark
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      {/* Add a hover detection area at the top of the page */}
      <div className="nav-hover-area" aria-hidden="true"></div>
      
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-transform duration-300 ${visible ? 'transform-none' : '-translate-y-full'}`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center space-x-2">
            <Link
              to="/"
              className="text-xl md:text-2xl font-bold font-serif text-bread-900 dark:text-bread-200 cursor-pointer"
            >
              Baking Great Bread At Home
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="nav-link flex items-center space-x-2 text-bread-800 dark:text-bread-300 hover:text-bread-600 dark:hover:text-bread-200">
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link to="/recipes" className="nav-link flex items-center space-x-2 text-bread-800 dark:text-bread-300 hover:text-bread-600 dark:hover:text-bread-200">
              <Coffee size={18} />
              <span>Recipes</span>
            </Link>
            <Link to="/recipe-converter" className="nav-link flex items-center space-x-2 text-bread-800 dark:text-bread-300 hover:text-bread-600 dark:hover:text-bread-200">
              <Book size={18} />
              <span>Recipe Converter</span>
            </Link>
            <Link to="/guides" className="nav-link flex items-center space-x-2 text-bread-800 dark:text-bread-300 hover:text-bread-600 dark:hover:text-bread-200">
              <Book size={18} />
              <span>Guides</span>
            </Link>
            <Link to="/challenges" className="nav-link flex items-center space-x-2 text-bread-800 dark:text-bread-300 hover:text-bread-600 dark:hover:text-bread-200">
              <Calendar size={18} />
              <span>Challenges</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Mobile Menu */}
            <MobileMenu />
            
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
              <Link 
                to="/auth"
                className="px-4 py-2 bg-bread-700 dark:bg-bread-800 hover:bg-bread-800 dark:hover:bg-bread-700 text-white rounded-md transition-colors"
              >
                Login / Signup
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default HoverNavbar;
