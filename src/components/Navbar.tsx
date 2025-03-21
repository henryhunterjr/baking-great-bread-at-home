
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { useTheme } from '@/hooks/use-theme';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Books & Guides', path: '/books' },
    { name: 'Baking Tools', path: '/tools' },
    { name: 'Challenges', path: '/challenges' },
    // Removed Coaching link as requested
    { name: 'Blog', path: '/blog' },
    { name: 'App', path: '/app' },
    { name: 'Community', path: '/community' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4",
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 font-serif font-medium tracking-tight text-2xl">
            <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
              <span className="text-accent">Baking</span> Great Bread at Home
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path}
                className={cn(
                  "nav-link text-sm",
                  isActiveLink(link.path) && "active-nav-link"
                )}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Dark mode toggle */}
            <Toggle 
              pressed={theme === 'dark'} 
              onPressedChange={(pressed) => setTheme(pressed ? 'dark' : 'light')}
              aria-label="Toggle dark mode"
              className="ml-2"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Toggle>
          </nav>
          
          {/* Mobile menu button and dark mode toggle */}
          <div className="md:hidden flex items-center gap-2">
            <Toggle 
              pressed={theme === 'dark'} 
              onPressedChange={(pressed) => setTheme(pressed ? 'dark' : 'light')}
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Toggle>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div 
        className={cn(
          "fixed inset-0 bg-background/95 backdrop-blur-sm z-40 flex flex-col pt-24 px-6 transition-all duration-300 ease-in-out md:hidden",
          isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        )}
      >
        <nav className="flex flex-col space-y-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "text-xl py-2 px-4 w-full text-center transition-colors font-serif",
                isActiveLink(link.path) ? "text-accent font-medium" : "text-foreground/80 hover:text-accent"
              )}
              onClick={closeMobileMenu}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
