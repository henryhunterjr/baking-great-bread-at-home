
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from '@/components/auth/UserMenu';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleHomeClick = () => {
    // Force a complete navigation reset
    navigate('/', { replace: true });
    // Clear any cached state that might be affecting navigation
    window.history.replaceState({}, document.title, '/');
    // Scroll to the top of the page
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center h-16 md:h-20">
        <button 
          onClick={handleHomeClick}
          className="text-xl md:text-2xl font-bold font-serif text-bread-900 cursor-pointer"
        >
          Recipe Converter
        </button>
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

export default Navbar;
