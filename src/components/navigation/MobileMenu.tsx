
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, Book, Calendar, Coffee } from 'lucide-react';

const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    // Force a full page refresh if already on the same page
    if (location.pathname === path) {
      window.location.href = path;
    } else {
      navigate(path);
    }
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md text-bread-800 dark:text-bread-200"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="mobile-nav-menu">
          <button 
            onClick={() => handleNavigation("/")}
            className="mobile-nav-link flex items-center space-x-2 text-bread-800 dark:text-bread-300"
          >
            <Home size={18} />
            <span>Home</span>
          </button>
          <button 
            onClick={() => handleNavigation("/recipes")}
            className="mobile-nav-link flex items-center space-x-2 text-bread-800 dark:text-bread-300"
          >
            <Coffee size={18} />
            <span>Recipes</span>
          </button>
          <button 
            onClick={() => handleNavigation("/guides")}
            className="mobile-nav-link flex items-center space-x-2 text-bread-800 dark:text-bread-300"
          >
            <Book size={18} />
            <span>Guides</span>
          </button>
          <button 
            onClick={() => handleNavigation("/challenges")}
            className="mobile-nav-link flex items-center space-x-2 text-bread-800 dark:text-bread-300"
          >
            <Calendar size={18} />
            <span>Challenges</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
