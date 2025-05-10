
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Book, Calendar, Coffee } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen} disableRemoveScroll>
        <SheetTrigger asChild>
          <button
            className="p-2 rounded-md text-bread-800 dark:text-bread-200"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[250px] sm:w-[300px] bg-white dark:bg-gray-900 p-0">
          <nav className="space-y-4 p-4">
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
              to="/books"
              onClick={() => setIsOpen(false)}
              className="mobile-nav-link flex items-center space-x-2 text-bread-800 dark:text-bread-300"
            >
              <Book size={18} />
              <span>Books & Guides</span>
            </Link>
            <Link 
              to="/challenges"
              onClick={() => setIsOpen(false)}
              className="mobile-nav-link flex items-center space-x-2 text-bread-800 dark:text-bread-300"
            >
              <Calendar size={18} />
              <span>Challenges</span>
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;
