
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to scroll to top when route changes
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Immediately scroll to top
    window.scrollTo(0, 0);
    
    // For SPA navigation, also reset the scroll after a small delay
    // This helps with dynamic content loading
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [pathname]);
};
