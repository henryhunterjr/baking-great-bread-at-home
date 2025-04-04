
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to scroll to top when route changes
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Immediately scroll to top without animation
    window.scrollTo(0, 0);
    
    // Also reset any history state that might be causing issues
    window.history.replaceState({}, document.title, pathname);
    
    // Additional scroll after a slight delay to ensure any dynamic content has loaded
    const timeoutId = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'auto'
      });
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [pathname]);
};
