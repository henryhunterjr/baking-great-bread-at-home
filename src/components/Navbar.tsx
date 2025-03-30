import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { useTheme } from '@/contexts/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import UserMenu from './auth/UserMenu';
import { toast } from 'sonner';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const isHomePage = location.pathname === '/';
  const isAIPage = location.pathname.startsWith('/ai');

  const shouldAutoHide = !isHomePage && !isAIPage;

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

  const handleGoHome = () => {
    navigate('/');
    closeMobileMenu();
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Books & Guides', path: '/books' },
    { name: 'Baking Tools', path: '/tools' },
    { name: 'Recipe Converter', path: '/recipe-converter' },
    { name: 'Challenges', path: '/challenges' },
    { name: 'Blog', path: '/blog' },
    { name: 'AI', path: '/ai' },
    { name: 'Community', path: '/community' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  const navbarClasses = cn(
    "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
    isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
    "transition-opacity duration-300"
  );

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    toast.success(`${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode activated`);
  };

  return (
    <header className={navbarClasses}>
      <div className="container flex h-14 items-center">
        <div className="flex-shrink-0 font-serif font-medium tracking-tight text-lg sm:text-xl md:text-2xl">
          <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
            <span className="text-accent">Baking</span> Great Bread at Home
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Add any search components here */}
          </div>
          <nav className="flex items-center space-x-2">
            {isAIPage && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleGoHome}
                className="mr-2"
              >
                <Home className="h-4 w-4 mr-1" />
                Home
              </Button>
            )}
            
            <UserMenu />
            
            <Toggle 
              pressed={theme === 'dark'} 
              onPressedChange={toggleTheme}
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
          </nav>
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
                isActiveLink(link.path) ? "active-nav-link font-medium text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>
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
