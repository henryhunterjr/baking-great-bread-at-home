
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from '@/components/auth/UserMenu';
import { Moon, Sun, Home, Coffee, Book, Calendar } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Link } from 'react-router-dom';

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#121823] text-white border-b border-gray-800 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center h-16 md:h-20">
        <Link 
          to="/"
          className="text-xl md:text-2xl font-bold font-serif text-bread-200 cursor-pointer"
        >
          Baking Great Bread At Home
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="nav-link flex items-center space-x-2 text-bread-300 hover:text-bread-200">
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link to="/recipes" className="nav-link flex items-center space-x-2 text-bread-300 hover:text-bread-200">
            <Coffee size={18} />
            <span>Recipes</span>
          </Link>
          <Link to="/guides" className="nav-link flex items-center space-x-2 text-bread-300 hover:text-bread-200">
            <Book size={18} />
            <span>Guides</span>
          </Link>
          <Link to="/challenges" className="nav-link flex items-center space-x-2 text-bread-300 hover:text-bread-200">
            <Calendar size={18} />
            <span>Challenges</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 text-bread-300" /> : <Moon className="h-5 w-5 text-bread-300" />}
          </button>
          
          {user ? (
            <UserMenu />
          ) : (
            <button 
              onClick={() => handleNavigation("/auth")}
              className="px-4 py-2 bg-bread-700 hover:bg-bread-600 text-white rounded-md transition-colors"
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
