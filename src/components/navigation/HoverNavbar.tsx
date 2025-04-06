
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from '@/components/auth/UserMenu';
import { Home, Book, Calendar, Coffee } from 'lucide-react';

const HoverNavbar: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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
    }, 2000);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(initialTimeout);
    };
  }, [visible]);

  // Enhanced navigation handler to prevent getting stuck
  const handleNavigation = (path: string) => {
    // Force a full page refresh if already on the same page
    if (location.pathname === path) {
      window.location.href = path;
    } else {
      navigate(path);
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm transition-transform duration-300 ${visible ? 'transform-none' : '-translate-y-full'}`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center h-16 md:h-20">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleNavigation("/")}
            className="text-xl md:text-2xl font-bold font-serif text-bread-900 cursor-pointer"
          >
            Baking Great Bread
          </button>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <button onClick={() => handleNavigation("/")} className="nav-link flex items-center space-x-2 text-bread-800 hover:text-bread-600">
            <Home size={18} />
            <span>Home</span>
          </button>
          <button onClick={() => handleNavigation("/recipes")} className="nav-link flex items-center space-x-2 text-bread-800 hover:text-bread-600">
            <Coffee size={18} />
            <span>Recipes</span>
          </button>
          <button onClick={() => handleNavigation("/guides")} className="nav-link flex items-center space-x-2 text-bread-800 hover:text-bread-600">
            <Book size={18} />
            <span>Guides</span>
          </button>
          <button onClick={() => handleNavigation("/challenges")} className="nav-link flex items-center space-x-2 text-bread-800 hover:text-bread-600">
            <Calendar size={18} />
            <span>Challenges</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <UserMenu />
          ) : (
            <button 
              onClick={() => handleNavigation("/auth")}
              className="px-4 py-2 bg-bread-700 hover:bg-bread-800 text-white rounded-md transition-colors"
            >
              Login / Signup
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default HoverNavbar;
