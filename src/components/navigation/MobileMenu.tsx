
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, Book, Calendar, Coffee } from 'lucide-react';

const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

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
        <div className="mobile-nav-menu fixed top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-md z-50 p-4 space-y-4">
          <Link 
            to="/"
            onClick={() => setIsOpen(false)}
            className="mobile-nav-link flex items-center space-x-2 text-bread-800 dark:text-bread-300"
          >
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link 
            to="/recipes"
            onClick={() => setIsOpen(false)}
            className="mobile-nav-link flex items-center space-x-2 text-bread-800 dark:text-bread-300"
          >
            <Coffee size={18} />
            <span>Recipes</span>
          </Link>
          <Link 
            to="/recipe-converter"
            onClick={() => setIsOpen(false)}
            className="mobile-nav-link flex items-center space-x-2 text-bread-800 dark:text-bread-300"
          >
            <Book size={18} />
            <span>Recipe Converter</span>
          </Link>
          <Link 
            to="/guides"
            onClick={() => setIsOpen(false)}
            className="mobile-nav-link flex items-center space-x-2 text-bread-800 dark:text-bread-300"
          >
            <Book size={18} />
            <span>Guides</span>
          </Link>
          <Link 
            to="/challenges"
            onClick={() => setIsOpen(false)}
            className="mobile-nav-link flex items-center space-x-2 text-bread-800 dark:text-bread-300"
          >
            <Calendar size={18} />
            <span>Challenges</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
