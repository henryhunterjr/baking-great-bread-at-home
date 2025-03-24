
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { useTheme } from '@/hooks/use-theme';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const isHomePage = location.pathname === '/';

  const shouldAutoHide = !isHomePage;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = () => {
      setIsVisible(true);
      
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      
      if (shouldAutoHide) {
        hideTimeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, 2000);
      }
    };
    
    if (!shouldAutoHide) {
      setIsVisible(true);
      return;
    }
    
    hideTimeoutRef.current = setTimeout(() => {
      if (shouldAutoHide) {
        setIsVisible(false);
      }
    }, 2000);
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [shouldAutoHide]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      setIsVisible(true);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Books & Guides', path: '/books' },
    { name: 'Baking Tools', path: '/tools' },
    { name: 'Recipe Converter', path: '/recipe-converter' },
    { name: 'Challenge', path: '/challenge' },
    { name: 'Challenges Archive', path: '/challenges' },
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
        "top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isHomePage ? "relative" : "fixed",
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent",
        !isVisible && !isHomePage ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 py-3">
          <div className="flex-shrink-0 font-serif font-medium tracking-tight text-lg sm:text-xl md:text-2xl">
            <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
              <span className="text-accent">Baking</span> Great Bread at Home
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
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
            
            <div className="md:hidden">
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
        
        <div className="hidden md:block border-t border-muted/30 py-2 mb-1">
          <nav className="flex justify-center space-x-6 lg:space-x-8 items-center">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path}
                className={cn(
                  "nav-link text-sm py-1",
                  isActiveLink(link.path) && "active-nav-link"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-background/95 backdrop-blur-sm z-40 flex flex-col pt-24 px-6 transition-all duration-300 ease-in-out md:hidden"
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
      )}
    </header>
  );
};

export default Navbar;
