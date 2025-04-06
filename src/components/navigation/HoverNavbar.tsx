
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from '@/components/auth/UserMenu';
import { Home, Book, Calendar, Coffee } from 'lucide-react';

const HoverNavbar: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const { user } = useAuth();

  // Show navbar when mouse is near top of screen
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Show navbar when mouse is within 50px of the top
      if (e.clientY <= 50) {
        setVisible(true);
      } else if (e.clientY > 100) {
        setVisible(false);
      }
    };

    // Also show navbar on scroll to top
    const handleScroll = () => {
      if (window.scrollY < 50) {
        setVisible(true);
      } else if (!visible && window.scrollY > 100) {
        setVisible(false);
      }
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    // Initial check - show navbar if already at top of page
    if (window.scrollY < 50) {
      setVisible(true);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [visible]);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm transition-transform duration-300 ${visible ? 'transform-none' : '-translate-y-full'}`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center h-16 md:h-20">
        <div className="flex items-center space-x-2">
          <Link 
            to="/"
            className="text-xl md:text-2xl font-bold font-serif text-bread-900 cursor-pointer"
          >
            Baking Great Bread
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="nav-link flex items-center space-x-2 text-bread-800 hover:text-bread-600">
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link to="/recipes" className="nav-link flex items-center space-x-2 text-bread-800 hover:text-bread-600">
            <Coffee size={18} />
            <span>Recipes</span>
          </Link>
          <Link to="/guides" className="nav-link flex items-center space-x-2 text-bread-800 hover:text-bread-600">
            <Book size={18} />
            <span>Guides</span>
          </Link>
          <Link to="/challenges" className="nav-link flex items-center space-x-2 text-bread-800 hover:text-bread-600">
            <Calendar size={18} />
            <span>Challenges</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <UserMenu />
          ) : (
            <Link 
              to="/auth" 
              className="px-4 py-2 bg-bread-700 hover:bg-bread-800 text-white rounded-md transition-colors"
            >
              Login / Signup
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default HoverNavbar;
